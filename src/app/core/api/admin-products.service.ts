import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class AdminProductsService {
    private http = inject(HttpClient);

    list() {
        return this.http.get<Product[]>('/api/admin/products');
    }

    get(id: number) {
        return this.http.get<Product>(`/api/admin/products/${id}`);
    }

    // We’ll use these in the next steps (dialogs)
    create(body: {
        name: string;
        price: number;
        stock: number;
        imageUrl?: string | null;
        description?: string | null;
        category?: 'MEN' | 'WOMEN' | 'UNISEX';
    }) {
        return this.http.post<Product>('/api/admin/products', body);
    }

    update(id: number, body: {
        name: string;
        price: number;
        stock: number;
        imageUrl?: string | null;
        description?: string | null;
        category?: 'MEN' | 'WOMEN' | 'UNISEX';
    }) {
        return this.http.put<Product>(`/api/admin/products/${id}`, body);
    }

    archive(id: number) {
        return this.http.patch<void>(`/api/admin/products/${id}/archive`, {});
    }

    unarchive(id: number) {
        return this.http.patch<void>(`/api/admin/products/${id}/unarchive`, {});
    }
}
