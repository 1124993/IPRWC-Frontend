import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AdminProductsService } from '../../../core/api/admin-products.service';
import { Product } from '../../../core/models/product.model';

export interface EditProductData {
    product: Product;
}

@Component({
    selector: 'app-edit-product-dialog',
    standalone: true,
    imports: [
        CommonModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
    ],
    templateUrl: './edit-product-dialog.component.html',
    styleUrls: ['./edit-product-dialog.component.scss'],
})
export class EditProductDialogComponent {
    private fb = inject(FormBuilder);
    private api = inject(AdminProductsService);
    private ref = inject(MatDialogRef<EditProductDialogComponent, Product | null>);

    categories: Array<'MEN' | 'WOMEN' | 'UNISEX'> = ['MEN', 'WOMEN', 'UNISEX'];

    form = this.fb.group({
        name: ['', [Validators.required, Validators.maxLength(120)]],
        price: [0, [Validators.required, Validators.min(0)]],
        stock: [0, [Validators.required, Validators.min(0)]],
        imageUrl: [''],
        description: [''],
        category: ['UNISEX', [Validators.required]],
    });

    saving = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data: EditProductData) {
        // ✅ Form initialization happens here, after `data` is available
        this.form.patchValue({
            name: data.product.name,
            price: data.product.price,
            stock: data.product.stock,
            imageUrl: data.product.imageUrl ?? '',
            description: data.product.description ?? '',
            category: data.product.category ?? 'UNISEX',
        });
    }

    save() {
        if (this.form.invalid || this.saving) return;
        this.saving = true;

        const payload = this.form.getRawValue();
        this.api.update(this.data.product.id, {
            name: payload.name!,
            price: Number(payload.price),
            stock: Number(payload.stock),
            imageUrl: payload.imageUrl || null,
            description: payload.description || null,
            category: payload.category as 'MEN' | 'WOMEN' | 'UNISEX',
        }).subscribe({
            next: (updated) => this.ref.close(updated),
            error: () => {
                this.saving = false;
            }
        });
    }

    cancel() {
        this.ref.close(null);
    }
}
