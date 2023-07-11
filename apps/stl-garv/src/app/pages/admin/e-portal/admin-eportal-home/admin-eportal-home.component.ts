import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '@env/environment';
import { Manufacturer, PortalApiService, Product, ProductCategory } from '@stl-garv-frontend/e-portal-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-admin-eportal-home',
    templateUrl: './admin-eportal-home.component.html',
    styles: []
})
export class AdminEportalHomeComponent implements OnInit , OnDestroy {
    form: FormGroup;
    cloudFrontURL= environment.cloudFrontURL;

    endSubs$ : Subject<any> = new Subject();
    productList: Product[]= [];
    manufacturers: Manufacturer[]=[];
    categories: ProductCategory[]=[];

    manufaturer_id: number;
    categories_id: number;

    p_length: number;
    term= '';
    searchTerm = '';

    constructor(
        private portalService: PortalApiService,
        private formBuilder: FormBuilder,
        private breadcrumb: BreadcrumbService 
    ) {}

    ngOnInit(): void {
        this._initForm();
        this.getAllProducts();
        this._getAllManufacturers();
        this._getAllCategories();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Portal',
                routerLink: '/admin/eportal'
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
               f_categories: ['']
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

    get createUserForm() {
        return this.form.controls;
    }

}
