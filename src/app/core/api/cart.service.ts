import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddCartItemRequest, UpdateCartItemRequest, CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
    private http = inject(HttpClient);

    addItem(body: AddCartItemRequest) {
        return this.http.post<void>('/api/cart/items', body);
    }

    listItems() {
        return this.http.get<CartItem[]>('/api/cart/items');
    }

    updateItem(productId: number, body: UpdateCartItemRequest) {
        return this.http.patch<void>(`/api/cart/items/${productId}`, body);
    }

    removeItem(productId: number) {
        return this.http.delete<void>(`/api/cart/items/${productId}`);
    }
}
