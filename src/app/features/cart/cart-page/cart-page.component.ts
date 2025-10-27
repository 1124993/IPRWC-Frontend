import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { CartService } from '../../../core/api/cart.service';
import { CartItem } from '../../../core/models/cart.model';
import { CartStore } from '../../../core/state/cart.store';
import { OrdersService } from '../../../core/api/orders.service'; // ✅ NEW

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss'],
})
export class CartPageComponent {
  private cart = inject(CartService);
  private snack = inject(MatSnackBar);
  private cartStore = inject(CartStore);
  private orders = inject(OrdersService); // ✅ NEW
  private router = inject(Router);        // ✅ NEW

  readonly loading = signal<boolean>(true);
  readonly items = signal<CartItem[]>([]);

  readonly total = computed(() =>
    this.items().reduce((sum, it) => sum + it.lineTotal, 0)
  );

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.loading.set(true);
    this.cart.listItems().subscribe({
      next: (list) => {
        this.items.set(list ?? []);
        this.loading.set(false);
        this.cartStore.refresh();
      },
      error: () => {
        this.items.set([]);
        this.loading.set(false);
        this.snack.open('Failed to load cart', 'Dismiss', { duration: 2500 });
      }
    });
  }

  inc(it: CartItem) { this.setQty(it.productId, it.quantity + 1); }
  dec(it: CartItem) { if (it.quantity > 1) this.setQty(it.productId, it.quantity - 1); }

  setQty(productId: number, qty: number) {
    this.cart.updateItem(productId, { quantity: qty }).subscribe({
      next: () => {
        const list = this.items().map(i =>
          i.productId === productId ? { ...i, quantity: qty, lineTotal: qty * i.price } : i
        );
        this.items.set(list);
        this.cartStore.refresh();
      },
      error: () => this.snack.open('Could not update quantity', 'Dismiss', { duration: 2000 })
    });
  }

  remove(it: CartItem) {
    this.cart.removeItem(it.productId).subscribe({
      next: () => {
        this.items.set(this.items().filter(x => x.productId !== it.productId));
        this.snack.open('Item removed', 'OK', { duration: 1500 });
        this.cartStore.refresh();
      },
      error: () => this.snack.open('Could not remove item', 'Dismiss', { duration: 2000 })
    });
  }

  // ✅ NEW — Checkout flow
  checkout() {
    if (this.items().length === 0) return;

    this.loading.set(true);
    this.orders.checkout().subscribe({
      next: ({ orderId }) => {
        this.snack.open(`Order #${orderId} created!`, 'OK', { duration: 2500 });
        this.cartStore.clear();           // clear badge & cart state locally
        this.items.set([]);               // clear current view
        this.loading.set(false);
        this.router.navigate(['/orders']); // go to My Orders
      },
      error: () => {
        this.loading.set(false);
        this.snack.open('Checkout failed', 'Dismiss', { duration: 2500 });
      }
    });
  }
}
