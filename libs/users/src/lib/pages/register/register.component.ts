import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';
import { ConfirmedValidator } from '../../confirm_password.validator';
import { UserApiService } from '../../services/api-services/user-api.service';

interface Language {
    name: string,
    code: string
}

@Component({
    selector: 'users-register',
    templateUrl: './register.component.html',
    styles: []
})
export class RegisterComponent implements OnInit, OnDestroy {

    endSubs$: Subject<any> = new Subject();
    registerFormGroup: FormGroup;
    languages: Language[];
    states: any[];
    panchayatId = 438;  // default panchayat if state not selected is - GOA
    stateId: number;
    termsAgreed = false;
    isSubmitted = false;
    passwordMismatch = false;
    u_id: number;
    authError: boolean;
    authErrorMessage: string;

    constructor(private router: Router, private formBuilder: FormBuilder, private userservice: UserApiService, private messageService: MessageService) { }

    ngOnInit(): void {
        this._initRegisterForm();
        // this._languageControl();
        this._getAllStates();
    };

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    };

    private _initRegisterForm() {
        this.registerFormGroup = this.formBuilder.group({
            unique_id: ['', Validators.required],
            password: ['', Validators.required],
            confirm_password: ['', Validators.required],
            state_ID: this.stateId,
            terms: ['', Validators.required]
        },
            {
                validator: ConfirmedValidator('password', 'confirm_password')
            });
    }

    // for POC only state dropdown 
    private _getAllStates() {
        this.userservice.getStates().pipe(takeUntil(this.endSubs$)).subscribe((res) => {
            this.states = res;
            console.log(this.states);
        })
    }

    // for POC only state dropdown 
    stateselect(state_id: number) {
        console.log(state_id);
        // condition for maharashtra state
        if (state_id == 1) {
            this.panchayatId = 4;
        }
        // condition for goa state 
        else if (state_id == 2) {
            this.panchayatId = 438;
        }
    }

    onSubmit() {
        this.isSubmitted = true;

        if (this.registerFormGroup.invalid) { return; }

        const registerData = {
            unique_ID: this.registerForm.unique_id.value,
            password: this.registerForm.password.value,
            user_STATUS:"active"
        }
        //User registration
        this.userservice.register(registerData).pipe(takeUntil(this.endSubs$)).subscribe(
            (user) => {

                this.u_id = user;
                this._initUserDetail();
            },
            (error: HttpErrorResponse) => {
                if (error) {
                    // this.authError = true;
                    // this.authErrorMessage = error.error.message;
                    // this.messageService.add({
                    //     severity: 'error',
                    //     summary: 'Error',
                    //     detail: 'Registration Failed!'
                    // });
                }
            }
        );
    }

    //Send user details to user detail table for sucessful login
    private _initUserDetail() {
        const body = {
            user_ID: this.u_id,
            role_ID: 4,
            panchayat_ID: this.panchayatId,
            first_NAME:'0',
            state_ID:this.stateId,
            user_STATUS:"active"
        }
        console.log(body)
        this.userservice.registerintoUserDetail(body).pipe(takeUntil(this.endSubs$)).subscribe(
            () => {
                // this._assignModules();
            },
            (error: HttpErrorResponse) => {

                if (error) {
                    this.authError = true;
                    this.authErrorMessage = error.error.message;
                    if (this.u_id) {
                        // this.userservice.deleteUser(this.u_id).pipe(takeUntil(this.endSubs$)).subscribe();
                    }
                    // this.messageService.add({
                    //     severity: 'error',
                    //     summary: 'Error',
                    //     detail: 'Registration Failed!'
                    // });
                }
            }
        );
    }

    private _assignModules() {
        const modules = {
            modules: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
        }
        this.userservice.assignModuleToUser(this.u_id, modules).pipe(takeUntil(this.endSubs$)).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Registration successful!'
                });
                timer(2000)
                    .toPromise()
                    .then(() => {
                        this.router.navigate(['/login']);
                    });
            },
            (error: HttpErrorResponse) => {

                if (error) {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Module mapping failed! Please contact your VLE.'
                    });
                }
            }
        )
    }

    // private _languageControl(){
    //     this.languages = [
    //         {name: 'Marathi', code: 'MR'},
    //         {name: 'Hindi', code: 'HN'},
    //         {name: 'English', code: 'EN'},
    //     ];
    // }

    get registerForm() {
        return this.registerFormGroup.controls;
    }
}
