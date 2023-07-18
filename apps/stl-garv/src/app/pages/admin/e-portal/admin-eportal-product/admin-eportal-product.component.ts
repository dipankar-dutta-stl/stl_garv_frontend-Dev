import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { PortalApiService } from '@stl-garv-frontend/e-portal-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { Subject, takeUntil } from 'rxjs';


@Component({
    selector: 'stl-garv-frontend-admin-eportal-product',
    templateUrl: './admin-eportal-product.component.html',
    styles: []
})
export class AdminEportalProductComponent implements OnInit, OnDestroy {
    cloudFrontURL= environment.cloudFrontURL;
    id: number;
    product: any;

    endSubs$ : Subject<any> = new Subject();

    constructor(
        private routeActivate: ActivatedRoute,
        private portalService: PortalApiService,
        private breadcrumb: BreadcrumbService 
    ) {}

    ngOnInit(): void {
        this.id= this.routeActivate.snapshot.params['id'];
        this._getProductDetailById();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Portal',
                routerLink: '/admin/eportal'
            },
            {
                label: 'Product Details'
            }
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getProductDetailById() {
        this.portalService.getProductDetailsById(this.id).pipe(takeUntil(this.endSubs$)).subscribe(details=>{
            this.product= details;
            console.log("product Details= ",this.product)
        })
    }
}
