import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { PortalApiService, ProductCategory } from '@stl-garv-frontend/e-portal-api';

@Component({
    selector: 'stl-garv-frontend-category-mgmt',
    templateUrl: './category-mgmt.component.html',
    styles: []
})
export class CategoryMgmtComponent implements OnInit , OnDestroy{

    endSubs$ : Subject<any> = new Subject();
    items: MenuItem[];
    stateOptions: any[];
    uploadedFiles: any[] = [];
    activeItem: MenuItem;
    product_form:FormGroup

    prodDialog= false;
    editmode=false;
    isSubmitted=false;
    loading=true;
    isUploaded=false;

    categories: ProductCategory[]=[];

    catId: number;

    constructor(
        private eportalService: PortalApiService, 
        private formBuilder: FormBuilder, 
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private breadcrumb: BreadcrumbService
        ) {}

    ngOnInit(): void {
        this._tabMenu();
        this._getAllCategories();
        this._initForm();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'Products Management',
                routerLink: '/admin/metadata/product-management/product/list'
            },
            {
                label: 'Category Management'
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
            p_cat_title: ['', Validators.required],
            p_cat_top: ['', Validators.required],
            p_cat_image:[this.uploadedFiles]
        });
    };

    private _getAllCategories(){
        this.eportalService.getAllCategories().pipe(takeUntil(this.endSubs$)).subscribe(cat=>{
            this.categories=cat;
            this.loading=false;
        })
    }

    createCategory(){
        this.prodDialog = true;
        this.editmode=false;
        this.isSubmitted=false;
        this._initForm();
    }

    editCategory(cat_id: number){
        this.isSubmitted=false;
        this.prodDialog = true;

        if(cat_id){
            this.editmode=true;
            this.catId=cat_id;
            this.eportalService.getCategorieById(cat_id).pipe(takeUntil(this.endSubs$)).subscribe(
                (data)=>
                {
                    this.createProductForm.p_cat_title.setValue(data.p_cat_title);
                    this.createProductForm.p_cat_top.setValue(data.p_cat_top);
                }
            )
        }
    }

    saveProduct(){
        this.isSubmitted=true;
        if(this.product_form.invalid) {
            return};

        const FormData = {
            p_cat_title: this.createProductForm.p_cat_title.value,
            p_cat_top: this.createProductForm.p_cat_top.value
        }
        if(this.editmode){
            this.eportalService.updateProdCategory(this.catId, FormData).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=>
                {
                    this._getAllCategories();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Category updated successfully!'
                        });
                        this.prodDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Category could not be updated!'
                    }); 
                }
            )
        }
        else{
            this.eportalService.createProdCategory(FormData).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=>
                {
                        this._getAllCategories();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Category created successfully!'
                        });
                        this.prodDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Category could not be created!'
                    }); 
                }
            )
        }
        
    }

    deleteCategory(cat_id: number){
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this category?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.eportalService.deleteProdCategory(cat_id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this._getAllCategories(); //get data after deletion
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Category is deleted'
                    })
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Category could not be deleted'
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
        this.stateOptions = [{label: 'No', value: 'no'}, {label: 'Yes', value: 'yes'}];
    }

    onUpload(event) {
        this.isUploaded=true;
        for(const file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
    }

    get createProductForm() {
        return this.product_form.controls;
    }
}
