import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-admin-home',
    standalone: true,
    imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule],
    templateUrl: './admin-home.component.html',
    styleUrls: ['./admin-home.component.scss'],
})
export class AdminHomeComponent { }
