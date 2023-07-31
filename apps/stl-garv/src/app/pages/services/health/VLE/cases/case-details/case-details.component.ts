import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { CaseService } from '@stl-garv-frontend/health-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-case-details',
    templateUrl: './case-details.component.html',
    styles: []
})
export class CaseDetailsComponent implements OnInit, OnDestroy {
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
    patient_id: any;
    case_status: any;
    panchayat_id: any;
    created_date: any;
    updated_date: any;
    case_id: any;

    constructor(private route: ActivatedRoute, private healthService: CaseService, private breadcrumb: BreadcrumbService) {}

    ngOnInit(): void {
        this._getCaseDetails();
        //  this._getUserDetails();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Health',
                routerLink: '/health/vle/dashboard'
            },
            {
                label: 'Case Management',
                routerLink: '/health/vle/cases-list'
            },
             {
                 label: 'Case Details',
                 routerLink: 'health/vle/case-details/:id'
             }

            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    // private _getUserDetails(){
    //     this.route.params.subscribe((params) => {
    //         if(params.id){
    //             this.caseId=params.id;
    //             this.healthService.getCaseDetailbyId(this.caseId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
    //             {
    //                 this.full_name= res[0].patient.details[0].first_name + ' '+ res[0].patient.details[0].last_name;
    //                 this.reg_no= res[0].patient.details[0].reg_number;
    //                 this.aadhar=res[0].patient.details[0].aadhar_card_no;
    //                 this.contact=res[0].patient.details[0].whatsapp_no;
    //                 this.age=res[0].patient.details[0].age;
    //                 this.fetchimage=res[0].patient.details[0].user_image
    //             })
    //         }
    //     })
    // }
    private _getCaseDetails(){
        this.route.params.subscribe((params) => {
            if(params.id){
                this.case_id=params.id;
                this.healthService.getCaseDetailbyId(this.case_id).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
                {
                    this.patient_id=res.patient_id;
                    this.panchayat_id=res.panchayat_id;
                    this.created_date=res.created_date;
                    this.updated_date=res.updated_date
                    this.case_status=res.case_status;

                })
            }
        })
    }
 }
