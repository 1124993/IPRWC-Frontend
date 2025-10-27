import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { OrdersService } from '../../../core/api/orders.service';
import { OrderDto, OrderLine } from '../../../core/models/order.model';

import { Observable, forkJoin, map, of, switchMap } from 'rxjs';

@Component({
    selector: 'app-orders-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        DatePipe,
        CurrencyPipe,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatListModule,
        MatDividerModule,
    ],
    templateUrl: './orders-page.component.html',
    styleUrls: ['./orders-page.component.scss'],
})
export class OrdersPageComponent {
    private ordersApi = inject(OrdersService);
    private snack = inject(MatSnackBar);

    loading = signal(true);
    orders = signal<OrderDto[]>([]);

    ngOnInit() {
        this.reload();
    }

    reload() {
        this.loading.set(true);
        this.ordersApi.myOrders().subscribe({
            next: list => { this.orders.set((list ?? []).sort((a, b) => b.id - a.id)); this.loading.set(false); },
            error: () => {
                this.orders.set([]); this.loading.set(false);
                this.snack.open('Failed to load orders', 'Dismiss', { duration: 2500 });
            }
        });
    }
}
