import { ProductsService } from '@/products/services/productsService';
import { Component, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProductCard } from '@products/components/product-card/product-card';

@Component({
  selector: 'home-page',
  imports: [ProductCard],
  templateUrl: './home-page.html',
})
export class HomePage {
  productsService = inject(ProductsService);

  // INCLUIR TODO LO REFERENTE A PAGINACIÓN -> SACARLO DEL CODIGO FUENTE DEL PROFESOR
  //solucion temporal a paginacion

  currentPage = signal(1); 

  productsPerPage = signal(10);

  productsResource = rxResource({
    params: () => ({ page: this.currentPage() }),
    stream: ({ params }) => {
      return this.productsService.getProducts({
        limit: 9,
        offset: (params.page - 1) * 9,
      });
    },
  });
}
