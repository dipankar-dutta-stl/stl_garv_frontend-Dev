import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { UserApiService } from '@stl-garv-frontend/users';
import { Subject, takeUntil } from 'rxjs';
import { Panchayat } from '../../region-management/panchayat-mgmt/panchayat-list/panchayat-list.component';
import { formatDate } from '@angular/common';

@Component({
    selector: 'stl-garv-frontend-module-count',
    templateUrl: './module-count.component.html',
    styles: []
})
export class ModuleCountComponent implements OnInit, OnDestroy {
    
    endSubs$ : Subject<any> = new Subject();
    panchyatId: number;
    modules: any[]=[];
    panchayatName: Panchayat[] =[];

    date: Date;
    month: string;
    year: string;
    
    loading= true;

    constructor(
        private userService: UserApiService,
        private breadcrumb: BreadcrumbService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this._getModuleCount();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'Region Management',
                routerLink: '/admin/metadata/region-management/state/list'
            },
            {
                label: 'Panchayat Management',
                routerLink: '/admin/metadata/region-management/panchayat/list'
            },
            {
                label: 'Module Counts',
            },
            ])
        );
    }

     //end subscriptions to avoid memory leak
     ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getModuleCount(){
        this.loading = true;
        this.route.params.subscribe((params) => {
            if(params.id){
                this.panchyatId=params.id;
                this.userService.getgpModuleCount(this.panchyatId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
                {
                   this.panchayatName = res[0].panchayat_name;
                   this.modules=res[1];
                   this.loading= false; 
                })
            }
        })
    }

     monthwiseData(){
        this.month= formatDate(this.date, 'MM', 'en' );
        this.year= formatDate(this.date, 'yyyy', 'en' );
        // this.router.navigate(['admin/metadata/region-management/panchayat/list/module-count', this.panchyatId, this.month, this.year])
        this._getModuleCountByMonth(this.panchyatId,this.month,this.year);

    }

    private _getModuleCountByMonth(id, month, year){
        this.loading= true;
        this.userService.getgpModuleCountByMonth(id,month,year).pipe(takeUntil(this.endSubs$)).subscribe((res1)=>
        {
           this.panchayatName = res1[0].panchayat_name;
           this.modules=res1[1];
           this.loading= false;
        })
    }

    AllData(){
        this._getModuleCount();
    }
}
