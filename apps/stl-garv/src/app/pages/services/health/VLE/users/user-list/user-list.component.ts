import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { JwtTokenDecodeService, UserApiService, UserDetail } from '@stl-garv-frontend/users';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-user-list',
    templateUrl: './user-list.component.html',
    styles: []
})
export class UserListComponent implements OnInit, OnDestroy {
    
    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    items: MenuItem[];
    activeItem: MenuItem;

    users:UserDetail[]=[];
    users_filtered:UserDetail[]=[];
    loading = true;
    panchayatId: number;
    token = this.jwtDecode.tokenDecode();
    usrId:number;


    constructor(
        private userService: UserApiService, 
        private confirmationService: ConfirmationService,
        private jwtDecode: JwtTokenDecodeService,  
        private messageService: MessageService,
        private location: Location,
        private breadcrumb: BreadcrumbService) {}

    ngOnInit(): void {
        this._getPanchayatid();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Health',
                routerLink: '/health/vle/dashboard'
            },
            {
                label: 'User Management',
                routerLink: '/health/vle/users-list'
            }

            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getPanchayatid(){
        if(this.token){
            this.usrId = this.token.user_id;
        }
        this.userService.getUserDetailbyuid(this.usrId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
        {
            this.panchayatId=res[0].details[0].panchayat_id;
            this._getAllUsers(this.panchayatId);
        })
    }

    private _getAllUsers(pid: number) {
        this.userService.getUserList().pipe(takeUntil(this.endSubs$)).subscribe((usrs)=>{
            const len = usrs.length;
            this.users=usrs;
            this._getUsers(usrs, len, pid)
        })
    }

    private _getUsers(users: UserDetail[], TotalUsers: number, pId: number) {
        for(let _i=0,j=0; _i<TotalUsers; _i++)
         {
            if(users[_i].role_id==4 && users[_i].panchayat_id==pId || users[_i].panchayat_id== 4 || users[_i].panchayat_id== 438){
                this.users_filtered[j]=users[_i];
                j++;
            }
         }
        this.users=this.users_filtered;
        this.loading = false;
        //console.log(this.users)
        
    }

    deleteUser(userId: number){
        //console.log(userId);
        //confirm deletetion popup-src:prime NG
        this.confirmationService.confirm({
            message: 'Do you want to delete this user?',
            header: 'Delete Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                //subscribe to service delete user
                this.userService.deleteUser(userId).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User is deleted'
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
                        detail: 'User could not be deleted'
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
