import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AdminOrderSummary, OrderLine } from '../models/order.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminOrdersService {
    private http = inject(HttpClient);

    list(): Observable<AdminOrderSummary[]> {
        return this.http.get<AdminOrderSummary[]>('/api/admin/orders');
    }

    lines(orderId: number): Observable<OrderLine[]> {
        return this.http.get<OrderLine[]>(`/api/admin/orders/${orderId}/lines`);
    }
}
