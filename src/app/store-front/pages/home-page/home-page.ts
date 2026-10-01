import { ProductsService } from '@/products/services/productsService';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCard } from '@products/components/product-card/product-card';

@Component({
  selector: 'home-page',
  imports: [ProductCard],
  templateUrl: './home-page.html',
})
export class HomePage {
  productsService = inject(ProductsService);

  productsResource = rxResource({
    params: () => ({}),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        limit:9,
        offset: 0,
      });
    },
  });
}
