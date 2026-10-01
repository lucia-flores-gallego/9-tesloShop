import { ProductCarousel } from '@/products/components/productCarousel/productCarousel';
import { ProductsService } from '@/products/services/productsService';
import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'product-page',
  imports: [ProductCarousel],
  templateUrl: './product-page.html',
})
export class ProductPage {
  activatedRoute = inject(ActivatedRoute);
  productsService = inject(ProductsService);

  productIdSlug = this.activatedRoute.snapshot.params['idSlug'];

  productsResource = rxResource({
    params: () => ({idSlug: this.productIdSlug}),
    stream: ({ params }) => {
      return this.productsService.getProductByIdSlug(params.idSlug);
    },
  });
}
