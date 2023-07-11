import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { CaseService } from '@stl-garv-frontend/health-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-user-case-details',
    templateUrl: './user-case-details.component.html',
    styles: []
})
export class UserCaseDetailsComponent implements OnInit , OnDestroy {
    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    caseId: number;
    full_name: any;
    reg_no: any;
    aadhar: any;
    contact: any;
    age: any;
    caseDate: any;
    caseStatus: any;
    hd_temp:any;
    hd_weight:any;
    hd_bgl: any;
    hd_pgl: any;
    hd_oxy: any;
    hd_pompulse:any;
    hd_sysBp: any;
    hd_diasBp: any;
    hd_map: any;
    hd_bppulse: any;
    hd_steps: any;
    hd_heartrate: any;
    hd_cal: any;

    fetchimage: any;

    constructor(private route: ActivatedRoute, private healthService: CaseService, private breadcrumb: BreadcrumbService) {}

    ngOnInit(): void {
        this._getCaseDetails();
        this._getUserDetails();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Health',
                routerLink: '/health/user/dashboard'
            },
            {
                label: 'Cases',
                routerLink: '/health/user/cases-list'
            },
            {
                label: 'Case Details',
            }
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getUserDetails(){
        this.route.params.subscribe((params) => {
            if(params.id){
                this.caseId=params.id;
                this.healthService.getCaseDetailbyId(this.caseId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
                {
                   
                    this.full_name= res[0].patient.details[0].first_name + ' '+ res[0].patient.details[0].last_name;
                    this.reg_no= res[0].patient.details[0].reg_number;
                    this.aadhar=res[0].patient.details[0].aadhar_card_no;
                    this.contact=res[0].patient.details[0].whatsapp_no;
                    this.age=res[0].patient.details[0].age;
                    this.fetchimage=res[0].patient.details[0].user_image
                })
            }
        })
    }
    private _getCaseDetails(){
        this.route.params.subscribe((params) => {
            if(params.id){
                this.caseId=params.id;
                this.healthService.getCaseDetailbyId(this.caseId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
                {
                    
                    this.caseDate=res[0].case_date;
                    this.caseStatus=res[0].case_status;
                    this.hd_temp=res[0].has_health_data.bt_temperature;
                    this.hd_weight=res[0].has_health_data.wm_weight;
                    this.hd_bgl=res[0].has_health_data.bg_glucose_level;
                    this.hd_pgl=res[0].has_health_data.bg_post_glucose_level;
                    this.hd_oxy=res[0].has_health_data.pom_oxegen_level;
                    this.hd_pompulse=res[0].has_health_data.pom_pulse;
                    this.hd_sysBp=res[0].has_health_data.bp_systolic;
                    this.hd_diasBp=res[0].has_health_data.bp_diastolic;
                    this.hd_map=res[0].has_health_data.bp_ma_pressure;
                    this.hd_bppulse=res[0].has_health_data.bp_pulse;
                    this.hd_steps=res[0].has_health_data.fb_steps;
                    this.hd_heartrate=res[0].has_health_data.fb_heart_rates;
                    this.hd_cal=res[0].has_health_data.fb_calories;

                })
            }
        })
    }
}
