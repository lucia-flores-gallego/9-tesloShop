import { Product } from '@/products/interfaces/productInterface';
import { ProductImagePipe } from '@/products/pipes/productImagePipe';
import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-table',
  imports: [ProductImagePipe, RouterLink, CurrencyPipe],
  templateUrl: './productTable.html',
})
export class ProductTable {
  products = input.required<Product[]>();
}
