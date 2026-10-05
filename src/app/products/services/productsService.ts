import { User } from '@/auth/interfaces/userInterface';
import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import { Gender, Product, ProductsResponse } from '@products/interfaces/productInterface';
import { Observable, of, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseURL = environment.baseURL;

interface Options {
    limit?: number;
    offset?: number;
    gender?: string;
}

const emptyProduct: Product = {
    id: 'new',
    title: '',
    price: 0,
    description: '',
    slug: '',
    stock: 0,
    sizes: [],
    gender: Gender.Kid,
    tags: [],
    images: [],
    user: {} as User,
}

@Injectable({providedIn: 'root'})
export class ProductsService {
    private http = inject(HttpClient);

    private productsCache = new Map<string, ProductsResponse>();
    private productCache = new Map<string, Product>();

    getProducts(options: Options): Observable<ProductsResponse>{
        const {limit=1000, offset=0, gender=''} = options;

        const key = `${limit}-${offset}-${gender}`;
        if(this.productsCache.has(key)){
            return of(this.productsCache.get(key)!);
        }
        
        return this.http
            .get<ProductsResponse>(`${baseURL}/products`, {
                params: {
                            limit,
                            offset,
                            gender,
                },
            }).pipe(
                tap((resp) => console.log(resp)),
                tap((resp) => this.productsCache.set(key, resp))
            );
    }

    getProductByIdSlug(idSlug:string): Observable<Product>{
        if(this.productCache.has(idSlug)){
            return of(this.productCache.get(idSlug)!);
        }

        return this.http
            .get<Product>(`${baseURL}/products/${idSlug}`)
            .pipe(
                tap((product) => this.productCache.set(idSlug, product))
            ); 
    }

    getProductById(id:string): Observable<Product>{
        if(id==='new'){
            return of (emptyProduct);
        }
        
        if(this.productCache.has(id)){
            return of(this.productCache.get(id)!);
        }

        return this.http
            .get<Product>(`${baseURL}/products/${id}`)
            .pipe(
                tap((product) => this.productCache.set(id, product))
            ); 
    }

    updateProduct(id:string, productLike: Partial<Product>): Observable<Product>{
        console.log('Actualizando producto:');

        return this.http
            .patch<Product>(`${baseURL}/products/${id}`,productLike)
            .pipe(
                tap((product) => this.updateProductCache(product))
            );
    }

    updateProductCache(product: Product){
        const productId = product.id;
        this.productCache.set(productId,product);
        this.productsCache.forEach((productResponse) => {
            const productIndex = productResponse.products.findIndex((p) => p.id === productId);
            if (productIndex !== -1) {
                productResponse.products[productIndex] = product;
            }
        });
        console.log('Caché actualizado');
    }

    createProduct(productLike: Partial<Product>): Observable<Product>{
        return this.http
        .post<Product>(`${baseURL}/products`,productLike)
        .pipe(
                tap((product) => this.updateProductCache(product))
            );
    }
}