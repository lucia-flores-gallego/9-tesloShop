import { ProductsService } from '@/products/services/productsService';
import { Component, effect, inject } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { ProductDetails } from './productDetails/productDetails';

@Component({
  selector: 'product-admin-page',
  imports: [ProductDetails],
  templateUrl: './product-admin-page.html',
})
export class ProductAdminPage {
  productsService = inject(ProductsService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  productId = toSignal(
    this.activatedRoute.params.pipe(map(params => params['id']))
  );

  productResource = rxResource({
    params: () => ({ id: this.productId() }),
    stream: ({ params }) => {
      return this.productsService.getProductById(params.id);
    },
  });

  redirectEffect = effect(() => {
    if(this.productResource.error()){
      this.router.navigate(['/admin/products']);
    }
  });
}
