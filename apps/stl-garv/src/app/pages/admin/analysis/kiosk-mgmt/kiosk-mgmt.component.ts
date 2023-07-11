import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserApiService } from '@stl-garv-frontend/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { Panchayat } from '../../region-management/panchayat-mgmt/panchayat-list/panchayat-list.component';


export interface Kiosk {
    kiosk_id?: number,
    kiosk_ip?: string,
    kiosk_name?: string,
    gp_id?: number,
    gram?: Panchayat
}

@Component({
    selector: 'stl-garv-frontend-kiosk-mgmt',
    templateUrl: './kiosk-mgmt.component.html',
    styles: []
})
export class KioskMgmtComponent implements OnInit, OnDestroy {
    endSubs$ : Subject<any> = new Subject();
    kiosks: Kiosk[];
    panchayats: Panchayat[];
    loading= true;
    kioskDialog = false;
    // moduleList: UsrModules[]=[];
    
    form: FormGroup;
    editmode=false;
    isSubmitted=false;
    isUploaded= false;

    kioskId: number;
    
    constructor(
        private userService: UserApiService, 
        private formBuilder: FormBuilder, 
        private messageService: MessageService, 
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this._getAllKiosk();
        this._getAllPanchayats();
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _initForm(){
        this.form = this.formBuilder.group({
            kiosk_ip:['', Validators.required],
            kiosk_name: ['', Validators.required],
            panchayat_id: ['', Validators.required]

        });
    }

    private _getAllKiosk(){
        this.userService.getKioskgp().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.kiosks=res;
            this.loading= false;
        })
    };

    private _getAllPanchayats(){
        this.userService.getPanchayat().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.panchayats=res;
            console.log(this.panchayats);
            this.loading=false;
        })
    }

    createKiosk(){

        this.kioskDialog = true;
        this.editmode=false;
        this.isSubmitted=false;
        this.isUploaded=false;
        this._initForm();
       
    }

    editKiosk(kiosk_id:number){
        
        this.isSubmitted=false;
        this.kioskDialog = true;
        this.isUploaded=false;
        this._initForm();
            
        if(kiosk_id){
            this.editmode=true;
            this.kioskId=kiosk_id;
            this.userService.getKioskbyId(kiosk_id).pipe(takeUntil(this.endSubs$)).subscribe((data)=>
            {   
                this.createKioskForm.kiosk_ip.setValue(data[0].kiosk_ip);
                this.createKioskForm.kiosk_name.setValue(data[0].kiosk_name);
                this.createKioskForm.panchayat_id.setValue(data[0].gp_id);
            })
        }
    }

    _createKiosk(data: any){

        this.userService.createKiosk(data).pipe(takeUntil(this.endSubs$)).subscribe(
        ()=>{

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Kiosk created Successfully!'
            });

            this.kioskDialog = false;
            this._getAllKiosk();
        },
        () => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Kiosk could not be created!'
            }); 
        })
    }

    private _editKiosk(data: any){

        this.userService.updateKioskById(this.kioskId, data).pipe(takeUntil(this.endSubs$)).subscribe(
            ()=> 
            {
                this._getAllKiosk();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Kiosk updated successfully!'
                    });
                    this.kioskDialog = false;
            },
            () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Kiosk could not be updated!'
                }); 
            }
        )
    
    }

    saveModule(){
    
        this.isSubmitted = true;

        if(this.form.invalid) return;

        const data = {
            kiosk_ip: this.createKioskForm.kiosk_ip.value,
            kiosk_name: this.createKioskForm.kiosk_name.value,
            gp_id: this.createKioskForm.panchayat_id.value
        }

        if(this.editmode){
            this._editKiosk(data);
        }
        else{
            this._createKiosk(data);
        }
    }
    

    deleteKiosk(id: number){
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this module?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.userService.deleteKiosk(id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Kiosk is deleted'
                    });
                    this._getAllKiosk();
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Kiosk could not be deleted'
                    });
                });
            },
        });
    }

    hideDialog(){
        this.kioskDialog= false;
    }

    get createKioskForm() {
        return this.form.controls;
    }
}
