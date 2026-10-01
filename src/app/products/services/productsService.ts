import { HttpClient } from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import { Product, ProductsResponse } from '@products/interfaces/productInterface';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

const baseURL = environment.baseURL;

interface Options {
    limit?: number;
    offset?: number;
    gender?: string;
}

@Injectable({providedIn: 'root'})
export class ProductsService {
    private http = inject(HttpClient);

    getProducts(options: Options): Observable<ProductsResponse>{
        const {limit=9, offset=0, gender=''} = options;
        
        return this.http
            .get<ProductsResponse>(`${baseURL}/products`,{
                params: {
                    limit: limit,
                    offset: offset,
                    gender: gender,
                }
            })
            .pipe(tap(resp => console.log(resp)));
    }

    getProductByIdSlug(idSlug:string): Observable<Product>{
        return this.http
            .get<Product>(`${baseURL}/products/${idSlug}`); 
    }
}