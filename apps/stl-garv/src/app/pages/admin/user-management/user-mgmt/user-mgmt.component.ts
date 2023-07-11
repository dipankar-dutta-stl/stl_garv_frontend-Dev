import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { UserApiService, UserDetail } from '@stl-garv-frontend/users';
import { ConfirmationService, ConfirmEventType, MenuItem, MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-user-mgmt',
    templateUrl: './user-mgmt.component.html',
    styles: []
})
export class UserMgmtComponent implements OnInit, OnDestroy {
    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    items: MenuItem[];
    activeItem: MenuItem;

    users:UserDetail[]=[];
    users_filtered:UserDetail[]=[];
    loading = true;


    constructor(
        private userService: UserApiService, 
        private confirmationService: ConfirmationService, 
        private messageService: MessageService,
        private location: Location,
        private breadcrumb: BreadcrumbService) {}

    ngOnInit(): void {
        this._tabMenu();
        this._getAllUsers();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'Users Management',
                routerLink: '/admin/metadata/user-management/vle-mgmt'
            },
            {
                label: 'User Management'
            },
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getAllUsers() {
        this.userService.getUserList().pipe(takeUntil(this.endSubs$)).subscribe((usrs)=>{
            const len = usrs.length;
            this.users=usrs;
            this._getUsers(usrs, len)
            
        })
    }

    private _getUsers(users: UserDetail[], TotalUsers: number) {
        for(let _i=0,j=0; _i<TotalUsers; _i++)
         {
            if(users[_i].role_id==4){
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
                    this._getAllUsers(); //get users after deletion
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

    private _tabMenu() {
        this.items = [
            {label: 'VLE Management',routerLink: '/admin/metadata/user-management/vle-mgmt'},
            {label: 'Doctor Management',routerLink: '/admin/metadata/user-management/doctor-mgmt'},
            {label: 'User Management',routerLink: '/admin/metadata/user-management/user-mgmt'},
        ]
    }


}
