import { Injectable, inject } from '@angular/core';
import { ApiHttp } from './api-http.service';
import { Product } from '../models';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private api = inject(ApiHttp);

  getProducts(category?: string) {
    const url = category ? `/api/products?category=${encodeURIComponent(category)}` : '/api/products';
    return this.api.get<Product[]>(url);
  }

  getProduct(id: number) {
    return this.api.get<Product>(`/api/products/${id}`);
  }
}
