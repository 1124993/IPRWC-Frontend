import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { AdminProductsService } from '../../../core/api/admin-products.service';
import { Product } from '../../../core/models/product.model';
import { EditProductDialogComponent } from './edit-product-dialog.component';
import { CreateProductDialogComponent } from './create-product-dialog.component';

@Component({
    selector: 'app-admin-products-page',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        MatTooltipModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatDialogModule,
    ],
    templateUrl: './admin-products-page.component.html',
    styleUrls: ['./admin-products-page.component.scss'],
})
export class AdminProductsPageComponent {
    private api = inject(AdminProductsService);
    private snack = inject(MatSnackBar);
    private dialog = inject(MatDialog);

    loading = signal(true);
    rows = signal<Product[]>([]);

    readonly displayedColumns = ['name', 'price', 'stock', 'category', 'archived', 'actions'];

    readonly activeCount = computed(() => this.rows().filter(r => !r.archived).length);
    readonly archivedCount = computed(() => this.rows().filter(r => r.archived).length);

    ngOnInit() {
        this.reload();
    }

    reload() {
        this.loading.set(true);
        this.api.list().subscribe({
            next: list => {
                this.rows.set(list ?? []);
                this.loading.set(false);
            },
            error: () => {
                this.rows.set([]);
                this.loading.set(false);
                this.snack.open('Failed to load products', 'Dismiss', { duration: 2500 });
            }
        });
    }

    toggleArchive(row: Product) {
        const call$ = row.archived ? this.api.unarchive(row.id) : this.api.archive(row.id);
        call$.subscribe({
            next: () => {
                const updated = this.rows().map(p =>
                    p.id === row.id ? { ...p, archived: !row.archived } : p
                );
                this.rows.set(updated);
                this.snack.open(row.archived ? 'Unarchived' : 'Archived', 'OK', { duration: 1500 });
            },
            error: () => this.snack.open('Action failed', 'Dismiss', { duration: 2000 })
        });
    }

    createProduct() {
        const ref = this.dialog.open(CreateProductDialogComponent, {
            autoFocus: true,
            restoreFocus: true,
            width: '540px'
        });

        ref.afterClosed().subscribe((created: Product | null) => {
            if (!created) return;
            // add new product to the top of the table
            this.rows.set([created, ...this.rows()]);
            this.snack.open('Product created', 'OK', { duration: 1500 });
        });
    }

    editProduct(row: Product) {
        const ref = this.dialog.open(EditProductDialogComponent, {
            data: { product: row },
            autoFocus: true,
            restoreFocus: true,
            width: '540px'
        });

        ref.afterClosed().subscribe((updated: Product | null) => {
            if (!updated) return;
            const next = this.rows().map(p => p.id === updated.id ? updated : p);
            this.rows.set(next);
            this.snack.open('Product updated', 'OK', { duration: 1500 });
        });
    }

    deleteProduct(row: Product) {
        // optional later
    }
}
