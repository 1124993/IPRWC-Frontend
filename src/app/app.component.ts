import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';

import { AuthService } from './core/auth/auth.service';
import { CartStore } from './core/state/cart.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private auth = inject(AuthService);
  private cartStore = inject(CartStore);

  isAuth() { return this.auth.isAuthenticated(); }
  role() { return this.auth.role(); }
  email() { return this.auth.email(); }
  totalQty() { return this.cartStore.totalQty(); }

  logout() {
    this.auth.logout();
    this.cartStore.clear();
  }
}
