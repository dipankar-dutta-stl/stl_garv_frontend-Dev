import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Case, CaseService } from '@stl-garv-frontend/health-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { UserApiService } from '@stl-garv-frontend/users';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-user-details',
    templateUrl: './user-details.component.html',
    styles: []
})
export class UserDetailsComponent implements OnInit , OnDestroy {
    
    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    cars:[];
    isSubmitted = false;
    editmode=false;
    disabled=true;

    aadhar_card_no: any;
    first_name: any;
    last_name: any;
    full_name: any;
    user_image: any;
    address: any;
    whatsapp_no: any;
    unique_id: any;
    date_of_birth: any;
    age: any;
    bloodgrp: any;
    gender: any;
    userOccupation: any;
    user_status: any;
    referredBy: any;
    userId: number;
    usrId:number;
    usrDetId: number;
    roleId: number;
    panchayatId: number;
    selectedModule: string[] = [];
    cases:Case[]=[];
    cases_filtered:Case[]=[];
    loading = true;
    fetchimage: any;

    constructor(
        private route: ActivatedRoute,
        private userService: UserApiService,
        private caseService: CaseService,
        private breadcrumb: BreadcrumbService) {}

    ngOnInit(): void {
        this._getUserDetails();
        this._getAllCases();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Health',
                routerLink: '/health/vle/dashboard'
            },
            {
                label: 'User Management',
                routerLink: '/health/vle/users-list'
            },
            {
                label: 'User Details'
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
                this.usrId=params.id;
                this.userService.getUserDetailbyuid(this.usrId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
                {
                    
                    this.full_name= res[0].details[0].first_name + ' '+ res[0].details[0].last_name;
                    this.address= res[0].details[0].address;
                    this.aadhar_card_no=res[0].details[0].aadhar_card_no;
                    this.unique_id=res[0].unique_id;
                    this.whatsapp_no=res[0].details[0].whatsapp_no;
                    this.date_of_birth=res[0].details[0].date_of_birth;
                    this.age=res[0].details[0].age;
                    this.gender=res[0].details[0].gender;
                    this.userOccupation=res[0].details[0].occupation;
                    this.fetchimage=res[0].details[0].user_image
                })
            }
        })
    }

    private _getAllCases(){
        this.caseService.getCaseList().pipe(takeUntil(this.endSubs$)).subscribe((cases)=>{
            const len = cases.length;
            this.cases=cases;
            this._getCaseDetailsByUserId(cases, len)
        })
    }

    private _getCaseDetailsByUserId(_cases: Case[], TotalCases: number){
            this.route.params.subscribe((params)=>{
            if(params.id){
               this.userId=params.id;

            for(let _i=0,j=0; _i<TotalCases; _i++)
              {
                  if(_cases[_i].patient_id== this.userId){
                      this.cases_filtered[j]=_cases[_i];
                      j++;
                    }
               }
            this.cases=this.cases_filtered;
            this.loading=false;
                }
            })
    }
}