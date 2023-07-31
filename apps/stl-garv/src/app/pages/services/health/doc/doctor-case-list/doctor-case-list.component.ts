import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { Case, CaseService, Map } from '@stl-garv-frontend/health-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { JwtTokenDecodeService, UserApiService } from '@stl-garv-frontend/users';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-doctor-case-list',
    templateUrl: './doctor-case-list.component.html',
    styles: [`
        .active {
            font-weight: 700;
            color: #FFA726;
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

export class DoctorCaseListComponent implements OnInit , OnDestroy {
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
    doctor_id: any;
    case_id: any;
    rejected_by_id: any;
    approved_by_id: any;
    updated_date: any;
    created_date: any;
    mapping_status: any;


    constructor(
        private route: ActivatedRoute,
        private caseService: CaseService, 
        private confirmationService: ConfirmationService,
        private jwtDecode: JwtTokenDecodeService,  
        private messageService: MessageService,
        private breadcrumb: BreadcrumbService) {}

    ngOnInit(): void {
        // this._getAllCases();
        this._getCasesForDoctor();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Health',
                routerLink: '/health/doctor/dashboard'
            },
            {
                label: 'Case Management',
                
            }

            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getCasesForDoctor(){
    
           this.caseService.getCasesByDoctorId(this.token.user_id).pipe(takeUntil(this.endSubs$)).subscribe((cases)=>{
console.log(cases)
                            // this.case_id= cases[0].case_id;
                            // this.rejected_by_id= cases[0].rejected_by_id;
                            // this.approved_by_id=cases[0].approved_by_id;
                            // this.created_date=cases[0].created_date;
                            // this.updated_date=cases[0].updated_date;
                            // this.approved_by_id=cases[0].approved_by_id;
                            // this.mapping_status=cases[0].mapping_status;
                            this.cases= cases;
            this.loading= false;
                        
        })
                }
            
        }
    // private _getAllCases() {
    //     this.caseService.getCaseList().pipe(takeUntil(this.endSubs$)).subscribe((cases)=>{
    //         const len = cases.length;
    //         this.cases=cases;
    //         this._getCases(cases, len)
    //     })
    // }

    // private _getCases(_cases: Case[], TotalCases: number) {
    //     if(this.token){
    //         this.usrId = this.token.user_id;
    //     }
    //     for(let _i=0,j=0; _i<TotalCases; _i++)
    //      {  
    //         if(_cases[_i].case!=null){
    //             if(_cases[_i].case.doctor_id==this.usrId){
    //                 this.cases_filtered[j]=_cases[_i];
    //                 j++;
    //             }
    //         }
            
    //      }
    //     this.cases=this.cases_filtered;
    //     //console.log(this.cases)
    //     this.loading = false;
    // }

//     deleteCase(csId: number){
//         // console.log(csId);
//         //confirm deletetion popup-src:prime NG
//         this.confirmationService.confirm({
//             message: 'Do you want to delete this case?',
//             header: 'Delete Confirmation',
//             icon: 'pi pi-exclamation-triangle',
//             accept: () => {
//                 //subscribe to service delete user
//                 this.caseService.deleteCase(csId).pipe(takeUntil(this.endSubs$)).subscribe(() => {
//                     this.messageService.add({
//                         severity: 'success',
//                         summary: 'Success',
//                         detail: 'Case is deleted'
//                     });
//                     timer(2000)
//                     .toPromise()
//                     .then(() => {
//                         window.location.reload();
//                     });
//                 },
//                 () => {
//                     this.messageService.add({
//                         severity: 'error',
//                         summary: 'Error',
//                         detail: 'Case could not be deleted'
//                     });
//                 });
//             },
//             reject: (type) => {
//                 switch(type) {
//                     case ConfirmEventType.REJECT:
//                         this.messageService.add({severity:'error', summary:'Rejected', detail:'You have rejected'});
//                     break;
//                     case ConfirmEventType.CANCEL:
//                         this.messageService.add({severity:'warn', summary:'Cancelled', detail:'You have cancelled'});
//                     break;
//                 }
//             }
//         });
//     }

//     maskNumber(number: any){
//         let mask = ""
//         if(number){
//           for(let i=0;i<number.length - 4;i++){
//             mask += "X"
//           }
     
//           return mask + number.slice(8,12)
//         }
//         else{
//           return null
//         }
//       }
// }
