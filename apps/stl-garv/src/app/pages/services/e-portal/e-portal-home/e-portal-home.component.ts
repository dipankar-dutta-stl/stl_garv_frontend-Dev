import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { Manufacturer, PortalApiService, Product, ProductCategory } from '@stl-garv-frontend/e-portal-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { JwtTokenDecodeService } from '@stl-garv-frontend/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

interface Qty {
    name: number,
    code: number
}

@Component({
    selector: 'stl-garv-frontend-e-portal-home',
    templateUrl: './e-portal-home.component.html',
    styles: []
})
export class EPortalHomeComponent implements OnInit, OnDestroy {
    form: FormGroup;
    cloudFrontURL= environment.cloudFrontURL;

    token = this.jwtDecode.tokenDecode();
    qty: Qty[];
    selectedQty: Qty;

    endSubs$ : Subject<any> = new Subject();
    productList: Product[]= [];
    productDetails: Product;
    manufacturers: Manufacturer[]=[];
    categories: ProductCategory[]=[];

    manufaturer_id: number;
    categories_id: number;
    p_length: number;
    p_id: number;
    cust_id: number;
    p_qty = 1;
    prod_sp: any;
    sub_total: number;
    total: number;

    isSubmitted= false;
    orderDialog: boolean;

    

    term= '';
    searchTerm = '';

    

    constructor(
        private portalService: PortalApiService,
        private formBuilder: FormBuilder,
        private breadcrumb: BreadcrumbService,
        private jwtDecode: JwtTokenDecodeService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService, 
    ) { }

    ngOnInit(): void {
        window.scrollTo(0, 0)
        this._initForm();
        this.getQty();
        this.getAllProducts();
        this._getAllManufacturers();
        this._getAllCategories();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Portal',
                routerLink: '/eportal'
            }
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }


    private _initForm() {
        this.form = this.formBuilder.group({
               f_manufacturers: [''],
               f_categories: [''],
               quantity: [this.p_qty, Validators.required]
        })
    }


    //get all products
     getAllProducts() {
        this._initForm();
        this.portalService.getAllProduct().pipe(takeUntil(this.endSubs$)).subscribe(products=> {
            this.productList =products;
            this.p_length= this.productList.length;
        })
    }

    private _getAllManufacturers(){
        this.portalService.getAllManufacturers().pipe(takeUntil(this.endSubs$)).subscribe(manufacturer=>{
            this.manufacturers=manufacturer;
            
        })
    }

    private _getAllCategories(){
        this.portalService.getAllCategories().pipe(takeUntil(this.endSubs$)).subscribe(cat=>{
            this.categories=cat;

        })
    }

     filterProduct(){
        this.manufaturer_id= this.createUserForm.f_manufacturers.value;
        this.categories_id= this.createUserForm.f_categories.value;
        
        this._getProductByCat_Man();
    }

    private _getProductByCat_Man(){

        if(this.manufaturer_id){
            this.portalService.getManufacturerById(this.manufaturer_id).pipe(takeUntil(this.endSubs$)).subscribe(filterMId=>{
                this.productList=filterMId[0].has_product;
                this.p_length= this.productList.length;

                if(this.categories_id){
                    this.portalService.getCategorieById(this.categories_id).pipe(takeUntil(this.endSubs$)).subscribe(filterCId=>{
                        this.productList=filterCId[0].has_product;
                        this.p_length= this.productList.length;
                    })
                }
            })
        }
        if(this.categories_id && !this.manufaturer_id){
            this.portalService.getCategorieById(this.categories_id).pipe(takeUntil(this.endSubs$)).subscribe(filterCId=>{
                this.productList=filterCId[0].has_product;
                this.p_length= this.productList.length;
            })
        }

    }

    buyNow(id: number){

        this.orderDialog=true;
        this.p_qty=1;
        this.sub_total=0;
        this.total=0;
        this.createUserForm.quantity.setValue(this.p_qty);

        if(this.token){
            this.cust_id=this.token.user_id
        };

        if(id){
            this.p_id=id;
            this.portalService.getProductDetailsById(id).pipe(takeUntil(this.endSubs$)).subscribe(
                (res)=>{
                    this.productDetails=res;
                    this.prod_sp=res[0].product_psp_price;
                    this.sub_total= this.prod_sp*this.p_qty;
                    this.total=this.sub_total;
                }
            )
        }
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
