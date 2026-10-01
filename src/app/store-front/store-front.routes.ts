import { Routes } from "@angular/router";
import { StoreFrontLayout } from "@store-front/layouts/store-front-layout/store-front-layout";
import { HomePage } from "@store-front/pages/home-page/home-page";
import { GenderPage } from "@store-front/pages/gender-page/gender-page";
import { ProductPage } from "@store-front/pages/product-page/product-page";
import { NotFoundPage } from "@store-front/pages/not-found-page/not-found-page";

export const storeFrontRoutes: Routes = [
    {
        path: '',
        component: StoreFrontLayout,
        children:[
            {
                path: '',
                component: HomePage,
            },
            {
                path: 'gender/:gender',
                component: GenderPage,
            },
            {
                path: 'product/:idSlug',
                component: ProductPage,
            },
            {
                path: '**',
                component: NotFoundPage,
            },
        ],
    },
    {
        path: '**',
        redirectTo: '',
    }
];

export default storeFrontRoutes;