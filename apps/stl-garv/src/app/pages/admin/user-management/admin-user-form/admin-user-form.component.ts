import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JwtTokenDecodeService, UserApiService } from '@stl-garv-frontend/users';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';
import { formatDate, Location } from '@angular/common';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { environment } from '@env/environment';

interface Gender {
    gender_name: string,
    gender_code: string
}

interface BloodGrp {
    bg_name: string,
    bg_code: string
}

interface Occupation {
    occ_name: string,
    occ_code: string
}

interface Referral {
    ref_name: string,
    ref_code: string
}

@Component({
    selector: 'stl-garv-frontend-admin-user-form',
    templateUrl: './admin-user-form.component.html',
    styles: []
})
export class AdminUserFormComponent implements OnInit, OnDestroy {

    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    form: FormGroup;

    isSubmitted = false;
    editmode=false;

    bloodgrp: BloodGrp[];
    selectedBg: BloodGrp;
    panchayat= [];
    states =[];
    gender: Gender[];
    selectedGen: Gender;
    userOccupation: Occupation[];
    selectedOcc: Occupation;
    referredBy: Referral[];
    selectedRef: Referral;
    userId: any;
    token = this.jwtDecode.tokenDecode();
    usrId:number;
    usrDetId: number;
    roleId: number;
    panchayatId: number;
    villageId: number;
    distId: number;
    talukaId: number;
    stateId: number;

    villages =[];
    talukas =[];
    districts =[];

    file: File | null = null;
    imageDisplay: string | ArrayBuffer;
    fetchimage: any;
    isUploaded=false;
    hasChange= false;
    moduleChange=false;

    maxDate = new Date();
    formattedDate = formatDate(this.maxDate, 'yyyy-MM-dd', 'en-US');

    modules: any[];
    selectedModules: any[]=[];

    constructor(
        private formBuilder: FormBuilder, 
        private userService: UserApiService, 
        private route: ActivatedRoute,
        private jwtDecode: JwtTokenDecodeService, 
        private messageService: MessageService,
        private location: Location,
        private breadcrumb: BreadcrumbService
    ) {}

    ngOnInit(): void {
        this._initForm();
        this._genderOptions();
        this._bloodGroupOptions();
        this._occupationOptions();
        this._referrefByOptions();
        this._selectModule();
        this._checkEditMode();
        this._getAllStates();
        this._getAllDistricts();
        this._getAllTalukas();
        this._getPanchayat();
        this._getAllVillages();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'Users Management',
                routerLink: '/admin/metadata/user-management/vle-mgmt'
            },
            {
                label: 'User Form'
            },
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _initForm() {
        this.form = this.formBuilder.group({
            first_name: ['', Validators.required],
            middle_name: [''],
            last_name: [''],
            unique_id: ['', Validators.required],
            whatsapp_no: ['', Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')],
            email: ['', Validators.email],
            date_of_birth: [''],
            age: [{value:'', disabled: true}],
            address: [''],
            aadhar_card_no: [''],
            village_id: [''],
            taluka_id: [''],
            state_id: [''],
            district_id: [''],
            panchayatfield: ['', Validators.required],
            gender: [this.selectedGen],
            blood_grp: [this.selectedBg],
            referral: [this.selectedRef],
            occupation: [this.selectedOcc],
            image: ['']
        })
    }

    private _checkEditMode() {
        this.route.params.subscribe((params)=>{
            if(params.id) {
                this.editmode = true;
                this._autoFillData();
            }

            else if(params.role=='user' && !params.id){
                this.roleId=4;
            }

            else if(params.role=='VLE' && !params.id){
                this.roleId=2;
            }

            else if(params.role=='doctor' && !params.id){
                this.roleId=3;
            }
            if(!params.id){
                this.hasChange=true;
            }
        })
    }

    getAge(date:any){
        const dob = new Date(date);
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms);
        const age = Math.abs(age_dt.getUTCFullYear() - 1970);
        this.createUserForm.age.setValue(age); 
    }

    //auto-fill existing user detail
    private _autoFillData(){
        this.route.params.subscribe((params) => {
            if(params.id) {
                this.userId = params.id;
                this.userService.getUserDetailbyuid(this.userId).pipe(takeUntil(this.endSubs$)).subscribe((userDetail) => {
                    console.log(userDetail);
                    this.createUserForm.first_name.setValue(userDetail[0].details[0].first_name);
                    this.createUserForm.middle_name.setValue(userDetail[0].details[0].middle_name);
                    this.createUserForm.last_name.setValue(userDetail[0].details[0].last_name);
                    this.createUserForm.whatsapp_no.setValue(userDetail[0].details[0].whatsapp_no);
                    this.createUserForm.gender.setValue(userDetail[0].details[0].gender);
                    this.createUserForm.date_of_birth.setValue(userDetail[0].details[0].date_of_birth);
                    this.createUserForm.age.setValue(userDetail[0].details[0].age);
                    this.createUserForm.state_id.setValue(userDetail[0].details[0].state_id);
                    this.createUserForm.district_id.setValue(userDetail[0].details[0].district_id);
                    this.createUserForm.taluka_id.setValue(userDetail[0].details[0].taluka_id);
                    this.createUserForm.village_id.setValue(userDetail[0].details[0].village_id);
                    this.createUserForm.panchayatfield.setValue(userDetail[0].details[0].panchayat_id);
                    this.createUserForm.address.setValue(userDetail[0].details[0].address);
                    this.createUserForm.aadhar_card_no.setValue(userDetail[0].details[0].aadhar_card_no);
                    this.createUserForm.blood_grp.setValue(userDetail[0].details[0].blood_group);
                    this.createUserForm.referral.setValue(userDetail[0].details[0].refer_by);
                    this.createUserForm.occupation.setValue(userDetail[0].details[0].occupation);
                    this.createUserForm.unique_id.setValue(userDetail[0].unique_id);
                    this.createUserForm.email.setValue(userDetail[0].email);
                    this.roleId=userDetail[0].details[0].role_id;
                    this.usrDetId=userDetail[0].details[0].user_detail_id;
                    this.fetchimage=userDetail[0].details[0].user_image;
                    this.detectFormChange();
                })

                this.userService.getModulesbyUser(this.userId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
                {   
                    const mod=res.map(ele=>ele.module_id);
                    this.selectedModules=mod;
                })
            }
        })
    }

    detectFormChange(){
        this.form.valueChanges.subscribe(() => {
            this.hasChange=true;
          });
    }

    onSubmit(){

        this.isSubmitted=true;

        if(this.form.invalid) return;

        if(this.editmode) {
            this._updateUser();
        } else {
            this._createUser();
        }
        
    }

    private _createUser(){

        const user_body = {
            email: this.createUserForm.email.value,
            unique_id: this.createUserForm.unique_id.value,
            password: this.createUserForm.unique_id.value,
            role_id: this.roleId
        }

        this.userService.register(user_body).pipe(takeUntil(this.endSubs$)).subscribe((user)=> {
            this.usrId= user.user.user_id;

            const user_detail_body = {
                user_id: this.usrId,
                first_name: this.createUserForm.first_name.value,
                middle_name: this.createUserForm.middle_name.value,
                last_name: this.createUserForm.last_name.value,
                whatsapp_no: this.createUserForm.whatsapp_no.value,
                aadhar_card_no: this.createUserForm.aadhar_card_no.value,
                gender: this.createUserForm.gender.value,
                date_of_birth: this.createUserForm.date_of_birth.value,
                age: this.createUserForm.age.value,
                state_id: this.createUserForm.state_id.value,
                district_id: this.createUserForm.district_id.value,
                taluka_id: this.createUserForm.taluka_id.value,
                village_id: this.createUserForm.village_id.value,
                panchayat_id: this.createUserForm.panchayatfield.value,
                address: this.createUserForm.address.value,
                blood_group: this.createUserForm.blood_grp.value,
                occupation: this.createUserForm.occupation.value,
                refer_by: this.createUserForm.referral.value,
                role_id: this.roleId
            }
            this.userService.registerintoUserDetail(user_detail_body).pipe(takeUntil(this.endSubs$)).subscribe(
                (res)=> {

                    this.usrDetId=res.user_detail_id;

                    if(this.selectedModules){
                        this._createModule(user.user.user_id)
                    }

                    //Image Upload
                    if(this.isUploaded){
                        this.userService.postImage(this.usrDetId, this.file).pipe(takeUntil(this.endSubs$)).subscribe(
                            ()=>
                            {
                                console.log('success')
                            },
                            () => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Unable to update profile picture!'
                                });
                            })
                    }
                    this.isSubmitted= true;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User created successfully!'
                    });
                    timer(2000)
                    .toPromise()
                    .then(() => {
                        this.location.back();
                    });
                },
                ()=>{
                    if(this.usrId){
                        this.userService.deleteUser(this.usrId).pipe(takeUntil(this.endSubs$)).subscribe();
                    }
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'User could not be created!'
                    });
                },
                )
        },
        () => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Unable to create User!'
            }); 
        }
        );
    }


    private _updateUser(){

        const user_body = {
            email: this.createUserForm.email.value,
            unique_id: this.createUserForm.unique_id.value
        }

        const user_detail_body = {
            first_name: this.createUserForm.first_name.value,
            middle_name: this.createUserForm.middle_name.value,
            last_name: this.createUserForm.last_name.value,
            whatsapp_no: this.createUserForm.whatsapp_no.value,
            aadhar_card_no: this.createUserForm.aadhar_card_no.value,
            gender: this.createUserForm.gender.value,
            date_of_birth: this.createUserForm.date_of_birth.value,
            age: this.createUserForm.age.value,
            state_id: this.createUserForm.state_id.value,
            district_id: this.createUserForm.district_id.value,
            taluka_id: this.createUserForm.taluka_id.value,
            village_id: this.createUserForm.village_id.value,
            panchayat_id: this.createUserForm.panchayatfield.value,
            address: this.createUserForm.address.value,
            blood_group: this.createUserForm.blood_grp.value,
            occupation: this.createUserForm.occupation.value,
            refer_by: this.createUserForm.referral.value,
            role_id: this.roleId,
        }

        this.userService.updateUser(this.userId, user_body).pipe(takeUntil(this.endSubs$)).subscribe(
            () => {
                this.userService.updateUserDetail(this.usrDetId, user_detail_body).pipe(takeUntil(this.endSubs$)).subscribe(
                () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'User details updated successfully!'
                    });
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'User details could not be updated!'
                    });
                }
                );
            },
            () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Unable to update User details!'
                });
            }
        );

        if(this.selectedModules && this.moduleChange){
            this._createModule(this.userId)
        }

         //Image Upload
         if(this.isUploaded){
            this.userService.postImage(this.usrDetId, this.file).pipe(takeUntil(this.endSubs$)).subscribe(
                ()=>
                {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Profile picture updated!'
                    });
                },
                () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Profile picture could not be updated!'
                    });
                })
        }
    }

    private _createModule(id: number){

        const module_Body ={
            modules:this.selectedModules
        }

        this.userService.assignModuleToUser(id, module_Body).pipe(takeUntil(this.endSubs$)).subscribe(
            ()=>
            {
                console.log('success');
            },
            ()=>
            {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Module could not be mapped'
                });
            }
         )
        
    }

    onImageUpload(event) {
        this.isUploaded=true;
        this.file = event.target.files[0];
        if (this.file) {
        this.form.patchValue({ image: this.file });
        this.form.get('image').updateValueAndValidity();
        const fileReader = new FileReader();
        fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
        }
        fileReader.readAsDataURL(this.file);
        }
    }

    private _getAllStates(){
        this.userService.getStates().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.states=res;
        })
    };

    private _getAllDistricts(){
        this.userService.getDistricts().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.districts=res;
            // this.TotalDist=this.districts.length;
        })
    }

    private _getAllTalukas(){
        this.userService.getTalukas().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.talukas=res;
        })
    }

    private _getAllVillages(){
        this.userService.getVillages().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.villages=res;
        })
    }

    private _getPanchayat(){
        this.userService.getPanchayat().pipe(takeUntil(this.endSubs$)).subscribe((p_name)=> {
            this.panchayat=p_name;
            console.log(this.panchayat);
            
        })
    }

    getDistbyStateId(optionValue:number){
        this.stateId=optionValue;
        if(this.stateId){
            this.userService.getDistrictbyStateId(this.stateId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
            {
                this.districts=res[0].has_district;
                console.log(this.districts);
            });
        }
    }

    getTalukabyDistrictId(optionValue:number){
        console.log("hello");
        this.distId=optionValue;
        if(this.distId){
            this.userService.getTalukabyDistrictId(this.distId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
            {
                this.talukas=res[0].has_taluka;  
            });
        }
    }

    getVillagebyTalukaId(optionValue: number){
        this.talukaId=optionValue;
        if(this.talukaId){
            this.userService.getVillagebyTalukaId(this.talukaId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
            {
                console.log(res);
                this.villages=res[0].has_village;  
            });
        }
    }

    getPanchaytbyVillageId(optionValue: number){
        this.villageId=optionValue;
        console.log(this.villageId);
        if(this.villageId){
            this.userService.getPanchayatbyVillageId(this.villageId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
            {
                console.log(res);
                this.panchayat=res[0].has_gp;  
            });
        }
    }

    getAllDataByPanchayt(optionValue: number){
        this.panchayatId=optionValue;
        if(this.panchayatId){
            this.userService.getPanchayatDetailbyId(this.panchayatId).pipe(takeUntil(this.endSubs$)).subscribe((p_name)=> {

                this.createUserForm.state_id.setValue(p_name[0].state_id);
                this.createUserForm.district_id.setValue(p_name[0].district_id);
                this.createUserForm.taluka_id.setValue(p_name[0].taluka_id);
                this.createUserForm.village_id.setValue(p_name[0].village_id);
                
            })
        }
    }

    private _genderOptions(){
        this.gender = [
            {gender_name: 'Male', gender_code: 'male'},
            {gender_name: 'Female', gender_code: 'female'},
            {gender_name: 'Others', gender_code: 'not_disclose'},
        ];
    }

    private _selectModule(){

        this.userService.getAllModules().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.modules=res;
        })
    }

    private _bloodGroupOptions(){
        this.bloodgrp = [
            {bg_name: 'NA', bg_code: 'NA'},
            {bg_name: 'A+', bg_code: 'A+'},
            {bg_name: 'A-', bg_code: 'A-'},
            {bg_name: 'B+', bg_code: 'B+'},
            {bg_name: 'B-', bg_code: 'B-'},
            {bg_name: 'O+', bg_code: 'O+'},
            {bg_name: 'O-', bg_code: 'O-'},
            {bg_name: 'AB+', bg_code: 'AB+'},
            {bg_name: 'AB-', bg_code: 'AB-'}
        ];
    }

    private _occupationOptions(){
        this.userOccupation = [
            {occ_name: 'Bussiness', occ_code: 'business'},
            {occ_name: 'Farmer', occ_code: 'farmer'},
            {occ_name: 'Job', occ_code: 'job'},
            {occ_name: 'Housewife', occ_code: 'housewife'},
            {occ_name: 'Retired', occ_code: 'retired'},
            {occ_name: 'Other', occ_code: 'other'}
        ];
    }

    private _referrefByOptions(){
        this.referredBy = [
            {ref_name: 'Hoarding', ref_code: 'hoarding'},
            {ref_name: 'Relatives', ref_code: 'relatives'},
            {ref_name: 'Friends', ref_code: 'friends'},
            {ref_name: 'Social Media', ref_code: 'social_media'},
            {ref_name: 'Other', ref_code: 'other'}
        ];
    }

    onChange($event: any){
        if($event){
            this.moduleChange=true;
            this.hasChange=true;
        }
    }

    get createUserForm() {
        return this.form.controls;
    }
}