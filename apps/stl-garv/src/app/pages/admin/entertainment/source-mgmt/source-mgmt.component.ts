import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@env/environment';
import { Source, SourceService } from '@stl-garv-frontend/entertainment-api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

interface Status {
    status_name: string,
    status_code: string
}

@Component({
    selector: 'stl-garv-frontend-source-mgmt',
    templateUrl: './source-mgmt.component.html',
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

export class SourceMgmtComponent implements OnInit, OnDestroy {
    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    sourceList: Source[]=[];
    stateOptions: any[];
    
    form: FormGroup;
    loading = true;
    sourceDialog = false;
    editmode=false;
    isSubmitted=false;
    isUploaded= false;

    sourceId: number;
    
    imageDisplay: string | ArrayBuffer;
    file: File | null = null;

    status: Status[];
    
    
    constructor(
        private sourceService: SourceService, 
        private formBuilder: FormBuilder, 
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit(): void {
        this._initForm();
        this._statusOptions();
        this._getAllSource();
        this._redirectToggle()
        
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _initForm(){
        this.form = this.formBuilder.group({
            source_name:['', Validators.required],
            source_description: ['', Validators.required],
            source_url: ['', Validators.required],
            isRedirection: ['', Validators.required],
            source_status: ['', Validators.required],
            image:['']
        });
    }

    private _getAllSource(){
            this.sourceService.getAllSources().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
                this.sourceList=res;
                this.loading= false;
            })
    }
     
    createModule(){

        this.sourceDialog = true;
        this.editmode=false;
        this.isSubmitted=false;
        this.imageDisplay=null;
        this.file=null;
        this.isUploaded=false;
        this._initForm();
       
    }

    editModule(source_id:number){
        
        this.file=null;
        this.isSubmitted=false;
        this.sourceDialog = true;
        this.isUploaded=false;
        this._initForm();
            
        if(source_id){
            this.editmode=true;
            this.sourceId=source_id;
            this.sourceService.getSourcebyId(source_id).pipe(takeUntil(this.endSubs$)).subscribe((data)=>
            {   
                this.createModuleForm.source_name.setValue(data.source_name);
                this.createModuleForm.source_description.setValue(data.source_description);
                this.createModuleForm.source_url.setValue(data.source_url);
                this.createModuleForm.source_status.setValue(data.source_status);
                this.createModuleForm.isRedirection.setValue(data.isRedirection);
                this.imageDisplay = data.source_image;
                this.createModuleForm.image.setValidators([]);
                this.createModuleForm.image.updateValueAndValidity();
                
            })
        }
    }

    _createModule(data: any){

        this.sourceService.createSource(data).pipe(takeUntil(this.endSubs$)).subscribe(
        (res)=>{
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Source created Successfully!'
            });

            this.sourceService.postSourceImage(res.id, this.file).pipe(takeUntil(this.endSubs$)).subscribe(

                ()=>{
                    console.log('success')
                },
                () => (error: HttpErrorResponse) => {
                    if(error){
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Source  added!'
                        });
                    }
                })

            this.sourceDialog = false;
            this._getAllSource();
        },
        () => {
            this.sourceDialog = false;
            this._getAllSource();
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Source created!'
            }); 
        })
    }

    private _editModule(data: any){

        this.sourceService.updateSource(this.sourceId, data).pipe(takeUntil(this.endSubs$)).subscribe(
            ()=> 
            {
                this._getAllSource();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Source updated successfully!'
                    });
                    this.sourceDialog = false;
            },
            () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Source could not be updated!'
                }); 
            }
        )

        //Image Upload
        if(this.isUploaded){
        this.sourceService.postSourceImage(this.sourceId, this.file).pipe(takeUntil(this.endSubs$)).subscribe(
            ()=> {
                this._getAllSource();
            },
            (error: HttpErrorResponse) => {
                if(error){
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Source Image could not be updated!'
                    });
                }
            })
        }
    }

    saveModule(){
    
        this.isSubmitted = true;

        if(this.form.invalid) return;

        const data = {
            source_name: this.createModuleForm.source_name.value,
            source_description: this.createModuleForm.source_description.value,
            source_url: this.createModuleForm.source_url.value,
            source_status: this.createModuleForm.source_status.value,
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
            message: 'Do you want to delete this Source?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.sourceService.deleteSourcebyId(id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Source is deleted'
                    });
                    this._getAllSource();
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Source could not be deleted'
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
        this.sourceDialog= false;
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
