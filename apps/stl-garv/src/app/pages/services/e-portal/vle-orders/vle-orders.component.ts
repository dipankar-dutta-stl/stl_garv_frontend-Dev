import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Order, PortalApiService } from '@stl-garv-frontend/e-portal-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { JwtTokenDecodeService, UserApiService } from '@stl-garv-frontend/users';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

interface Status {
    name: string,
    code: string
}

@Component({
    selector: 'stl-garv-frontend-vle-orders',
    templateUrl: './vle-orders.component.html',
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
    `]
})
export class VleOrdersComponent implements OnInit, OnDestroy {
    
    endSubs$ : Subject<any> = new Subject();

    status: Status[];
    selectedStatus: any;

    userOrder:Order[]=[];
    loading = true;
    token = this.jwtDecode.tokenDecode();
    usrId:number;
    address: string;
    pincode: any;
    cust_id: number;
    order_id: number;

    isSubmitted= false;
    paymentDialog = false;
    disabled=false;
    
    form: FormGroup;
    maxDate: Date=new Date();

    
    
    constructor(
        private jwtDecode: JwtTokenDecodeService,
        private portalService: PortalApiService,  
        private messageService: MessageService,
        private breadcrumb: BreadcrumbService,
        private formBuilder: FormBuilder,
        private userService: UserApiService,
        public datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this._initForm();
        this.getStatus();
        this._getUserOrders();

        setTimeout(() =>
            this.breadcrumb.setCrumbs([
                {
                    label: 'E-Portal',
                    routerLink: '/eportal'
                },
                {
                label: 'My Orders',
                routerLink: '/eportal/my-orders'
                }
            ])
        );
        
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _initForm(){
        
        this.selectedStatus='pending';
        
        this.form = this.formBuilder.group({

            order_status: [{value:' ', disabled: true}, Validators.required],
            invoice_no: [{value:' ', disabled: true}, Validators.required],
            invoice_service: [{value:' ', disabled: true}, Validators.required],
            amount: [{value:' ', disabled: true}, Validators.required],
            customer_name: ['', Validators.required],
            payment_date: ['', Validators.required]
            
        });
    };

    private _getUserOrders(){
        if(this.token){
            this.usrId = this.token.user_id;
            this.portalService.getUserOrder(this.usrId).pipe(takeUntil(this.endSubs$)).subscribe((myorders)=>{
                this.userOrder = myorders[0].has_orders.filter(element=>element.order_status == this.selectedStatus)
                this.loading = false;
            })
        }
         
    }

    formChange(){
       
        this.portalService.getUserOrder(this.usrId).pipe(takeUntil(this.endSubs$)).subscribe((myorders)=>{
            this.userOrder = myorders[0].has_orders.filter(element=>element.order_status == this.selectedStatus)
            this.loading = false;
        })

        if(this.selectedStatus=='Complete'){
            this.disabled=true;
        }
        else{
            this.disabled=false;
        }
     
    }
    

    confirmPayment(order_id: number){


        this.paymentDialog = true;
        this._initForm();
        this.isSubmitted=false;
        this.order_id= order_id;
        
        this.portalService.getPendingOrderById(order_id).pipe(takeUntil(this.endSubs$)).subscribe((pendingOrd)=>{

            this.createPaymentForm.order_status.setValue(pendingOrd[0].order_status);
            this.createPaymentForm.invoice_no.setValue(pendingOrd[0].invoice_no);
            this.createPaymentForm.invoice_service.setValue(pendingOrd[0].has_prod.product_title);
            this.createPaymentForm.amount.setValue(pendingOrd[0].has_cust_ord.due_amount);
            this.cust_id = pendingOrd[0].customer_id;
            this.address = pendingOrd[0].belongs_to_customer.details[0].address;
            this.pincode = pendingOrd[0].belongs_to_customer.details[0].pincode;

        })

    }

    savePayment(){

        this.isSubmitted = true;

        if(this.form.invalid) return;

        const data={
            invoice_no: this.createPaymentForm.invoice_no.value,
            order_id: this.order_id,
            customer_id: this.cust_id,
            customer_name: this.createPaymentForm.customer_name.value,
            amount: this.createPaymentForm.amount.value,
            address: this.address,
            pincode: this.pincode,
            state: null,
            payment_date: this.createPaymentForm.payment_date.value,
            
        }

        const status={
            order_status: 'Complete'
        }

        this.portalService.addPayment(data).pipe(takeUntil(this.endSubs$)).subscribe(
            ()=>
            {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Payment recorded successfully!'
                });
                this.paymentDialog = false;

                this.portalService.updatePendingOrderById(this.order_id, status).pipe(takeUntil(this.endSubs$)).subscribe(
                    ()=>
                    {
                        this._getUserOrders();
                    }
                )
            },
            () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Payment could not be recorded!'
                }); 
            }
        )
    }

    getStatus(){
        this.status= [
            {name: "Pending", code: "pending"},
            {name: "Complete", code: "Complete"}
        ];
    }

    hideDialog(){
        this.paymentDialog=false;
    }

    get createPaymentForm() {
        return this.form.controls;
    }
}
