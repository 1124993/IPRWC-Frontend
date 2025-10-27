import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { ProductsService } from '../../../core/api/products.service';
import { Product } from '../../../core/models/product.model';

type SortBy = 'name' | 'price';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
  ],
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss'],
})
export class ProductsListComponent {
  private productsApi = inject(ProductsService);

  // raw data
  private _products = signal<Product[]>([]);
  loading = signal<boolean>(true);

  // distinct categories derived from products (sorted)
  readonly categories = computed(() => {
    const set = new Set(
      (this._products() ?? [])
        .map(p => (p.category ?? '').toString().trim())
        .filter(Boolean)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

  // filter state: null = All
  selectedCategory = signal<string | null>(null);

  // sorting state
  sortBy = signal<SortBy>('name');   // 'name' | 'price'
  sortDir = signal<SortDir>('asc');  // 'asc' | 'desc'

  // filtered list according to selectedCategory
  readonly filteredProducts = computed(() => {
    const cat = this.selectedCategory();
    const list = this._products();
    if (!cat) return list;
    return list.filter(p => (p.category ?? '').toString().trim() === cat);
  });

  // sorted view the grid uses
  readonly sortedProducts = computed(() => {
    const items = [...this.filteredProducts()];
    const by = this.sortBy();
    const dir = this.sortDir();

    items.sort((a, b) => {
      let cmp = 0;

      if (by === 'name') {
        const an = (a.name ?? '').toString();
        const bn = (b.name ?? '').toString();
        cmp = an.localeCompare(bn, undefined, { sensitivity: 'base' });
      } else {
        // price sort; ensure numbers
        const ap = Number(a.price ?? 0);
        const bp = Number(b.price ?? 0);
        cmp = ap - bp;
      }

      return dir === 'asc' ? cmp : -cmp;
    });

    return items;
  });

  ngOnInit() {
    this.load();
  }

  private load() {
    this.loading.set(true);
    this.productsApi.getProducts().subscribe({
      next: (list) => {
        this._products.set(list ?? []);
        this.loading.set(false);
      },
      error: () => {
        this._products.set([]);
        this.loading.set(false);
      },
    });
  }

  selectCategory(cat: string | null) {
    if (this.selectedCategory() === cat) {
      this.selectedCategory.set(null); // toggle off → All
    } else {
      this.selectedCategory.set(cat);
    }
  }

  setSortBy(by: SortBy) {
    this.sortBy.set(by);
  }

  toggleSortDir() {
    this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
  }

  // optional getters for template readability
  products = () => this._products();
}
