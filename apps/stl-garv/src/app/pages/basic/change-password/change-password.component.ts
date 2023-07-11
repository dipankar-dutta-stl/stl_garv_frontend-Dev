import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmedValidator, JwtTokenDecodeService, LoginAuthService, UserApiService } from '@stl-garv-frontend/users';
import { Location } from '@angular/common';
import { Subject, takeUntil, timer } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
    selector: 'stl-garv-frontend-change-password',
    templateUrl: './change-password.component.html',
    styles: []
})
export class ChangePasswordComponent implements OnInit , OnDestroy {

    endSubs$ : Subject<any> = new Subject();
    cpFormGroup: FormGroup;
    isSubmitted=false;
    authError=false;
    authErrorMessage: string;
    token=this.jwtDecode.tokenDecode();
    usrId: number;
    
    constructor(
        private formBuilder: FormBuilder, 
        private location: Location, 
        private jwtDecode: JwtTokenDecodeService, 
        private userService: UserApiService,
        private loginService: LoginAuthService,
        private messageService: MessageService) {}

    ngOnInit(): void {
        this._initCPForm();
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _initCPForm(){
        this.cpFormGroup = this.formBuilder.group({
            curr_password: ['', Validators.required],
            new_password: ['', Validators.required],
            confirm_password: ['', Validators.required] 
        },
        { 
            validator: ConfirmedValidator('new_password', 'confirm_password')
        });
    }

    onSubmit(){

        this.isSubmitted=true;

        if(this.cpFormGroup.invalid) return;

        
        const body ={
            curr_password: this.cpForm.curr_password.value,
            new_password: this.cpForm.confirm_password.value
        }

        if(this.token){
            this.usrId=this.token.user_id;

            this.userService.updateUserPassword(this.usrId, body).pipe(takeUntil(this.endSubs$)).subscribe(
                (res= HttpResponse)=>{
                    if(res.Response=='Updated Successfully'){
                        this.authError=false;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Password updated successfully!'
                        });
                        timer(2000)
                        .toPromise()
                        .then(() => {
                            this.loginService.logout();
                        });
                    }
                    else if(res.Response=='The current password does not match'){
                        this.authError=true;
                        this.authErrorMessage=res.Response+'!';
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Password could not be updated!'
                        });
                    }
                    else if(res.Response=='New password should not be same as current password'){
                        this.authError=true;
                        this.authErrorMessage=res.Response+'!';
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Unable to update password!'
                        });
                    }
                
            })
        }

        
    }

    onCancel(){
        this.location.back();
    }

    get cpForm() {
        return this.cpFormGroup.controls;
    }
}
