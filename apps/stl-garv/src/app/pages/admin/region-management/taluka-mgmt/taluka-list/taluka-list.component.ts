import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserApiService } from '@stl-garv-frontend/users';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';
import { State } from '../../state-mgmt/state-list/state-list.component';
import { District } from '../../district-mgmt/district-list/district-list.component';
import { BreadcrumbService } from '@stl-garv-frontend/ui';

interface Status {
    status_name: string,
    status_code: string
}

export interface Taluka {
    taluka_id?: number,
    district_id?: number,
    taluka_name?: string,
    status?: string,
    created_date?: string,
    updated_date?: string,
    belongs_to_district?: District
}

@Component({
    selector: 'stl-garv-frontend-taluka-list',
    templateUrl: './taluka-list.component.html',
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
export class TalukaListComponent implements OnInit , OnDestroy {
    
    endSubs$ : Subject<any> = new Subject();
    items: MenuItem[];
    activeItem: MenuItem;
    talukaDialog: boolean;
    status: Status[];
    talukas:any;
    districts: District[]=[];
    dist_filter: District[]=[];
    states: State[]=[];
    region_form: FormGroup;
    talukaId: number;
    stateId: number;
    TotalDist: number;
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
        this._getAllDistricts();
        this._getAllTalukas();
        this._initForm();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
        
            {
                label: 'Region Management',
                routerLink: '/admin/metadata/region-management/state/list'
            },
            {
                label: 'Taluka Management'
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
            taluka_name: ['', Validators.required],
            state_id: ['', Validators.required],
            district_id: ['', Validators.required],
            status: ['', Validators.required]
        });
    };

    private _getAllStates(){
        this.userService.getStates().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.states=res;
        })
    };

    getDistbyStateId(optionValue:number){
        this.stateId=optionValue;
        if(this.stateId){
            this.userService.getDistrictbyStateId(this.stateId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
            {
                this.districts=res[0].has_district;
            });
        }
    }

    private _getAllDistricts(){
        this.userService.getDistricts().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.districts=res;
            this.TotalDist=this.districts.length;
        })
    }
        

    private _getAllTalukas(){
        this.userService.getTalukas().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            
            this.talukas=res;
            console.log(this.talukas);
            this.loading=false;
        })
    }

    createRegion(){
        this.talukaDialog = true;
        this.editmode=false;
        this.isSubmitted=false;
        this._initForm();
    }

    editRegion(tal_id:number){
        
        this.talukaDialog = true;
        if(tal_id){
            this.editmode=true;
            this.talukaId=tal_id;
            this.userService.getTalukaDetailbyId(tal_id).pipe(takeUntil(this.endSubs$)).subscribe((data)=>
            {   
                this.createRegionForm.taluka_name.setValue(data[0].taluka_name);
                this.createRegionForm.state_id.setValue(data[0].belongs_to_district.belongs_to_state.state_id);
                this.createRegionForm.district_id.setValue(data[0].belongs_to_district.district_id);
                this.createRegionForm.status.setValue(data[0].status)
            })
        }
    }

    saveRegion() {
        this.isSubmitted=true;

        if(this.region_form.invalid) return;

        if(this.editmode){
            const update_tal_Body = {
                taluka_name: this.createRegionForm.taluka_name.value,
                district_id: this.createRegionForm.district_id.value,
                status: this.createRegionForm.status.value
            }
            this.userService.updateTaluka(update_tal_Body, this.talukaId).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=> {
                    this._getAllTalukas();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Taluka updated successfully!'
                    });
                    this.talukaDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Taluka could not be updated!'
                    }); 
                }
            )
        }

        else
        {
            const tal_Body = {
                taluka_name: this.createRegionForm.taluka_name.value,
                district_id: this.createRegionForm.district_id.value,
                status: this.createRegionForm.status.value
            }
            this.userService.createTaluka(tal_Body).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=> {
                    this._getAllTalukas();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Taluka created successfully!'
                    });
                    this.talukaDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Taluka could not be created!'
                    }); 
                }
            )
        }
        
    }

    deleteRegion(tal_id: number){
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this taluka?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.userService.deleteTaluka(tal_id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this._getAllTalukas(); //get users after deletion
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Taluka is deleted'
                    })
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Taluka could not be deleted'
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
        this.talukaDialog = false;
        
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
