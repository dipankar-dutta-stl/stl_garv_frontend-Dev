import { Inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { LoginAuthService } from '../../services/api-services/login-auth.service';
import { JwtTokenDecodeService } from '../../services/jwt-token-decode.service';
import { StorageService } from '../../services/storage.service';
import { ENVIRONMENT, Environment } from '@stl-garv-frontend/environment';

interface Language {
    name: string,
    code: string
}

@Component({
    selector: 'users-login',
    templateUrl: './login.component.html',
    styles: []
})

export class LoginComponent implements OnInit, OnDestroy {
    
    cloudFrontURL=this.env.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    loginFormGroup: FormGroup;
    isSubmitted= false;
    authError= false;
    authErrorMessage: string;
    token: any;
    tokenDecoded: any;
    languages: Language[];
    selectedLang: Language;

    constructor(
        private formBuilder: FormBuilder, 
        private storageService: StorageService,
        private router: Router,
        private auth: LoginAuthService,
        private jwtDecode: JwtTokenDecodeService,
        @Inject(ENVIRONMENT) private env: Environment
        ) {}

    

    ngOnInit(): void {
        this._initLoginForm();
        this._languageControl();
        this.storageService.removeItemfromSes()
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _initLoginForm(){
        this.loginFormGroup = this.formBuilder.group({
            unique_id: ['', Validators.required],
            password: ['', Validators.required],
            selectedlanguage: this.selectedLang, 
        });
    }

    onSubmit(){

        this.isSubmitted = true;

        if (this.loginFormGroup.invalid) return;

        const loginData = {
            unique_id: this.loginForm.unique_id.value,
            password: this.loginForm.password.value
        }

        this.auth.login(loginData.unique_id, loginData.password).subscribe((user)=> {

            console.log(user);
            this.authError=false;
            this.token=user;
            this._storageService(this.token);
            this.tokenDecoded=this.jwtDecode.tokenDecode();
            console.log(this.tokenDecoded);
            this.navigateHome(this.tokenDecoded);
            
        }
        // (error: HttpErrorResponse)=>{
        //     this.authError=true;
        //     if(error.status == 401){
        //         this.authErrorMessage="Invalid Credentials!"
        //     }
        //     else if(error.status == 500) {
        //         this.authErrorMessage="Server Error!"
        //     }
        //     else {
        //         this.authErrorMessage="Something went wrong!"
        //     }
        // }
        );        
    }

    guestLogin(){
        this._storageService('guest');
    }

    _storageService(data: any){
        this.storageService.setItem(data);
    }

    navigateHome(tokendata: any) {
        console.log("Navigate Home");
        this.router.navigate(['/'])
        // const role= tokendata.role;
        
        // if(role=='VLE' || role=='User' || role=='Doctor' ) {this.router.navigate(['/']) };
        // if(role=='Admin') {this.router.navigate(['/admin/metadata'])}
    }

    private _languageControl(){
        this.languages = [
            {name: 'Marathi', code: 'MR'},
            {name: 'Hindi', code: 'HN'},
            {name: 'English', code: 'EN'},
        ];
    }

    get loginForm() {
        return this.loginFormGroup.controls;
    }
}
