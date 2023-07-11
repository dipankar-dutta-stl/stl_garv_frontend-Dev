import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { UserApiService, UsrModules } from '@stl-garv-frontend/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';


interface Status {
    status_name: string,
    status_code: string
}

@Component({
    selector: 'stl-garv-frontend-module-management',
    templateUrl: './module-management.component.html',
    styles: [`
    .active {
        font-weight: 700;
        color: #66BB6A;
        text-transform: uppercase;
    }

    .inactive {
        font-weight: 700;
        color: #f05a5a;
        text-transform: uppercase;
    }
 `]
})
export class ModuleManagementComponent implements OnInit, OnDestroy {

    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    moduleList: UsrModules[]=[];
    testModule: UsrModules[]=[];
    stateOptions: any[];
    
    form: FormGroup;
    loading = true;
    moduleDialog = false;
    editmode=false;
    isSubmitted=false;
    isUploaded= false;

    moduleId: number;
    
    imageDisplay: string | ArrayBuffer;
    file: File | null = null;

    status: Status[];
    
    
    constructor(
        private userService: UserApiService, 
        private formBuilder: FormBuilder, 
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit(): void {
        this._initForm();
        this._statusOptions();
        this._getAllModule();
        this._redirectToggle()
        
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _initForm(){
        this.form = this.formBuilder.group({
            module_name:['', Validators.required],
            description: ['', Validators.required],
            module_url: ['', Validators.required],
            isRedirection: ['', Validators.required],
            module_status: ['', Validators.required],
            image:['']
        });
    }

    private _getAllModule(){
            this.userService.getAllModules().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
                this.moduleList=res;
                this.loading= false;
            })
    }
     
    createModule(){

        this.moduleDialog = true;
        this.editmode=false;
        this.isSubmitted=false;
        this.imageDisplay=null;
        this.file=null;
        this.isUploaded=false;
        this._initForm();
       
    }

    editModule(module_id:number){
        
        this.file=null;
        this.isSubmitted=false;
        this.moduleDialog = true;
        this.isUploaded=false;
        this._initForm();
            
        if(module_id){
            this.editmode=true;
            this.moduleId=module_id;
            this.userService.getModulebyId(module_id).pipe(takeUntil(this.endSubs$)).subscribe((data)=>
            {   
                this.createModuleForm.module_name.setValue(data.module_name);
                this.createModuleForm.description.setValue(data.description);
                this.createModuleForm.module_url.setValue(data.module_url);
                this.createModuleForm.module_status.setValue(data.module_status);
                this.createModuleForm.description.setValue(data.description);
                this.createModuleForm.isRedirection.setValue(data.isRedirection);
                this.imageDisplay = data.module_image;
                this.createModuleForm.image.setValidators([]);
                this.createModuleForm.image.updateValueAndValidity();
                
            })
        }
    }

    _createModule(data: any){

        this.userService.createModule(data).pipe(takeUntil(this.endSubs$)).subscribe(
        (res)=>{
            this.testModule=res; //Jest reference variable
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Module created Successfully!'
            });

            this.userService.postModuleImg(res.module_id, this.file).pipe(takeUntil(this.endSubs$)).subscribe(

                ()=>{
                    console.log('success')
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Module Image could not be added!'
                    });      
                })

            this.moduleDialog = false;
            this._getAllModule();
        },
        () => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Module could not be created!'
            }); 
        })
    }

    private _editModule(data: any){

        this.userService.updateModule(this.moduleId, data).pipe(takeUntil(this.endSubs$)).subscribe(
            ()=> 
            {
                this._getAllModule();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Module updated successfully!'
                    });
                    this.moduleDialog = false;
            },
            () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Module could not be updated!'
                }); 
            }
        )

        //Image Upload
        if(this.isUploaded){
        this.userService.postModuleImg(this.moduleId, this.file).pipe(takeUntil(this.endSubs$)).subscribe(
            ()=> {
                this._getAllModule();
            },
            (error: HttpErrorResponse) => {
                if(error){
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Module Image could not be updated!'
                    });
                }
            })
        }
    }

    saveModule(){
    
        this.isSubmitted = true;

        if(this.form.invalid) return;

        const data = {
            module_name: this.createModuleForm.module_name.value,
            description: this.createModuleForm.description.value,
            module_url: this.createModuleForm.module_url.value,
            module_status: this.createModuleForm.module_status.value,
            isRedirection: this.createModuleForm.isRedirection.value
        }

        if(this.editmode){
            this._editModule(data);
        }
        else{
            this._createModule(data);
        }
    }
    

    deleteModule(id: number){
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this module?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.userService.deleteModule(id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Module is deleted'
                    });
                    this._getAllModule();
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Module could not be deleted'
                    });
                });
            },
        });
    }

    onImageUpload(event) {

        this.isUploaded=true;
            
        this.file = event.target.files[0];
        if (this.file) {
            this.form.patchValue({ image: this.file });
            this.form.get('image').updateValueAndValidity();
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.imageDisplay = fileReader.result;
            };
            fileReader.readAsDataURL(this.file);
        }
    }

    removeImage(element){
        element.value ="";
        this.imageDisplay ="";
    }
   
    hideDialog(){
        this.moduleDialog= false;
    }

    private _statusOptions(){
        this.status = [
            {status_name: 'Active', status_code: 'active'},
            {status_name: 'Inactive', status_code: 'deactive'} 
        ];
    }

    get createModuleForm() {
        return this.form.controls;
    }
    
    private _redirectToggle(){
        this.stateOptions = [{label: 'No', value: 0}, {label: 'Yes', value: 1}];
    }
}
