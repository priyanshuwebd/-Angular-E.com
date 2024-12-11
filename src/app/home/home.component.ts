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
  productList: product[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  paginationArray: number[] = [];
  searchQuery: string = '';
  searchQueryChange = new Subject<string>();

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();

    // Debounce search query changes
    this.searchQueryChange.pipe(debounceTime(300)).subscribe((query) => {
      this.currentPage = 1; // Reset to the first page on new search
      console.log("calling filter products")
      this.filterProducts();
    });
  }

  loadProducts(): void {
    if (this.searchQuery) {
      this.filterProducts(); // Perform search with the current query
    } else {
      this.productService.productList(this.currentPage, this.itemsPerPage).subscribe({
        next: (data) => {
          console.log("initial data", data)
          this.productList = data.products;
          this.totalItems = data.total;
          this.updatePagination();
        },
        error: (err) => {
          console.error('Error fetching products:', err);
        },
      });
    }
  }

  filterProducts(): void {
    if (this.searchQuery) {
      console.log("this.searchQuery", this.searchQuery)
      const skip = (this.currentPage - 1) * this.itemsPerPage;
      console.log("skip", skip)
      this.productService.searchProduct(this.searchQuery, skip, this.itemsPerPage).subscribe({
        next: (data) => {
          console.log("data", data)
          this.productList = data.products;
          this.totalItems = data.total; // Update total items for pagination
          this.updatePagination(); // Recalculate pagination
        },
        error: (err) => {
          console.error('Error searching products:', err);
        },
      });
    } else {
      this.loadProducts(); // Reload original products if search query is cleared
    }
  }

  updatePagination(): void {
    this.paginationArray = Array.from(
      { length: Math.ceil(this.totalItems / this.itemsPerPage) },
      (_, i) => i + 1
    );
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.paginationArray.length) {
      this.currentPage = page;
      if (this.searchQuery) {
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
    this.searchQueryChange.next(query);
  }
}
