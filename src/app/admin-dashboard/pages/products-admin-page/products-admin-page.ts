import { ProductTable } from '@/products/components/productTable/productTable';
import { ProductsService } from '@/products/services/productsService';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'products-admin-page',
  imports: [ProductTable, RouterLink],
  templateUrl: './products-admin-page.html',
})
export class ProductsAdminPage {
  productsService = inject(ProductsService);

  // INCLUIR TODO LO REFERENTE A PAGINACIÓN -> SACARLO DEL CODIGO FUENTE DEL PROFESOR
  //solucion temporal a paginacion
  currentPage = signal(1);
  pageSize = signal(10); 
  //productsPerPage = signal(10);

  productsResource = rxResource({
    params: () => ({ page: this.currentPage(), pageSize: this.pageSize() }),
    stream: ({ params }) => {
      const limit = params.pageSize;
      const offset = (params.page - 1) * limit;

      return this.productsService.getProducts({
        limit,
        offset,
      });
    },
  });

  totalPages = computed(() => {
    const total = this.productsResource.value()?.count ?? 0;
    return Math.ceil(total / this.pageSize());
  });

  pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i + 1);
  });

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  onPageSizeChange(size: number) {
    this.pageSize.set(size);
    this.currentPage.set(1);
  }
}
