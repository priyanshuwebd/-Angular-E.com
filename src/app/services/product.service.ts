import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, product } from '../data-type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ProductService {
  constructor(private http: HttpClient) { }


  productList(page: number = 1, limit: number = 10): Observable<ApiResponse> {
    const skip = (page - 1) * limit;
    return this.http.get<ApiResponse>(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
  }

  searchProduct(query: string, skip: number = 0, limit: number = 10): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `https://dummyjson.com/products/search?q=${query}&skip=${skip}&limit=${limit}`
    );
  }
  

  getProduct(id: string) {
    return this.http.get<product>(`https://dummyjson.com/products/${id}`);
  }
}
