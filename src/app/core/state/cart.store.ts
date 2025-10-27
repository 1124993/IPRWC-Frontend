import { Injectable, computed, signal, inject } from '@angular/core';
import { CartService } from '../api/cart.service';
import { CartItem } from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartStore {
    private api = inject(CartService);

    private _items = signal<CartItem[] | null>(null);
    readonly items = computed(() => this._items() ?? []);
    readonly totalQty = computed(() =>
        this.items().reduce((sum, it) => sum + (Number(it.quantity) || 0), 0)
    );

    refresh() {
        this.api.listItems().subscribe({
            next: (list) => this._items.set(list ?? []),
            error: () => this._items.set([]),
        });
    }

    clear() {
        this._items.set([]);
    }
}
