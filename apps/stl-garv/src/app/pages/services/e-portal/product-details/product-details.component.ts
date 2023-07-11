import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { PortalApiService } from '@stl-garv-frontend/e-portal-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { JwtTokenDecodeService } from '@stl-garv-frontend/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

interface Qty {
    name: number,
    code: number
}

@Component({
    selector: 'stl-garv-frontend-product-details',
    templateUrl: './product-details.component.html',
    styles: []
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
   
    cloudFrontURL= environment.cloudFrontURL;
    form: FormGroup;
    qty: Qty[];
    selectedQty: Qty;
    token = this.jwtDecode.tokenDecode();
   
    productDetails: any;

    id: number;
    p_id: number;
    cust_id: number;
    p_qty = 1;
    prod_sp: any;
    sub_total: number;
    total: number;

    isSubmitted= false;

    endSubs$ : Subject<any> = new Subject();

    orderDialog: boolean;

    constructor(
        private routeActivate: ActivatedRoute,
        private portalService: PortalApiService,
        private breadcrumb: BreadcrumbService ,
        private formBuilder: FormBuilder,
        private jwtDecode: JwtTokenDecodeService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService, 
    ) {}

    ngOnInit(): void {
        this.id= this.routeActivate.snapshot.params['id'];
        this._getProductDetailById();
        this._initForm();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Portal',
                routerLink: '/eportal'
            },
            {
                label: 'Product Details'
            }
            ])
        );
        this.getQty();
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            quantity: [this.p_qty, Validators.required]
        })
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getProductDetailById() {
        
        this.portalService.getProductDetailsById(this.id).pipe(takeUntil(this.endSubs$)).subscribe(res=>{
            this.productDetails= res;
            this.p_id=res[0].product_id;
            this.prod_sp=res[0].product_psp_price;
            this.sub_total= this.prod_sp*this.p_qty;
            this.total=this.sub_total;
        })
    }

    buyNow(){
        this.orderDialog=true;
        if(this.token){
            this.cust_id=this.token.user_id
        };
    }

    confirmOrder(){
        this.isSubmitted=true;
        
        this.confirmationService.confirm({
            message: 'Are you sure that you want to proceed?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const pending_order={
                    customer_id: this.cust_id,
                    product_id: this.p_id,
                    qty: this.p_qty,
                    order_status: "pending"
                }
                this.portalService.createPendingOrder(pending_order).pipe(takeUntil(this.endSubs$)).subscribe(
                    (res)=>{
                        const cust_order = {
                            order_id: res.order_id,
                            customer_id: this.cust_id,
                            due_amount: this.total,
                            invoice_no: res.invoice_no,
                            qty: this.p_qty,
                            order_status: "pending"
                        }
                        this.portalService.createCustOrder(cust_order).pipe(takeUntil(this.endSubs$)).subscribe(
                            () => {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Success',
                                    detail: 'Order created successfully!'
                                });
                                timer(1000)
                                .toPromise()
                                .then(() => {
                                    this.orderDialog=false;
                                });
                            },
                            
                            () => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Order could not be created!'
                                });
                            }
                        )
                    }
                )
            },
        });
    }

    getQuantityandTotal(val: number){
        this.p_qty=val;
        this.createUserForm.quantity.setValue(this.p_qty);
        this.sub_total= this.prod_sp*this.p_qty;
        this.total=this.sub_total;
    }

    getQty(){
        this.qty = [
            {name: 1, code: 1},
            {name: 2, code: 2},
            {name: 3, code: 3},
            {name: 4, code: 4},
            {name: 5, code: 5}
        ];
    }

    get createUserForm() {
        return this.form.controls;
    }

    
}
