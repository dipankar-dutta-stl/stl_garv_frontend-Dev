import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserApiService } from '../../services/api-services/user-api.service';
import {Location} from '@angular/common';

@Component({
    selector: 'users-reset-password',
    templateUrl: './reset-password.component.html',
    styles: []
})
export class ResetPasswordComponent implements OnInit, OnDestroy{

    endSubs$ : Subject<any> = new Subject();
    resetFormGroup: FormGroup;
    isSubmitted= false;
    displayDialog= false;
    message: string;
    position= "top";
    isError= false;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserApiService,
        private route: Router,
        private _location: Location
    ) {}

    ngOnInit(): void {

        this._initresetForm();
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _initresetForm(){
        this.resetFormGroup = this.formBuilder.group({
            unique_id: ['', Validators.required], 
        });
    }

    onSubmit(){
        this.isSubmitted= true;

        if (this.resetFormGroup.invalid) return;

        const userData = {
            unique_id: this.resetForm.unique_id.value,
        }

        this.userService.resetPassword(userData).pipe(takeUntil(this.endSubs$)).subscribe((res)=> {
           if(res){
              this.displayDialog =true;
              this.isError= false;
              this.message= `Password is reset to "12345", Please LogIn and change your password !`;
            
             if(!this.displayDialog){
                this.route.navigate([`/login`]);
             }
           }            
        },
        (error: HttpErrorResponse)=>{
            this.isError = true;
            if(error.status == 422){
                this.displayDialog =true;
                this.message= "Oops, User Not Found !"
            }
            else if(error.status == 401) {
                this.displayDialog =true;
                this.message= "Sorry, You do not have access to this service.\nPlease contact IT Administrator !";
            }
            else {
                this.displayDialog =true;
                this.message= "Something went wrong !";
            }
        });


    }

    goToLogin(){
        this.displayDialog=false
        this.route.navigate(['/login'])
    }

    backLogin(){
        this.route.navigate(['/login']) 
    }

    get resetForm() {
        return this.resetFormGroup.controls;
    }
}
