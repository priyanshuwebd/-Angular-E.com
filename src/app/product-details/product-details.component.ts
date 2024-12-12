import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { product } from '../data-type';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | product;
  productQuantity: number = 1;
  removeCart = false;
  cartData: product | undefined;

  constructor(
    private activeRoute: ActivatedRoute,
    private product: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Extract productId from the route
    let productId = this.activeRoute.snapshot.paramMap.get('productId');
    console.log(productId);

    // Fetch product data if productId is available
    if (productId) {
      this.product.getProduct(productId).subscribe((result) => {
        console.log("result", result);
        this.productData = result;
      });
    } else {
      this.router.navigate(['/']);
    }
  }

  handleQuantity(val: string): void {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'min') {
      this.productQuantity -= 1;
    }
  }
}
