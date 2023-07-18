import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserApiService } from '@stl-garv-frontend/users';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { State } from '../../state-mgmt/state-list/state-list.component';
import { BreadcrumbService } from '@stl-garv-frontend/ui';

interface Status {
    status_name: string,
    status_code: string
}

export interface District {
    district_ID?: number,
    state_ID?: number,
    district_NAME?: string,
    status?: string,
    belongs_TO_STATE?: State
}

@Component({
    selector: 'stl-garv-frontend-district-list',
    templateUrl: './district-list.component.html',
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
export class DistrictListComponent implements OnInit , OnDestroy {
    
    endSubs$ : Subject<any> = new Subject();
    items: MenuItem[];
    activeItem: MenuItem;
    districtDialog: boolean;
    status: Status[];
    districts:District[]=[];
    states:any=[];
    region_form: FormGroup;
    districtId: number;
    editmode=false;
    isSubmitted=false;
    loading=true;

    constructor(
        private userService: UserApiService, 
        private formBuilder: FormBuilder, 
        private messageService: MessageService, 
        private confirmationService: ConfirmationService,
        private breadcrumb: BreadcrumbService
        ) {}

    ngOnInit(): void {
        this._tabMenu();
        this._statusOptions();
        this._getAllStates();
        this._getAllDistricts();
        this._initForm();
        setTimeout(() =>
        this.breadcrumb.setCrumbs([
        {
            label: 'Region Management',
            routerLink: '/admin/metadata/region-management/state/list'
        },
        {
            label: 'District Management'
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
            district_name: ['', Validators.required],
            state_id: ['', Validators.required],
            status: ['', Validators.required]
        });
    };

    private _getAllStates(){
        this.userService.getStates().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.states=res;
            
        })
    };

    private _getAllDistricts(){
        this.userService.getDistricts().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.districts=res;
            this.loading=false;
           
            this._mergeStateWithDistrict();
        })
        
      
    }

    createRegion(){
        this.districtDialog = true;
        this.editmode=false;
        this.isSubmitted=false;
        this._initForm();
    }

    editRegion(dist_id:number){
        
        this.districtDialog = true;
        if(dist_id){
            this.editmode=true;
            this.districtId=dist_id;
            this.userService.getDstrictDetailbyId(dist_id).pipe(takeUntil(this.endSubs$)).subscribe((data)=>
            {   
                this.createRegionForm.district_name.setValue(data[0].district_name);
                this.createRegionForm.state_id.setValue(data[0].state_id);
                this.createRegionForm.status.setValue(data[0].status)
            })
        }
    }

    saveRegion() {
        this.isSubmitted=true;

        if(this.region_form.invalid) return;

        if(this.editmode){
            const update_dist_Body = {
                district_name: this.createRegionForm.district_name.value,
                state_id: this.createRegionForm.state_id.value,
                status: this.createRegionForm.status.value
            }
            this.userService.updateDistrict(update_dist_Body, this.districtId).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=> {
                    this._getAllDistricts();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'District updated successfully!'
                    });
                    this.districtDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'District could not be updated!'
                    }); 
                }
            )
        }

        else
        {
            const dist_Body = {
                district_name: this.createRegionForm.district_name.value,
                state_id: this.createRegionForm.state_id.value,
                status: this.createRegionForm.status.value
            }
            this.userService.createDistrict(dist_Body).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=> {
                    this._getAllDistricts();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'District created successfully!'
                    });
                    this.districtDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'District could not be created!'
                    }); 
                }
            )
        }
        
    }

    deleteRegion(dist_id: number){
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this district?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.userService.deleteDistrict(dist_id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this._getAllDistricts(); //get users after deletion
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'District is deleted'
                    })
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'District could not be deleted'
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
        this.districtDialog = false;
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

    private _mergeStateWithDistrict(){
       for(let x=0;x<this.districts.length;x++){
        for(let y=0;y<this.states.length;y++){
            if(this.districts[x].state_ID==this.states[y].state_ID){
                this.districts[x].belongs_TO_STATE=this.states[y];
            }
        }
       }

    }

}
