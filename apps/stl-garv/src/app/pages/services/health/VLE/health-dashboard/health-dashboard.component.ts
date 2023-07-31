import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { CaseService } from '@stl-garv-frontend/health-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'stl-garv-health-dashboard',
    templateUrl: './health-dashboard.component.html'
})
export class HealthDashboardComponent implements OnInit, OnDestroy {

    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    crumbs: MenuItem[]=[];
    current_month_cases: any;
    payments: any;
    total_cases: any;
    vle_users: any;
    
    constructor(private breadcrumb: BreadcrumbService,
                private caseService: CaseService) {}

    ngOnInit(): void {
    this.setBreadCrumbs();
    this._getDashboardData();
  }

  //end subscriptions to avoid memory leak
  ngOnDestroy(): void {
    this.endSubs$.next(true);
    this.endSubs$.complete();
 }

  setBreadCrumbs(){
    setTimeout(() =>
      this.breadcrumb.setCrumbs([
            {
                label: 'E-Health',
                routerLink: '/health/vle/dashboard'
            }
        ])
    );
  }

  private _getDashboardData(){
    this.caseService.countCasedetails().pipe(takeUntil(this.endSubs$)).subscribe(
      (res)=>
      {
        console.log(res)
        this.total_cases=res.total_cases;
      }
    )
  //    this.caseService.getVleDashboard().pipe(takeUntil(this.endSubs$)).subscribe(
  //     (res)=>{
  //         this.vle_users=res.vle_users;
  //         this.current_month_cases= res.current_month_cases;
  //         this.payments= res.payments;
  //     })
  }
 

}

