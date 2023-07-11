import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Case, CaseService, Map } from '@stl-garv-frontend/health-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { JwtTokenDecodeService, User, UserApiService } from '@stl-garv-frontend/users';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-doctor-patient-list',
    templateUrl: './doctor-patient-list.component.html',
    styles: []
})
export class DoctorPatientListComponent implements OnInit , OnDestroy {
    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    items: MenuItem[];
    activeItem: MenuItem;

    cases:Case[]=[];
    cases_filtered:Case[]=[];
    patients: User[]=[];
    loading = true;
    panchayatId: number;
    token = this.jwtDecode.tokenDecode();
    usrId:number;


    constructor(

        private caseService: CaseService, 
        private jwtDecode: JwtTokenDecodeService,  
        private breadcrumb: BreadcrumbService) {}

    ngOnInit(): void {
        this._getAllCases();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Health',
                routerLink: '/health/doctor/dashboard'
            },
            {
                label: 'Patient Management',
                routerLink: '/health/doctor/patients-list'
            }
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getAllCases() {
        this.caseService.getCaseList().pipe(takeUntil(this.endSubs$)).subscribe((cases)=>{
            const len = cases.length;
            this.cases=cases;
            this._getCases(cases, len)
        })
    }

    private _getCases(_cases: Case[], TotalCases: number) {

        //console.log(_cases)

        if(this.token){
            this.usrId = this.token.user_id;
        }
        
        for(let _i=0,j=0; _i<TotalCases; _i++)
         {  
            if(_cases[_i].case!=null){
                if(_cases[_i].case.doctor_id==this.usrId){
                    this.cases_filtered[j]=_cases[_i];
                    this.patients[j]=_cases[_i].patient;
                    j++;
                }
            }
            
         }
        
        for(let _i=0; _i<this.patients.length; _i++){
            for(let j=_i+1; j<this.patients.length; j++){
                if(this.patients[_i].user_id==this.patients[j].user_id){
                    for(let k=j; k<this.patients.length-1; k++ ){
                        this.patients[k]=this.patients[k+1];
                    }
                    this.patients.length--;
                    j--;
                }
            }
        }


        this.cases=this.cases_filtered;
        // console.log(this.cases, this.patients)
        this.loading = false;
    }
}
