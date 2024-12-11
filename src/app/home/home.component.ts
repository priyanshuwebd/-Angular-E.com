import { Component, OnInit } from '@angular/core';
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  productList: product[] = [];// Initialize as an empty array
  currentPage: number = 1;
  itemsPerPage: number = 10;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {


    this.productService.productList().subscribe({
      next: (data) => {
        console.log(data.products); // Verify structure of response
        this.productList = data.products; // Extract the 'products' array
      },

      error: (err) => {
        console.error('Error fetching products:', err);
      },
    });
  }
  fetchProducts() {
    throw new Error('Method not implemented.');
  }
}
