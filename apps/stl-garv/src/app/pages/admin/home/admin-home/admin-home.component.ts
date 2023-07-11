import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Order, PortalApiService } from '@stl-garv-frontend/e-portal-api';
import { Subject, takeUntil } from 'rxjs';


@Component({
    selector: 'stl-garv-frontend-admin-home',
    templateUrl: './admin-home.component.html',
    styles: []
})
export class AdminHomeComponent implements OnInit, OnDestroy {

    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    totalProduct : any;
    totalPayments : any;
    totalUsers: any;
    totalOrders: any
    allOrders:Order[]=[];

    constructor(
        private eportalService: PortalApiService
    ) {}

    ngOnInit(): void {
        this._getDashboardData();
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getDashboardData(){
        this.eportalService.getAdminDash().pipe(takeUntil(this.endSubs$)).subscribe(
            (res)=>{
                this.totalProduct=res.Total_Products;
                this.totalOrders=res.Total_Orders;
                this.totalPayments=res.Total_Payments;
                this.totalUsers=res.Total_Users;
                this.allOrders=res.Orders
            }
        )
    }

}
