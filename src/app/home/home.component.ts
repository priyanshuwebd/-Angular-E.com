import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  productList: product[] = [];//hold the list of prod frm api
  currentPage: number = 1; // track C.P.NO in pagination
  itemsPerPage: number = 10; // to display perpage for pagination
  totalItems: number = 0;  //for calculating pagination
  paginationArray: number[] = []; //  store P.NO for Pagination nevigation
  searchQuery: string = '';    // current searchquery entered by the user
  searchQueryChange = new Subject<string>(); //emit changes in searchquery
  apiError: boolean = false; // To track API errors
  visiblePages: number[] = []; // To store pages visible in pagination
  maxVisiblePages: number = 5; // Number of visible pages in pagination

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    // hitting the function load product
    this.loadProducts();

    // Debounce search query changes
    this.searchQueryChange.pipe(debounceTime(300)).subscribe((query) => {
      if (query.length >= 4) {
        this.currentPage = 1; // Reset to the first page on new search
        this.filterProducts();
      } else if (query.length === 0) {
        this.loadProducts(); // Reload original products if the query is cleared
      }
    });
  }

  loadProducts(): void {
    this.apiError = false; // Reset error flag before API call
    if (this.searchQuery && this.searchQuery.length >= 4) {
      this.filterProducts(); // Perform search with the current query
    } else {
      // hitting the api to get all products
      this.productService.productList(this.currentPage, this.itemsPerPage).subscribe({
        next: (data) => {
          this.productList = data.products;
          this.totalItems = data.total;
          // claculating pagination
          this.updatePagination();
        },
        error: () => {
          this.apiError = true; // Set error flag on failure
        },
      });
    }
  }

  filterProducts(): void {
    this.apiError = false; // Reset error flag before API call
    if (this.searchQuery.length >= 4) {
      const skip = (this.currentPage - 1) * this.itemsPerPage;
      this.productService.searchProduct(this.searchQuery, skip, this.itemsPerPage).subscribe({
        next: (data) => {
          this.productList = data.products;
          this.totalItems = data.total;
          this.updatePagination();
        },
        error: () => {
          this.apiError = true; // Set error flag on failure
        },
      });
    } else {
      this.loadProducts(); // Reload original products if search query is cleared
    }
  }

  updatePagination(): void {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
  
    // Adjust visible range
    const startPage = Math.max(this.currentPage - Math.floor(this.maxVisiblePages / 2), 1);
    const endPage = Math.min(startPage + this.maxVisiblePages - 1, totalPages);
  
    this.paginationArray = Array.from({ length: totalPages }, (_, i) => i + 1);
    this.visiblePages = this.paginationArray.slice(startPage - 1, endPage);
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.paginationArray.length) {
      this.currentPage = page;
      this.updatePagination();
      if (this.searchQuery && this.searchQuery.length >= 4) {
        this.filterProducts();
      } else {
        this.loadProducts();
      }
    }
  }

  nextPage(): void {
    if (this.currentPage < this.paginationArray.length) {
      this.currentPage++;
      if (this.searchQuery) {
        this.filterProducts();
      } else {
        this.loadProducts();
      }
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      if (this.searchQuery) {
        this.filterProducts();
      } else {
        this.loadProducts();
      }
    }
  }

  onSearchQueryChange(query: string): void {
    this.searchQueryChange.next(query.trim());
  }

  retry(): void {
    // Retry the last operation
    this.loadProducts();
  }
}
