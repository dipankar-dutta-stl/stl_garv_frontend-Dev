import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { UserApiService } from '@stl-garv-frontend/users';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-kiosk-module-count',
    templateUrl: './kiosk-module-count.component.html',
    styles: []
})
export class KioskModuleCountComponent implements OnInit, OnDestroy {
    endSubs$ : Subject<any> = new Subject();
    kioskId: number;
    modules: any[]=[];
    modulesData: any[]=[];
    kioskName: string;
    kioskIp: string; 
    realkioskName: string;
    kiosk_name: any;

    filterOptions: any[];
    selectedFilter: any;
    dayFilter: boolean;
    monthFilter: boolean;

    date: Date;
    date2: Date;
    day: string;
    month: string;
    year: string;
    
    loading= true;

    constructor(
        private userService: UserApiService,
        private breadcrumb: BreadcrumbService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.monthFilter= true;
        this.selectedFilter= 'month';
        this._getModuleCount();
        this._monthDayFilter();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'Kiosk Management',
                routerLink: '/admin/kiosk-management'
            },
            {
                label: 'Module Counts',
            }
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
                this.kioskId=params.id;
                this.userService.getKioskCountById(this.kioskId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
                {
                       this.modules =  res[1];
                       this.kioskName = res[0];
                       this.realkioskName= this.kioskName[0];
                       this.kioskIp = res[0].kiosk_ip;
                       this.loading= false; 
                })
            }
        })
    }

     monthwiseData(){
        this.month= formatDate(this.date, 'MM', 'en' );
        this.year= formatDate(this.date, 'yyyy', 'en' );
        // this.router.navigate(['admin/metadata/region-management/panchayat/list/module-count', this.panchyatId, this.month, this.year])
        this._getModuleCountByMonth(this.kioskId,this.month,this.year);

    }

    daywiseData(){
        this.day= formatDate(this.date2, 'dd', 'en' );
        this.month= formatDate(this.date2, 'MM', 'en' );
        this.year= formatDate(this.date2, 'yyyy', 'en' );
        this._getModuleCountByDay(this.kioskId,this.day, this.month, this.year)
    }

    private _getModuleCountByMonth(id, month, year){
        this.loading= true;
        this.userService.getkioskModuleCountByMonth(id,month,year).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
        {
              this.modules=res[1];
              this.loading= false; 
        })
    }

    private _getModuleCountByDay(id, day, month, year){
        this.loading= true;
        this.userService.getkioskModuleCountByDay(id,day,month,year).pipe(takeUntil(this.endSubs$)).subscribe((res1)=>
        {
              this.modules=res1[1];
              this.loading= false; 
        })
    }

    AllData(){
        this._getModuleCount();
    }

    private _monthDayFilter(){
        this.filterOptions = [{label: 'Month Filter', value: 'month'},
                             {label: 'Day Filter', value: 'day'}];
    }
    
    filterValue(){
        console.log(this.selectedFilter);
        this._getModuleCount();
        if(this.selectedFilter == 'month'){
            this.monthFilter= true;
            this.dayFilter= false;
        }
        if(this.selectedFilter == 'day'){
            this.dayFilter= true;
            this.monthFilter= false;
        }
    }

}
