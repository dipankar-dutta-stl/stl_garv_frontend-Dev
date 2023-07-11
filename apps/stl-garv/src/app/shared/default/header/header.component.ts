import { Component, OnDestroy, OnInit } from '@angular/core';
import { JwtTokenDecodeService, LoginAuthService, UserApiService } from '@stl-garv-frontend/users';
import {MenuItem} from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '@env/environment';

@Component({
    selector: 'stl-garv-header',
    templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    items: MenuItem[];

    constructor( private jwtDecode: JwtTokenDecodeService, private authService: LoginAuthService, private userService: UserApiService) {}

    token = this.jwtDecode.tokenDecode();
    role:any;
    f_name:any;
    uid: any;
    user_image: any;
    modules: any=[];
    panchayatId: number;
    i: number;
    healthAssign= false;
    eportalAssign= false;
    

    ngOnInit(): void {
        // this._headerMenu();   
        this._getUserDetails(); 
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }   

    private _navigateToContact() {
        window.location.href="https://www.stlgarv.com/#contactUs";
    }

    private _getUserDetails(){
        
        if(this.token){
            this.role = this.token.role;
            this.uid = this.token.user_id;

            this.userService.getUserDetailbyuid(this.uid).pipe(takeUntil(this.endSubs$)).subscribe(
                (res)=>{
                    console.log(res);
                    this.panchayatId=res[0].details[0].panchayat_id;
                    this.f_name=res[0].details[0].first_name;
                    this.user_image=res[0].details[0].user_image;
             //     this.panchayatId=user[0].details[0].panchayat_id;
                    this._getModules(this.uid, this.panchayatId);
                })
        }
        else{
            this.items = [{
                label: 'Your Account',
                items: [{
                    label: 'Log In',
                    icon: 'pi pi-sign-in',
                    routerLink: '/login'
                    
                },
                {
                    label: 'Register',
                    icon: 'pi pi-user-plus',
                    routerLink: '/register'
                }
                ]},
                {
                    label: 'Need Help?',
                    items: [{
                        label: 'Contact Us',
                        icon: 'pi pi-phone',
                        command: () => {this._navigateToContact()}
                    },
                ]}
            ];
        }
    }

    private _getModules(uid: number, pid: number){
        this.userService.getModulesbyGP(pid).pipe(takeUntil(this.endSubs$)).subscribe(
            (res)=>{
                //console.log(res)
                this.userService.getModulesbyUser(uid).pipe(takeUntil(this.endSubs$)).subscribe(
                    (mod)=>{
                        this._commonModules(res, mod)
                        this._headerMenu();
                    }
                )
            }
        )
    }

    private _commonModules(a1,a2){

        this.modules = a1.filter((el)=>{
            return a2.some((i)=>{
                return i.module_id===el.module_id;
            });
        })
        for(this.i=0; this.i<this.modules.length; this.i++){
              if(this.modules[this.i].module_id == 8){
                this.eportalAssign= true;
            }
     }
    }

    private _headerMenu() {

        if(this.token){
            this.role = this.token.role;
            this.uid = this.token.user_id;

            // this.userService.getUserDetailbyuid(this.uid).pipe(takeUntil(this.endSubs$)).subscribe((user)=>{
            //     this.f_name=user[0].details[0].first_name;
            //     this.user_image=user[0].details[0].user_image;
            //     this.panchayatId=user[0].details[0].panchayat_id;
            //     this._getModules(this.uid, this.panchayatId);
                // console.log(this.eportalAssign);
            if (this.role=='User' || this.role=='Doctor' || this.role=='Admin' ){
                this.items = [{
                    label: 'Hi '+ this.f_name +'!',
                    items: [{
                        label: 'Edit Profile',
                        icon: 'pi pi-user-edit',
                        routerLink: `health/${this.role}/update-profile/${this.uid}`
                        
                    },
                    {
                        label: 'Change Password',
                        icon: 'pi pi-key',
                        routerLink:'/change-password'
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        command: () => {this.authService.logout()}
                    }
                    ]},
                    {
                        label: 'Need Help?',
                        items: [{
                            label: 'Contact Us',
                            icon: 'pi pi-phone',
                            command: () => {this._navigateToContact()}
                        },
                    ]}
                ];
            }
            
            else if (this.role=='VLE' && this.eportalAssign){
                this.items = [{
                    label: 'Hi '+ this.f_name +'!',
                    items: [{
                        label: 'Edit Profile',
                        icon: 'pi pi-user-edit',
                        routerLink: `health/${this.role}/update-profile/${this.uid}`
                        
                    },
                    {
                        label: 'Change Password',
                        icon: 'pi pi-key',
                        routerLink:'/change-password'
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        command: () => {this.authService.logout()}
                    }
                    ]},
                    {
                        label: 'User-Management',
                        items: [{
                            label: 'Create User',
                            icon: 'pi pi-user-plus',
                            routerLink:'health/vle/users-form'
                        },
                    ]},
                    {
                        label: 'E-Portal',
                        items: [{
                            label: 'My Orders',
                            icon: 'pi pi-shopping-cart',
                            routerLink:'eportal/my-orders'
                        },
                    ]},
                    {
                        label: 'Need Help?',
                        items: [{
                            label: 'Contact Us',
                            icon: 'pi pi-phone',
                            command: () => {this._navigateToContact()}
                        },
                    ]}
                ];
            }
            else if(this.role=='VLE' && !this.eportalAssign){
                console.log("hello");
                this.items = [{
                    label: 'Hi '+ this.f_name +'!',
                    items: [{
                        label: 'Edit Profile',
                        icon: 'pi pi-user-edit',
                        routerLink: `health/${this.role}/update-profile/${this.uid}`
                        
                    },
                    {
                        label: 'Change Password',
                        icon: 'pi pi-key',
                        routerLink:'/change-password'
                    },
                    {
                        label: 'User Management',
                        icon: 'pi pi-user-plus',
                        routerLink:'user/vle/users-mgmt'
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-sign-out',
                        command: () => {this.authService.logout()}
                    }
                    ]},
                    
                    {
                        label: 'Need Help?',
                        items: [{
                            label: 'Contact Us',
                            icon: 'pi pi-phone',
                            command: () => {this._navigateToContact()}
                        },
                    ]}
                ];
            }
        // })
        }
        else{
            this.items = [{
                label: 'Your Account',
                items: [{
                    label: 'Log In',
                    icon: 'pi pi-sign-in',
                    routerLink: '/login'
                    
                },
                {
                    label: 'Register',
                    icon: 'pi pi-user-plus',
                    routerLink: '/register'
                }
                ]},
                {
                    label: 'Need Help?',
                    items: [{
                        label: 'Contact Us',
                        icon: 'pi pi-phone',
                        command: () => {this._navigateToContact()}
                    },
                ]}
            ];
        }
    }
}
