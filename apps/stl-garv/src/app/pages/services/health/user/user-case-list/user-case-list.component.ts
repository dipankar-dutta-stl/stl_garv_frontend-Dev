import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Case, CaseService } from '@stl-garv-frontend/health-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { JwtTokenDecodeService, UserApiService } from '@stl-garv-frontend/users';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-user-case-list',
    templateUrl: './user-case-list.component.html',
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
export class UserCaseListComponent implements OnInit , OnDestroy {
    
    endSubs$ : Subject<any> = new Subject();
    items: MenuItem[];
    activeItem: MenuItem;

    cases:Case[]=[];
    cases_filtered:Case[]=[];
    loading = true;
    panchayatId: number;
    token = this.jwtDecode.tokenDecode();
    usrId:number;


    constructor(
        private userService: UserApiService,
        private caseService: CaseService, 
        private confirmationService: ConfirmationService,
        private jwtDecode: JwtTokenDecodeService,  
        private messageService: MessageService,
        private location: Location,
        private breadcrumb: BreadcrumbService) {}

    ngOnInit(): void {
        // this._getAllCases();
        this._getUserCases();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Health',
                routerLink: '/health/user/dashboard'
            },
            {
                label: 'Cases'
            }
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    // private _getAllCases() {
    //     this.caseService.getCaseList().pipe(takeUntil(this.endSubs$)).subscribe((cases)=>{
    //         const len = cases.length;
    //         this.cases=cases;
    //         this._getCases(cases, len)
    //     })
    // }

    private _getUserCases(){
        if(this.token){
            this.usrId = this.token.user_id;
        }

        this.caseService.getCaseByUserId(this.usrId).pipe(takeUntil(this.endSubs$)).subscribe((cases)=>{
            this.cases=cases;
            console.log(cases);
            this.loading=false;
        })
    }

    // private _getCases(_cases: Case[], TotalCases: number) {
    //     if(this.token){
    //         this.usrId = this.token.user_id;
    //     }
    //     for(let _i=0,j=0; _i<TotalCases; _i++)
    //      {
    //         if(_cases[_i].patient_id==this.usrId){
    //             this.cases_filtered[j]=_cases[_i];
    //             j++;
    //         }
    //      }
    //     this.cases=this.cases_filtered;
    //     //console.log(this.cases)
    //     this.loading = false;
    // }

    deleteCase(csId: number){
        // console.log(csId);
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
}
