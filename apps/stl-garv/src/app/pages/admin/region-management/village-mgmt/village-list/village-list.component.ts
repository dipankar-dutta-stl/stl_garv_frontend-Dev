import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { UserApiService } from '@stl-garv-frontend/users';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { District } from '../../district-mgmt/district-list/district-list.component';
import { State } from '../../state-mgmt/state-list/state-list.component';
import { Taluka } from '../../taluka-mgmt/taluka-list/taluka-list.component';
import { BreadcrumbService } from '@stl-garv-frontend/ui';

interface Status {
    status_name: string,
    status_code: string
}

export interface Village {
    village_ID?: number,
    taluka_ID?: number,
    village_NAME?: string,
    status?: string,
    created_DATE?: string,
    updated_DATE?: string,
    belongs_TO_TALUKA?: Taluka,
    belongs_TO_DISTRICT?: District,
    belongs_TO_STATE?:State
}

@Component({
    selector: 'stl-garv-frontend-village-list',
    templateUrl: './village-list.component.html',
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
export class VillageListComponent implements OnInit, OnDestroy {
    endSubs$ : Subject<any> = new Subject();
    items: MenuItem[];
    activeItem: MenuItem;
    villageDialog: boolean;
    status: Status[];
    villages: Village[];
    talukas: Taluka[]=[];
    districts: District[]=[];
    dist_filter: District[]=[];
    states: State[]=[];
    region_form: FormGroup;
    villageId: number;
    distId: number;
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
        this._getAllVillages();
        this._initForm();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'Region Management',
                routerLink: '/admin/metadata/region-management/state/list'
            },
            {
                label: 'Village Management'
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
            village_name: ['', Validators.required],
            taluka_id: ['', Validators.required],
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

    getTalukabyDistrictId(optionValue:number){
        this.distId=optionValue;
        if(this.distId){
            this.userService.getTalukabyDistrictId(this.distId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
            {
                this.talukas=res[0].has_taluka;  
            });
        }
    }
        
 
    private _getAllTalukas(){
        this.userService.getTalukas().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.talukas=res;
            
        })
    }

    private _getAllVillages(){
        this.userService.getVillages().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.villages=res;
            this.loading=false;
            this._mergeAllTheDetails();
        })
    }

    createRegion(){
        this.villageDialog = true;
        this.editmode=false;
        this.isSubmitted=false;
        this._initForm();
    }

    editRegion(village_id:number){
        
        this.villageDialog = true;
        if(village_id){
            this.editmode=true;
            this.villageId=village_id;
            this.userService.getVillageDetailbyId(village_id).pipe(takeUntil(this.endSubs$)).subscribe((data)=>
            {   
                this.createRegionForm.village_name.setValue(data[0].village_name);
                this.createRegionForm.state_id.setValue(data[0].belongs_to_taluka.belongs_to_district.belongs_to_state.state_id);
                this.createRegionForm.district_id.setValue(data[0].belongs_to_taluka.belongs_to_district.district_id);
                this.createRegionForm.taluka_id.setValue(data[0].belongs_to_taluka.taluka_id);
                this.createRegionForm.status.setValue(data[0].status)
            })
        }
    }

    saveRegion() {
        this.isSubmitted=true;

        if(this.region_form.invalid) return;

        if(this.editmode){
            const update_village_Body = {
                village_name: this.createRegionForm.village_name.value,
                taluka_id: this.createRegionForm.taluka_id.value,
                status: this.createRegionForm.status.value
            }
            this.userService.updateVillage(update_village_Body, this.villageId).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=> {
                    this._getAllVillages();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Village updated successfully!'
                    });
                    this.villageDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Village could not be updated!'
                    }); 
                }
            )
        }

        else
        {
            const village_Body = {
                village_name: this.createRegionForm.village_name.value,
                taluka_id: this.createRegionForm.taluka_id.value,
                status: this.createRegionForm.status.value
            }
            this.userService.createVillage(village_Body).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=> {
                    this._getAllVillages();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Village created successfully!'
                    });
                    this.villageDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Village could not be created!'
                    }); 
                }
            )
        }
        
    }

    deleteRegion(village_id: number){
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this village?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.userService.deleteVillage(village_id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this._getAllVillages(); //get users after deletion
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Village is deleted'
                    })
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Village could not be deleted'
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
        this.villageDialog = false;
        
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


    _mergeAllTheDetails(){
        for(let x=0;x<this.villages.length;x++){
            for(let y=0;y<this.talukas.length;y++){
                if(this.villages[x].taluka_ID==this.talukas[y].taluka_ID){
                    this.villages[x].belongs_TO_TALUKA=this.talukas[y];
                }
            }
           }
        
           for(let x=0;x<this.villages.length;x++){
            for(let y=0;y<this.districts.length;y++){
                if(this.villages[x].belongs_TO_TALUKA.district_ID==this.districts[y].district_ID){
                    this.villages[x].belongs_TO_DISTRICT=this.districts[y];
                }
            }
           }

           for(let x=0;x<this.villages.length;x++){
            for(let y=0;y<this.states.length;y++){
                if(this.villages[x].belongs_TO_DISTRICT.state_ID==this.states[y].state_ID){
                    this.villages[x].belongs_TO_STATE=this.states[y];
                }
            }
           }
    }
}
