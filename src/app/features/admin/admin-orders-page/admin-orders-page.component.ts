import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

import { AdminOrdersService } from '../../../core/api/admin-orders.service';
import { AdminOrderSummary } from '../../../core/models/order.model';
import { OrderLinesDialogComponent } from './order-lines-dialog.component';

@Component({
    selector: 'app-admin-orders-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        DatePipe,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatTooltipModule,
        MatDividerModule,
        MatChipsModule,
    ],
    templateUrl: './admin-orders-page.component.html',
    styleUrls: ['./admin-orders-page.component.scss'],
})
export class AdminOrdersPageComponent {
    private api = inject(AdminOrdersService);
    private snack = inject(MatSnackBar);
    private dialog = inject(MatDialog);

    loading = signal(true);
    rows = signal<AdminOrderSummary[]>([]);
    displayedColumns = ['id', 'userEmail', 'createdAt', 'actions'];

    ngOnInit() { this.reload(); }

    reload() {
        this.loading.set(true);
        this.api.list().subscribe({
            next: list => { this.rows.set(list ?? []); this.loading.set(false); },
            error: () => {
                this.rows.set([]); this.loading.set(false);
                this.snack.open('Failed to load orders', 'Dismiss', { duration: 2500 });
            }
        });
    }

    viewLines(order: AdminOrderSummary) {
        this.dialog.open(OrderLinesDialogComponent, {
            data: { orderId: order.id, userEmail: order.userEmail, createdAt: order.createdAt },
            width: '720px',
            autoFocus: true,
            restoreFocus: true,
        });
    }
}
