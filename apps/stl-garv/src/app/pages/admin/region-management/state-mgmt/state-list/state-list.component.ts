import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserApiService } from '@stl-garv-frontend/users';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';
import { BreadcrumbService } from '@stl-garv-frontend/ui';

interface Status {
    status_name: string,
    status_code: string
}

export interface State {
    state_id?: number,
    state_name?: string,
    status?: string,
    created_date?: string,
    updated_date?: string
}

@Component({
    selector: 'stl-garv-frontend-state-list',
    templateUrl: './state-list.component.html',
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
export class StateListComponent implements OnInit, OnDestroy {
    
    endSubs$ : Subject<any> = new Subject();
    items: MenuItem[];
    activeItem: MenuItem;
    stateDialog: boolean;
    status: Status[];
    states: State[]=[];
    region_form: FormGroup;
    stateId: number;
    editmode=false;
    isSubmitted=false;
    loading=true;

    constructor(
        private userService: UserApiService, 
        private formBuilder: FormBuilder, 
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private location: Location,
        private breadcrumb: BreadcrumbService
        ) {}

    ngOnInit(): void {
        this._tabMenu();
        this._statusOptions();
        this._getAllStates();
        this._initForm();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
    
            {
                label: 'Region Management',
                routerLink: '/admin/metadata/region-management/state/list'
            },
            {
                label: 'State Management'
            },
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _initForm(){
        this.region_form = this.formBuilder.group({
            state_name: ['', Validators.required],
            status: ['', Validators.required]
        });
    }

    private _getAllStates(){
        this.userService.getStates().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            console.log(res)
            this.states=res;
            this.loading=false;
        })
    }

    createRegion(){
        this.stateDialog = true;
        this.editmode=false;
        this.isSubmitted=false;
        this._initForm();
    }

    editRegion(state_id:number){
        this.stateDialog = true;

        if(state_id){
            this.editmode=true;
            this.stateId=state_id;
            this.userService.getStateDetailbyId(state_id).pipe(takeUntil(this.endSubs$)).subscribe((data)=>
            {
                this.createRegionForm.state_name.setValue(data.state_name);
                this.createRegionForm.status.setValue(data.status)
            })
        }
    }

    saveRegion() {
        this.isSubmitted=true;

        if(this.region_form.invalid) return;

        if(this.editmode){
            const update_state_Body = {
                state_name: this.createRegionForm.state_name.value,
                status: this.createRegionForm.status.value
            }
            this.userService.updateState(update_state_Body, this.stateId).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=> {
                    this._getAllStates();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'State updated successfully!'
                    });
                    this.stateDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'State could not be updated!'
                    }); 
                }
            )
        }

        else
        {
            const state_Body = {
                state_name: this.createRegionForm.state_name.value,
                status: this.createRegionForm.status.value
            }
            this.userService.createState(state_Body).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=> {
                    this._getAllStates();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'State created successfully!'
                    });
                    this.stateDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'State could not be created!'
                    }); 
                }
            )
        }
        
    }

    deleteRegion(state_id: number){
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this state?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.userService.deleteState(state_id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this._getAllStates(); //get users after deletion
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'State is deleted'
                    })
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'State could not be deleted'
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

    private _tabMenu() {
        this.items = [
            {label: 'State',routerLink: '/admin/metadata/region-management/state/list'},
            {label: 'District',routerLink: '/admin/metadata/region-management/district/list'},
            {label: 'Taluka',routerLink: '/admin/metadata/region-management/taluka/list'},
            {label: 'Panchayat',routerLink: '/admin/metadata/region-management/panchayat/list'},
            {label: 'Village',routerLink: '/admin/metadata/region-management/village/list'},
        ]
    }

    hideDialog() {
        this.stateDialog = false;
    }

    private _statusOptions(){
        this.status = [
            {status_name: 'Active', status_code: 'active'},
            {status_name: 'Inactive', status_code: 'inactive'} 
        ];
    }

    get createRegionForm() {
        return this.region_form.controls;
    }
}

 

