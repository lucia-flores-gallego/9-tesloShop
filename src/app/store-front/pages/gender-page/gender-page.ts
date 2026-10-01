import { ProductCard } from '@/products/components/product-card/product-card';
import { ProductsService } from '@/products/services/productsService';
import { Component, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'gender-page',
  imports: [ProductCard],
  templateUrl: './gender-page.html',
})
export class GenderPage {
  route = inject(ActivatedRoute);
  productsService = inject(ProductsService);
  
  gender = toSignal(this.route.params
    .pipe(map(
      ({gender}) => gender)
    )
  );

  productsResource = rxResource({
    params: () => ({gender: this.gender()}),
    stream: ({ params }) => {
      return this.productsService.getProducts({gender: params.gender});
    },
  });
}
