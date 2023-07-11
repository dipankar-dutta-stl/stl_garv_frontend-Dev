import { Component, OnDestroy, OnInit } from '@angular/core';
import { Order, PortalApiService } from '@stl-garv-frontend/e-portal-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-completed-orders',
    templateUrl: './completed-orders.component.html',
    styles: []
})
export class CompletedOrdersComponent implements OnInit, OnDestroy {
   
    endSubs$ : Subject<any> = new Subject();

    allOrders:Order[]=[];
    loading = true;

    constructor(
        private portalService: PortalApiService,  
        private breadcrumb: BreadcrumbService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
    ) {}

    ngOnInit(): void {
        this._getAllOrders();

        setTimeout(() =>
            this.breadcrumb.setCrumbs([
                {
                    label: 'Order Management',
                    routerLink: '/admin/metadata/Order-management'
                },
                
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getAllOrders(){

            this.portalService.getAllOrders().pipe(takeUntil(this.endSubs$)).subscribe((orders)=>{
                this.allOrders = orders.filter(element=>element.order_status == 'Complete');
                this.loading = false;
            })    
    }

    deleteOrder(order_id: number){
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this product?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.portalService.deleteOrderById(order_id).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this._getAllOrders(); //get data after deletion
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Order is deleted'
                    })
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Order could not be deleted'
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
