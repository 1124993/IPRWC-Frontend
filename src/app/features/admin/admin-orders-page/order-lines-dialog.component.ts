import { Component, Inject, inject, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AdminOrdersService } from '../../../core/api/admin-orders.service';
import { OrderLine } from '../../../core/models/order.model';

export interface OrderLinesDialogData {
    orderId: number;
    userEmail: string;
    createdAt: string;
}

@Component({
    selector: 'app-order-lines-dialog',
    standalone: true,
    imports: [
        CommonModule,
        CurrencyPipe,
        DatePipe,
        MatDialogModule,
        MatListModule,
        MatDividerModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './order-lines-dialog.component.html',
    styleUrls: ['./order-lines-dialog.component.scss'],
})
export class OrderLinesDialogComponent {
    private api = inject(AdminOrdersService);
    private ref = inject(MatDialogRef<OrderLinesDialogComponent, void>);

    constructor(@Inject(MAT_DIALOG_DATA) public data: OrderLinesDialogData) { }

    loading = signal(true);
    lines = signal<OrderLine[]>([]);

    total = computed(() => this.lines().reduce((s, l) => s + Number(l.lineTotal || 0), 0));

    ngOnInit() {
        this.api.lines(this.data.orderId).subscribe({
            next: rows => { this.lines.set(rows ?? []); this.loading.set(false); },
            error: () => { this.lines.set([]); this.loading.set(false); }
        });
    }

    close() { this.ref.close(); }
}
