import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserApiService } from '@stl-garv-frontend/users';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { District } from '../../district-mgmt/district-list/district-list.component';
import { State } from '../../state-mgmt/state-list/state-list.component';
import { Taluka } from '../../taluka-mgmt/taluka-list/taluka-list.component';
import { Village } from '../../village-mgmt/village-list/village-list.component';
import { BreadcrumbService } from '@stl-garv-frontend/ui';

interface Status {
    status_name: string,
    status_code: string
}

export interface Panchayat {
    panchayat_ID?: number
    panchayat_NAME?: string
    panchayat_UNIQUE_ID?: number
    pincode?: number
    panchayat_STATUS?: string
    state_ID?: number
    district_ID?: number
    talika_ID?: number
    village_ID?: number
    created_date?: string
    updated_date?: string
    belongs_TO_VILLAGE?: Village
    belongs_TO_TALUKA: Taluka
    belongs_TO_DISTRICT?: District
    belongs_TO_STATE?: State
    xyz?:String
    
}

@Component({
    selector: 'stl-garv-frontend-panchayat-list',
    templateUrl: './panchayat-list.component.html',
    styles: []
})
export class PanchayatListComponent implements OnInit, OnDestroy {
    endSubs$: Subject<any> = new Subject();
    items: MenuItem[];
    activeItem: MenuItem;

    panchayatDialog: boolean;
    moduleDialog: boolean;

    selectedModule: any[] = [];
    modules: any[] = [];
    status: Status[];
    panchayats: Panchayat[] = [];
    villages: Village[] = [];
    talukas: Taluka[] = [];
    districts: District[] = [];
    dist_filter: District[] = [];
    states: State[] = [];
    tid:number;

    region_form: FormGroup;
    panchayatId: number;
    villageId: number;
    distId: number;
    talukaId: number;
    stateId: number;
    TotalDist: number;

    editmode = false;
    isSubmitted = false;
    loading = true;
    moduleChange = false;

    constructor(
        private userService: UserApiService,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private breadcrumb: BreadcrumbService
    ) { }

    ngOnInit(): void {
        this._tabMenu();
        this._statusOptions();
        this._getAllStates();
        this._getAllDistricts();
        this._getAllTalukas();
        this._getAllVillages();
        this._getAllModules();
        this._initForm();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
                {
                    label: 'Region Management',
                    routerLink: '/admin/metadata/region-management/state/list'
                },
                {
                    label: 'Panchayat Management'
                },
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _initForm() {
        this.region_form = this.formBuilder.group({
            panchayat_unique_id: ['', Validators.required],
            panchayat_name: ['', Validators.required],
            pincode: ['', Validators.required],
            village_id: ['', Validators.required],
            taluka_id: ['', Validators.required],
            state_id: ['', Validators.required],
            district_id: ['', Validators.required],
            panchayat_status: ['', Validators.required]
        });
    };


    private _getAllStates() {
        this.userService.getStates().pipe(takeUntil(this.endSubs$)).subscribe((res) => {
            this.states = res;
            
        })
    };

    getDistbyStateId(optionValue: number) {
        this.stateId = optionValue;
        if (this.stateId) {
            this.userService.getDistrictbyStateId(this.stateId).pipe(takeUntil(this.endSubs$)).subscribe((res) => {
                this.districts = res[0].has_district;
            });
        }
    }

    private _getAllDistricts() {
        this.userService.getDistricts().pipe(takeUntil(this.endSubs$)).subscribe((res) => {
            this.districts = res;
            this.TotalDist = this.districts.length;
            
        })
    }

    private _getAllModules() {
        this.userService.getAllModules().pipe(takeUntil(this.endSubs$)).subscribe((res) => {
            this.modules = res;
        })
    }

    getTalukabyDistrictId(optionValue: number) {
        this.distId = optionValue;
        if (this.distId) {
            this.userService.getTalukabyDistrictId(this.distId).pipe(takeUntil(this.endSubs$)).subscribe((res) => {
                this.talukas = res[0].has_taluka;
            });
        }
    }

    getVillagebyTalukaId(optionValue: number) {
        this.talukaId = optionValue;
        if (this.talukaId) {
            this.userService.getVillagebyTalukaId(this.talukaId).pipe(takeUntil(this.endSubs$)).subscribe((res) => {
                this.villages = res[0].has_village;
            });
        }
    }


    private _getAllTalukas() {
        this.userService.getTalukas().pipe(takeUntil(this.endSubs$)).subscribe((res) => {
            this.talukas = res;
        })

    }

    private _getAllVillages() {
        this.userService.getVillages().pipe(takeUntil(this.endSubs$)).subscribe((res) => {
            this.villages = res;
            this.loading = false;
            this._getAllPanchayats()
        })
    }
    private _getAllPanchayats() {
        this.userService.getPanchayat().pipe(takeUntil(this.endSubs$)).subscribe((res) => {
            this.panchayats = res;
            this.loading = false;
            this._mergeAllDetails();
        })
    }

    createRegion() {
        this.panchayatDialog = true;
        this.editmode = false;
        this.isSubmitted = false;
        this._initForm();
        this._getAllVillages();
    }

    editRegion(panchayat_id: number) {

        this.panchayatDialog = true;
        this._getAllVillages();
        if (panchayat_id) {
            this.editmode = true;
            this.panchayatId = panchayat_id;
            this.userService.getPanchayatDetailbyId(panchayat_id).pipe(takeUntil(this.endSubs$)).subscribe((data) => {
                this.createRegionForm.panchayat_name.setValue(data[0].panchayat_name);
                this.createRegionForm.panchayat_unique_id.setValue(data[0].panchayat_unique_id);
                this.createRegionForm.state_id.setValue(data[0].belongs_to_village.belongs_to_taluka.belongs_to_district.belongs_to_state.state_id);
                this.createRegionForm.district_id.setValue(data[0].belongs_to_village.belongs_to_taluka.belongs_to_district.district_id);
                this.createRegionForm.taluka_id.setValue(data[0].belongs_to_village.belongs_to_taluka.taluka_id);
                this.createRegionForm.village_id.setValue(data[0].belongs_to_village.village_id)
                this.createRegionForm.pincode.setValue(data[0].pincode);
                this.createRegionForm.panchayat_status.setValue(data[0].panchayat_status);
            })
        }
    }

    saveRegion() {
        this.isSubmitted = true;

        if (this.region_form.invalid) return;

        if (this.editmode) {
            const update_panchayat_Body = {
                panchayat_name: this.createRegionForm.panchayat_name.value,
                panchayat_unique_id: this.createRegionForm.panchayat_unique_id.value,
                pincode: this.createRegionForm.pincode.value,
                state_id: this.createRegionForm.state_id.value,
                district_id: this.createRegionForm.district_id.value,
                village_id: this.createRegionForm.village_id.value,
                taluka_id: this.createRegionForm.taluka_id.value,
                panchayat_status: this.createRegionForm.panchayat_status.value
            }
            this.userService.updatePanchayat(update_panchayat_Body, this.panchayatId).pipe(takeUntil(this.endSubs$)).subscribe(
                () => {
                    this._getAllPanchayats();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Panchayat updated successfully!'
                    });
                    this.panchayatDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Panchayat could not be updated!'
                    });
                }
            )
        }

        else {
            const panchayat_Body = {
                panchayat_name: this.createRegionForm.panchayat_name.value,
                panchayat_unique_id: this.createRegionForm.panchayat_unique_id.value,
                pincode: this.createRegionForm.pincode.value,
                state_id: this.createRegionForm.state_id.value,
                district_id: this.createRegionForm.district_id.value,
                village_id: this.createRegionForm.village_id.value,
                taluka_id: this.createRegionForm.taluka_id.value,
                panchayat_status: this.createRegionForm.panchayat_status.value
            }
            this.userService.createPanchayat(panchayat_Body).pipe(takeUntil(this.endSubs$)).subscribe(
                () => {
                    this._getAllPanchayats();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Panchayat created successfully!'
                    });
                    this.panchayatDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Panchayat could not be created!'
                    });
                }
            )
        }

    }

    selectModule(pid: number) {

        this.moduleDialog = true;
        this._getAllModules();
        this.panchayatId = pid;

        if (pid) {
            this.userService.getModulesbyGP(pid).pipe(takeUntil(this.endSubs$)).subscribe((res) => {
                const mod = res.map(ele => ele.module_id);
                this.selectedModule = mod;
                
            })
        }
    }


    createModule() {

        const module_Body = {
            modules: this.selectedModule
        }


        if (this.selectedModule && this.moduleChange) {
            this.userService.assignModuleToGP(this.panchayatId, module_Body).pipe(takeUntil(this.endSubs$)).subscribe(
                () => {
                    this._getAllPanchayats();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Modules mapped successfully!'
                    });
                    this.moduleDialog = false;
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Modules could not be mapped!'
                    });
                }
            )
        }
    }

    deleteRegion(panchayat_id: number) {
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this panchayat?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.userService.deletePanchayat(panchayat_id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this._getAllVillages(); //get users after deletion
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Panchayat is deleted'
                    })
                },
                    () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Panchayat could not be deleted'
                        });
                    });
            },
            reject: (type) => {
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
                        break;
                    case ConfirmEventType.CANCEL:
                        this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                        break;
                }
            }
        });
    }

    private _tabMenu() {
        this.items = [
            { label: 'State', routerLink: '/admin/metadata/region-management/state/list' },
            { label: 'District', routerLink: '/admin/metadata/region-management/district/list' },
            { label: 'Taluka', routerLink: '/admin/metadata/region-management/taluka/list' },
            { label: 'Panchayat', routerLink: '/admin/metadata/region-management/panchayat/list' },
            { label: 'Village', routerLink: '/admin/metadata/region-management/village/list' },
        ]
    }

    hideDialog() {
        this.panchayatDialog = false;
        this.moduleDialog = false;

    }

    private _statusOptions() {
        this.status = [
            { status_name: 'Active', status_code: 'active' },
            { status_name: 'Inactive', status_code: 'deactive' }
        ];
    }

    onChange($event: any) {
        if ($event) {
            this.moduleChange = true;
        }
    }

    get createRegionForm() {
        return this.region_form.controls;
    }


    private _mergeAllDetails() {

        for (let x = 0; x < this.panchayats.length; x++) {
            for (let y = 0; y < this.states.length; y++) {
                if (this.panchayats[x].state_ID == this.states[y].state_ID) {
                    this.panchayats[x].belongs_TO_STATE = this.states[y]
                }
            }
        }
        

        for (let x = 0; x < this.panchayats.length; x++) {
            for (let y = 0; y < this.districts.length; y++) {
                if (this.panchayats[x].district_ID == this.districts[y].district_ID) {
                    this.panchayats[x].belongs_TO_DISTRICT = this.districts[y];
                }
            }
        }
    

        for (let x = 0; x < this.panchayats.length; x++) {
            for (let y = 0; y < this.talukas.length; y++) {
                if (this.panchayats[x].talika_ID == this.talukas[y].taluka_ID) {
                    this.panchayats[x].belongs_TO_TALUKA =this.talukas[y];
                }
            }
            
        }


        for (let x = 0; x < this.panchayats.length; x++) {
            for (let y = 0; y < this.villages.length; y++) {
                if (this.panchayats[x].village_ID == this.villages[y].village_ID) {
                    this.panchayats[x].belongs_TO_VILLAGE = this.villages[y];
                }
            }
        }
    }
}
