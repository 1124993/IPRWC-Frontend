import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderDto, OrderLine } from '../models/order.model';
import { Observable } from 'rxjs';

interface CheckoutResponse { orderId: number; }

@Injectable({ providedIn: 'root' })
export class OrdersService {
    private http = inject(HttpClient);

    /** POST /api/orders/checkout -> { orderId } */
    checkout(): Observable<CheckoutResponse> {
        return this.http.post<CheckoutResponse>('/api/orders/checkout', {});
    }

    /** GET /api/orders -> OrderDto[] (my orders) */
    myOrders(): Observable<OrderDto[]> {
        return this.http.get<OrderDto[]>('/api/orders');
    }

    /** GET /api/orders/{id}/lines -> OrderLine[] */
    lines(orderId: number): Observable<OrderLine[]> {
        return this.http.get<OrderLine[]>(`/api/orders/${orderId}/lines`);
    }
}
