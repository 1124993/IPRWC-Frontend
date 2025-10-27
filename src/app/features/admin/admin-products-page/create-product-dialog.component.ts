import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AdminProductsService } from '../../../core/api/admin-products.service';
import { Product } from '../../../core/models/product.model';

@Component({
    selector: 'app-create-product-dialog',
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
    templateUrl: './create-product-dialog.component.html',
    styleUrls: ['./create-product-dialog.component.scss'],
})
export class CreateProductDialogComponent {
    private fb = inject(FormBuilder);
    private api = inject(AdminProductsService);
    private ref = inject(MatDialogRef<CreateProductDialogComponent, Product | null>);

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

    save() {
        if (this.form.invalid || this.saving) return;
        this.saving = true;

        const v = this.form.getRawValue();
        this.api.create({
            name: v.name!,
            price: Number(v.price),
            stock: Number(v.stock),
            imageUrl: v.imageUrl || null,
            description: v.description || null,
            category: v.category as 'MEN' | 'WOMEN' | 'UNISEX',
        }).subscribe({
            next: (created) => this.ref.close(created),
            error: () => { this.saving = false; }
        });
    }

    cancel() {
        this.ref.close(null);
    }
}
