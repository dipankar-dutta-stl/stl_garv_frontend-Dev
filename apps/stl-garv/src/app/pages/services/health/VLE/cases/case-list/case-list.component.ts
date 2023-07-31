import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { Case, CaseService } from '@stl-garv-frontend/health-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { JwtTokenDecodeService, UserApiService } from '@stl-garv-frontend/users';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'stl-garv-case-list',
    templateUrl: './case-list.component.html',
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
        .treated {
            font-weight: 700;
            color: #66BB6A;
            text-transform: uppercase;
        }
    `]
})
export class CaseListComponent implements OnInit , OnDestroy {
    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    items: MenuItem[];
    activeItem: MenuItem;

    cases:Case[]=[];
    cases_filtered:Case[]=[];
    loading = true;
    panchayatId: number;
    token = this.jwtDecode.tokenDecode();
    usrId:number;
    Case_Id: any;
    PatientId: any;
    patient_id: any;
    panchayat_id: any;
    created_date: any;
    updated_date: any;
    case_status: any;
    user_image: any;
    case_id: any;


    constructor(
        private route:ActivatedRoute,
        private caseService: CaseService, 
        private confirmationService: ConfirmationService,
        private jwtDecode: JwtTokenDecodeService,  
        private messageService: MessageService,
        private breadcrumb: BreadcrumbService ) {}

    ngOnInit(): void {
        // this._getPanchayatid();
        this._getVleCases();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Health',
                routerLink: '/health/vle/dashboard'
            },
            {
                label: 'Case Management',
                routerLink: '/health/vle/cases-list'
            }
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private  _getVleCases(){
        this.caseService.getCaseList().pipe(takeUntil(this.endSubs$)).subscribe((res)=>
        {
            this.cases= res;
            this.loading= false;
        })
    }
    
    // private _getVleCaseDetails(){
    //     this.route.params.subscribe((params) => {
    //         if(params.id){
    //             this.case_id=params.id;
    //             console.log(this.case_id)
    //             this.caseService.getCaseDetailbyId(this.case_id).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
    //             {
    //                 console.log(res)
    //                 this.patient_id= res[0].patient_id;
    //                 this.panchayat_id= res[0].panchayat_id;
    //                 this.created_date=res[0].created_date;
    //                 this.updated_date=res[0].updated_date;
    //                 this.case_status=res[0].case_status;
                
    //             })
    //         }
    //     })
    // }
    // private _getPanchayatid(){
    //     if(this.token){
    //         this.usrId = this.token.user_id;
    //     }
    //     this.userService.getUserDetailbyuid(this.usrId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
    //     {
    //         this.panchayatId=res[0].details[0].panchayat_id;
    //         this._getAllUsers(this.panchayatId);
    //     })
    // }

    // private _getAllUsers(pid: number) {
    //     this.caseService.getCaseList().pipe(takeUntil(this.endSubs$)).subscribe((cases)=>{
    //         const len = cases.length;
    //         this.cases=cases;
    //         this._getCases(cases, len, pid)
    //     })
    // }

    // private _getCases(_cases: Case[], TotalCases: number, _pId: number) {
    //     if(this.token){
    //         this.usrId = this.token.user_id;
    //     }
    //     for(let _i=0,j=0; _i<TotalCases; _i++)
    //      {
    //         if(_cases[_i].vle_id==this.usrId){
    //             this.cases_filtered[j]=_cases[_i];
    //             j++;
    //         }
    //      }
    //     this.cases=this.cases_filtered;
    //     this.loading = false;
        
    // }

    deleteCase(csId: number){
        
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this case?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.caseService.deleteCase(csId).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Case is deleted'
                    });
                    timer(2000)
                    .toPromise()
                    .then(() => {
                        window.location.reload();
                    });
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Case could not be deleted'
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

    maskNumber(number: any){
        let mask = ""
        if(number){
          for(let i=0;i<number.length - 4;i++){
            mask += "X"
          }
     
          return mask + number.slice(8,12)
        }
        else{
          return null
        }
      }
}
