import { ProductCarousel } from '@/products/components/productCarousel/productCarousel';
import { Product } from '@/products/interfaces/productInterface';
import { ProductsService } from '@/products/services/productsService';
import { FormErrorLabel } from '@/shared/components/form-error-label/form-error-label';
import { FormUtils } from '@/utils/formUtils';
import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'product-details',
  imports: [ProductCarousel, ReactiveFormsModule, FormErrorLabel],
  templateUrl: './productDetails.html',
})
export class ProductDetails implements OnInit {
  product = input.required<Product>();

  sizes = ['XS','S','M','L','XL','XXL'];

  productsService = inject(ProductsService);
  router = inject(Router);
  fb = inject(FormBuilder);

  wasSaved = signal(false);
  tempImages = signal<string[]>([]);

  imagesToCarousel = computed(() => {
    const currentProductImages = 
      [...this.product().images, ...this.tempImages()];
    return currentProductImages;
  });

  imageFileList: FileList | undefined = undefined;

  productForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug: [
        '',
        [Validators.required, Validators.pattern(FormUtils.slugPattern)]
    ],
    price: [0, [Validators.required, Validators.min(0)]],
    stock: [0, [Validators.required, Validators.min(0)]],
    sizes: [['']],
    images: [[]],
    tags: [''],
    gender: [
        'men',
        [Validators.required, Validators.pattern(/^(men|women|kid|unisex)$/)],
    ],
  });

  ngOnInit(): void {
    this.setFormValue(this.product());
  }

  setFormValue(formLike: Partial<Product>){
    this.productForm.patchValue(formLike as any);
    this.productForm.patchValue({tags: formLike.tags?.join(',')});
  }

  onSizeClicked(size:string){
    const currentSizes = this.productForm.value.sizes ?? [];

    if(currentSizes.includes(size)){
      currentSizes.splice(currentSizes.indexOf(size),1);
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({sizes: currentSizes});
  }

  async onSubmit(){
    console.log('submit pulsado');
    console.log('invalid?', this.productForm.invalid);
    if (this.productForm.invalid) {
    this.productForm.markAllAsTouched();
    return;
  }
    console.log('Formulario válido: ',this.productForm.value);

    const formValue = this.productForm.value;
    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags: formValue.tags?.toLowerCase().split(',')
        .map(tag => tag.trim()) ?? [],
    }

    console.log({productLike});

    if(this.product().id === 'new'){
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike, this.imageFileList)
      );
      //console.log('Producto creado');
      this.router.navigate(['/admin/products',product.id]);
    }else {
      await firstValueFrom(this.productsService
        .updateProduct(this.product().id,productLike, this.imageFileList)
      );
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    },3000);
  }

  onFilesChanged(event: Event){
    const fileList = (event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined;
    const imageURLs = Array.from(fileList ?? [])
      .map(file =>{ return URL.createObjectURL(file)});
    this.tempImages.set(imageURLs);
  }
}
