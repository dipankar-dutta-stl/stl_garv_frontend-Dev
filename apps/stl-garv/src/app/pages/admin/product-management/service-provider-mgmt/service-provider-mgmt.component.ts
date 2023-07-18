import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { Manufacturer, PortalApiService } from '@stl-garv-frontend/e-portal-api';

@Component({
    selector: 'stl-garv-frontend-service-provider-mgmt',
    templateUrl: './service-provider-mgmt.component.html',
    styles: []
})
export class ServiceProviderMgmtComponent implements OnInit , OnDestroy{

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

    manufacturers: Manufacturer[]=[];

    spId: number;

    constructor(
        private eportalService: PortalApiService, 
        private formBuilder: FormBuilder, 
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private breadcrumb: BreadcrumbService
        ) {}

    ngOnInit(): void {
        this._tabMenu();
        this._getAllmanufacturers();
        this._initForm();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'Products Management',
                routerLink: '/admin/metadata/product-management/product/list'
            },
            {
                label: 'Service Provider Management'
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
            manufacturer_title: ['', Validators.required],
            manufacturer_top: ['', Validators.required],
            manufacturer_image:[this.uploadedFiles]
        });
    };

    private _getAllmanufacturers(){
        this.eportalService.getAllManufacturers().pipe(takeUntil(this.endSubs$)).subscribe(cat=>{
            this.manufacturers=cat;
            this.loading=false;
        })
    }

    createSP(){
        this.prodDialog = true;
        this.editmode=false;
        this.isSubmitted=false;
        this._initForm();
    }

    editManufacturer(manufacturer_id: number){
        this.isSubmitted=false;
        this.prodDialog = true;

        if(manufacturer_id){
            this.editmode=true;
            this.spId=manufacturer_id;
            this.eportalService.getManufacturerById(manufacturer_id).pipe(takeUntil(this.endSubs$)).subscribe(
                (data)=>
                {
                    this.createProductForm.manufacturer_title.setValue(data?.manufacturer_title);
                    this.createProductForm.manufacturer_top.setValue(data?.manufacturer_top);
                }
            )
        }
    }

    saveManufacturer(){
        this.isSubmitted=true;
        if(this.product_form.invalid) return;

        const FormData = {
            manufacturer_title: this.createProductForm.manufacturer_title.value,
            manufacturer_top: this.createProductForm.manufacturer_top.value
        }
        
        if(this.editmode){
            this.eportalService.updateManufacturer(this.spId, FormData).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=>
                {
                    this._getAllmanufacturers();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Service Provider updated successfully!'
                        });
                        this.prodDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Service Provider could not be updated!'
                    }); 
                }
            )
        }
        else{
            this.eportalService.createManufacturer(FormData).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=>
                {
                    this._getAllmanufacturers();
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Service Provider created successfully!'
                        });
                        this.prodDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Service Provider could not be created!'
                    }); 
                }
            )
        }
        
    }

    deleteManufacturer(manufacturer_id: number){
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this service provider?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.eportalService.deleteManufacturer(manufacturer_id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this._getAllmanufacturers(); //get data after deletion
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Service Provider is deleted'
                    })
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Service Provider could not be deleted'
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