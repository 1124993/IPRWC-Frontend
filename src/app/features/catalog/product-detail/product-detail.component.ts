import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { switchMap, catchError, of } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductsService } from '../../../core/api/products.service';
import { Product } from '../../../core/models/product.model';
import { AuthService } from '../../../core/auth/auth.service';
import { CartService } from '../../../core/api/cart.service';
import { CartStore } from '../../../core/state/cart.store';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private products = inject(ProductsService);
  private auth = inject(AuthService);
  private cart = inject(CartService);
  private snack = inject(MatSnackBar);
  private cartStore = inject(CartStore); // for navbar badge refresh

  // load product by :id from route
  readonly product = toSignal<Product | null>(
    this.route.paramMap.pipe(
      switchMap((params) => {
        const id = Number(params.get('id'));
        if (Number.isNaN(id)) return of(null);
        return this.products.getProduct(id).pipe(catchError(() => of(null)));
      })
    ),
    { initialValue: null }
  );

  isLoggedIn() {
    return this.auth.isAuthenticated();
  }

  addToCart() {
    const p = this.product();
    if (!p) return;

    this.cart.addItem({ productId: p.id, quantity: 1 }).subscribe({
      next: () => {
        this.snack.open('Added to cart', 'OK', { duration: 2000 });
        this.cartStore.refresh(); // keep navbar badge in sync
      },
      error: () => {
        this.snack.open('Could not add to cart', 'Dismiss', { duration: 2500 });
      }
    });
  }

  backToList() {
    this.router.navigate(['/products']);
  }
}
