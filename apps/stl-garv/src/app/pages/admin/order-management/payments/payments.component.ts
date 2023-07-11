import { Component, OnDestroy, OnInit } from '@angular/core';
import { Payment, PortalApiService } from '@stl-garv-frontend/e-portal-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-payments',
    templateUrl: './payments.component.html',
    styles: []
})
export class PaymentsComponent implements OnInit, OnDestroy {
   
    endSubs$ : Subject<any> = new Subject();

    paymentList:Payment[]=[];
    loading = true;
   
    constructor(
        private portalService: PortalApiService,  
        private breadcrumb: BreadcrumbService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this._getAllPayments();

        setTimeout(() =>
            this.breadcrumb.setCrumbs([
                {
                    label: 'Payments',
                    routerLink: '/admin/metadata/payments'
                }
                
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getAllPayments(){

            this.portalService.getAllPayment().pipe(takeUntil(this.endSubs$)).subscribe((payments)=>{
                this.paymentList = payments
                this.loading = false;
            })
        
         
    }

    deletePayment(payment_id: number){
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this product?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.portalService.deletePaymentById(payment_id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this._getAllPayments(); //get data after deletion
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Payment is deleted'
                    })
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Payment could not be deleted'
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
