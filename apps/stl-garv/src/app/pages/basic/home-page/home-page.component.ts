import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtTokenDecodeService, StorageService, UserApiService } from '@stl-garv-frontend/users';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '@env/environment';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'stl-garv-home-page',
    templateUrl: './home-page.component.html'
})
export class HomePageComponent implements OnInit, OnDestroy {

    constructor(
        private jwtDecode: JwtTokenDecodeService,
        private userService: UserApiService,
        private router: Router,
        private storageService: StorageService,
        private formBuilder: FormBuilder
    ) { }

    cloudFrontURL = environment.cloudFrontURL;
    endSubs$: Subject<any> = new Subject();
    registerFormGroup: FormGroup;
    token = this.jwtDecode.tokenDecode();

    userId: number;
    panchayatId: number;
    modules: any = [];
    states: any[];
    stateId = 2;   // defualt state is goa on guest page
    pId = 438; // default panchayt for goa - guest page
    isGuest = false;

    ngOnInit(): void {
        this._initRegisterForm();
        this._getUserDetails();
        this._getAllStates();
        this._loadModules();
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _initRegisterForm() {
        this.registerFormGroup = this.formBuilder.group({
            state_id: this.stateId
        });
    }

    // for POC only state dropdown 
    private _getAllStates() {
        this.userService.getStates().pipe(takeUntil(this.endSubs$)).subscribe((res) => {
            this.states = res;
            console.log(this.states);
        })
    }

    // for POC only state dropdown 
    stateSelect(state_id: number) {
        console.log(state_id);
        // condition for maharashtra state
        if (state_id == 1) {
            this.pId = 4;
        }
        // condition for goa state 
        else if (state_id == 2) {
            this.pId = 438;
        }
        // this._allModules(this.pId);
        // this.userService.getModulesbyGP(this.pId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
        this.userService.getAllModules().pipe(takeUntil(this.endSubs$)).subscribe((res) => {
            console.log(res);
            this.modules = res;
        });
    }

    private _getUserDetails() {

        if (this.token) {
            this.userId = this.token.user_id;

            this.userService.getUserDetailbyuid(this.userId).pipe(takeUntil(this.endSubs$)).subscribe(
                (res) => {
                    this.panchayatId = res.panchayat_ID;
                    this._getModules(this.userId, this.panchayatId);
                })
        }
        else {
            if (this.storageService.getRolefromSes() == 'guest') {
                this.isGuest = true;
                this.stateSelect(this.stateId);
            }
        }
    }

    // private _allModules(pId: number){

    // }

    private _getModules(uid: number, pid: number) {
        this.userService.getModulesbyGP(pid).pipe(takeUntil(this.endSubs$)).subscribe(
            (res) => {
                console.log(res)
                this.userService.getModulesbyUser(uid).pipe(takeUntil(this.endSubs$)).subscribe(
                    (mod) => {
                        this._commonModules(res, mod)
                    }
                )
            }
        )
    }

    private _commonModules(a1, a2) {

        this.modules = a1.filter((el) => {
            return a2.some((i) => {
                return i.module_id === el.module_id;
            });
        })
    }

    navigateByUrl(id: number, url: string, isRedirect: number) {

        const moduleData = {
            module_id: id
        }
        if (this.token) {
            switch (url) {

                case '/health':
                    this._healthNav();
                    break;

                case '/egovernance':
                    this._egovNav();
                    break;

                case '/entertainment':
                    this.router.navigate(['entertainment']);
                    break;

                case '/eportal':
                    this.router.navigate(['eportal']);
                    break;

                default:
                    this.router.navigate(['']);
                    break;

            }
            this.userService.updateModuleCount(moduleData).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                // console.log("success");
                this.userService.updateKioskCount(moduleData).pipe(takeUntil(this.endSubs$)).subscribe(() => {
                    console.log("success");
                    if (isRedirect == 1) {
                        window.location.href = url
                        // window.open(url, '_blank');
                    }

                    else {

                        switch (url) {

                            case '/health':
                                this._healthNav();
                                break;

                            case '/egovernance':
                                this._egovNav();
                                break;

                            case '/entertainment':
                                this.router.navigate(['entertainment']);
                                break;

                            case '/eportal':
                                this.router.navigate(['eportal']);
                                break;

                            default:
                                this.router.navigate(['']);
                                break;

                        }
                    }

                })
            })
        }
        else {
            if (isRedirect == 1 && !this.token) {
                // window.location.href=url
                console.log("hello");
                this.router.navigate(['login']);

            }

            else {
                switch (url) {

                    case '/health':
                        this._healthNav();
                        break;

                    case '/egovernance':
                        this._egovNav();
                        break;

                    case '/entertainment':
                        this.router.navigate(['entertainment']);
                        break;

                    case '/eportal':
                        this.router.navigate(['eportal']);
                        break;

                    default:
                        this.router.navigate(['']);
                        break;

                }
            }
        }

    }

    private _healthNav() {

        if (this.token) {

            if (this.token.role_id == 2) {
                this.router.navigate(['health/vle/dashboard'])
            }

            else if (this.token.role_id == 3) {
                this.router.navigate(['health/doctor/dashboard'])
            }

            else if (this.token.role_id == 4) {
                this.router.navigate(['health/user/dashboard'])
            }

        }
        else {
            this.router.navigate(['health/user/dashboard'])
        }
    }

    private _egovNav() {

        if (this.token && this.token.role_id == 2) {
            this.router.navigate(['egovernance'])
        }

        else if (this.token && this.token.role_id != 2) {
            window.location.href = 'https://digitalseva.csc.gov.in/'
            // window.open('https://digitalseva.csc.gov.in/', '_blank');
        }
        else {
            this.router.navigate(['login'])
        }


    }

    get registerForm() {
        return this.registerFormGroup.controls;
    }

    _loadModules() {
        this.userService.getAllModules().pipe(takeUntil(this.endSubs$)).subscribe((res) => {
            console.log(res);
            this.modules = res;
        });
    }

}
