import { Product } from '@/products/interfaces/productInterface';
import { ProductImagePipe } from '@/products/pipes/productImagePipe';
import { SlicePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'product-card',
  imports: [RouterLink, SlicePipe, ProductImagePipe, ],
  templateUrl: './product-card.html',
})
export class ProductCard {
  product = input.required<Product>();

  imageURL = computed(() => {
    return `http://localhost:3000/api/files/product/${this.product().images[0]}`;
  });
}
