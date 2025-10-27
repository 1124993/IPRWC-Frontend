import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OrdersService } from '../../../core/api/orders.service';
import { OrderLine } from '../../../core/models/order.model';

@Component({
    selector: 'app-order-lines-page',
    standalone: true,
    imports: [
        CommonModule,
        CurrencyPipe,
        DatePipe,
        RouterLink,
        MatCardModule,
        MatIconModule,
        MatButtonModule,
        MatListModule,
        MatDividerModule,
        MatProgressSpinnerModule,
    ],
    templateUrl: './order-lines-page.component.html',
    styleUrls: ['./order-lines-page.component.scss'],
})
export class OrderLinesPageComponent {
    private route = inject(ActivatedRoute);
    private ordersApi = inject(OrdersService);

    orderId = signal<number | null>(null);
    loading = signal(true);
    lines = signal<OrderLine[]>([]);
    total = computed(() => this.lines().reduce((s, l) => s + Number(l.lineTotal || 0), 0));

    ngOnInit() {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        if (!Number.isFinite(id)) return;
        this.orderId.set(id);
        this.ordersApi.lines(id).subscribe({
            next: rows => { this.lines.set(rows ?? []); this.loading.set(false); },
            error: () => { this.lines.set([]); this.loading.set(false); }
        });
    }
}
