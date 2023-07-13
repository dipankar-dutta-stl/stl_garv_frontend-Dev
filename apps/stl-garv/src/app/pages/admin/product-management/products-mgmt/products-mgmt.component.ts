import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { Manufacturer, PortalApiService, Product, ProductCategory } from '@stl-garv-frontend/e-portal-api';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
    selector: 'stl-garv-frontend-products-mgmt',
    templateUrl: './products-mgmt.component.html',
    styles: []
})
export class ProductsMgmtComponent implements OnInit , OnDestroy{

    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    items: MenuItem[];
    uploadedFiles: any[] = [];
    activeItem: MenuItem;
    product_form:FormGroup

    prodDialog= false;
    editmode=false;
    isSubmitted=false;
    loading=true;
    isUploaded=false;

    products: Product[]=[];
    manufacturers: Manufacturer[]=[];
    categories: ProductCategory[]=[];

    prodId: number;
    imageDisplay: string | ArrayBuffer;
    file: File | null = null;

    constructor(
        private eportalService: PortalApiService, 
        private formBuilder: FormBuilder, 
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private breadcrumb: BreadcrumbService
        ) {}

    ngOnInit(): void {
        this._tabMenu();
        this._getAllProds();
        this._getAllManufacturers();
        this._getAllCategories();
        this._initForm();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'Products Management',
                routerLink: '/admin/metadata/product-management/product/list'
            },
            {
                label: 'Product Management'
            }
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _initForm(){
        this.product_form = this.formBuilder.group({
            product_title: ['', Validators.required],
            f_manufacturers: ['', Validators.required],
            f_categories: ['', Validators.required],
            product_price: ['', Validators.required],
            product_psp_price: ['', Validators.required],
            product_desc: [''],
            product_features: [''],
            product_video: [''],
            image: ['', Validators.required]
        });
    };

    private _getAllProds(){
        this.eportalService.getAllProduct().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.products=res;
            this.loading=false
        })
    }

    private _getAllManufacturers(){
        this.eportalService.getAllManufacturers().pipe(takeUntil(this.endSubs$)).subscribe(manufacturer=>{
            this.manufacturers=manufacturer;
        })
    }

    private _getAllCategories(){
        this.eportalService.getAllCategories().pipe(takeUntil(this.endSubs$)).subscribe(cat=>{
            this.categories=cat;
        })
    }

    createProduct(){
        this.prodDialog = true;
        this.editmode=false;
        this.isSubmitted=false;
        this.imageDisplay=null;
        this.file=null;
        this.isUploaded=false;
        this._initForm();
    }

    editProduct(product_id: number){

        this.imageDisplay=null;
        this.file=null;
        this.isSubmitted=false;
        this.prodDialog = true;
        this.isUploaded=false;
        this._initForm();

        if(product_id){
            this.editmode=true;
            this.prodId=product_id;
            this.eportalService.getProductDetailsById(product_id).pipe(takeUntil(this.endSubs$)).subscribe(
                (data)=>
                {
                    this.createProductForm.product_title.setValue(data[0]?.product_title);
                    this.createProductForm.f_manufacturers.setValue(data[0]?.manufacturer_id);
                    this.createProductForm.f_categories.setValue(data[0]?.p_cat_id);
                    this.createProductForm.product_price.setValue(data[0]?.product_price);
                    this.createProductForm.product_psp_price.setValue(data[0]?.product_psp_price);
                    this.createProductForm.product_desc.setValue(data[0]?.product_desc);
                    this.createProductForm.product_features.setValue(data[0]?.product_features);
                    this.createProductForm.product_video.setValue(data[0]?.product_video);
                    this.imageDisplay=data[0]?.product_img1;
                    this.createProductForm.image.setValidators([]);
                    this.createProductForm.image.updateValueAndValidity()
                }
            )
        }
    }

    saveProduct(){
        this.isSubmitted=true;
        
        if(this.product_form.invalid) return;

        const productFormData = {
            product_title: this.createProductForm.product_title.value,
            manufacturer_id: this.createProductForm.f_manufacturers.value,
            p_cat_id: this.createProductForm.f_categories.value,
            product_price: this.createProductForm.product_price.value,
            product_psp_price: this.createProductForm.product_psp_price.value,
            product_desc: this.createProductForm.product_desc.value,
            product_features: this.createProductForm.product_features.value,
            product_video: this.createProductForm.product_video.value
        }
        //console.log(productFormData)
        if(this.editmode){
            this.eportalService.updateProduct(this.prodId, productFormData).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=>
                {
                    this._getAllProds();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Product updated successfully!'
                        });
                        this.prodDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Product could not be updated!'
                    }); 
                }
            )

            //Image Upload
            if(this.isUploaded){
            this.eportalService.postProdImage(this.prodId, this.file).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=> {
                    
                    this._getAllProds();
                },
                (error: HttpErrorResponse) => {
                    if(error){
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Product Image could not be updated!'
                        });
                    }
                })
            }
        }

        else{
            
            this.eportalService.createProduct(productFormData).pipe(takeUntil(this.endSubs$)).subscribe(
                (res)=>
                {
                    this.eportalService.postProdImage(res.product_id, this.file).pipe(takeUntil(this.endSubs$)).subscribe(
                        ()=>
                        {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Product created successfully!'
                            });
                            this.prodDialog = false;
                            this._getAllProds();
                        },
                        (error: HttpErrorResponse) => {
                            if(error){
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Product Image could not be added!'
                                });
                            }
                        })
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Product could not be created!'
                    }); 
                })
        }
        
    }

    onImageUpload(event) {
        this.isUploaded=true;
        this.file = event.target.files[0];
        if (this.file) {
            this.product_form.patchValue({ image: this.file });
            this.product_form.get('image').updateValueAndValidity();
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.imageDisplay = fileReader.result;
            };
            fileReader.readAsDataURL(this.file);
        }
    }

    deleteProduct(product_id: number){
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this product?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.eportalService.deleteProduct(product_id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this._getAllProds(); //get data after deletion
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Prodcut is deleted'
                    })
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Product could not be deleted'
                    });
                });
            },
            reject: (type) => {
                switch(type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
                    break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
                    break;
                }
            }
        });
    }

    hideDialog() {
        this.prodDialog = false;
    }

    private _tabMenu() {
        this.items = [
            {label: 'Product',routerLink: '/admin/metadata/product-management/product/list'},
            {label: 'Category',routerLink: '/admin/metadata/product-management/category/list'},
            {label: 'Service Provider',routerLink: '/admin/metadata/product-management/service-provider/list'}
        ]
    }

    get createProductForm() {
        return this.product_form.controls;
    }
}
