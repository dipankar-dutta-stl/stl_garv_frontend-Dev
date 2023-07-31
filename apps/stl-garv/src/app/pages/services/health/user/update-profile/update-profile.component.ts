import { formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { JwtTokenDecodeService, UserApiService } from '@stl-garv-frontend/users';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

interface Gender {
    gender_name: string,
    gender_code: string
}

@Component({
    selector: 'stl-garv-frontend-update-profile',
    templateUrl: './update-profile.component.html',
    styles: []
})
export class UpdateProfileComponent implements OnInit,OnDestroy {

    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    form: FormGroup;
    isSubmitted = false;
    panchayat= [];
    states =[];
    gender: Gender[];
    selectedGen: Gender;
    userId: string;
    token = this.jwtDecode.tokenDecode();
    usrId:number;
    usrDetId: number;
    roleId: number;
    panchayatId: number;
    villageId: number;
    distId: number;
    talukaId: number;
    stateId: number;

    USER_DETAILS:any;

    villages =[];
    talukas =[];
    districts =[];

    file: File | null = null;
    imageDisplay: string | ArrayBuffer;
    fetchimage: any;
    isUploaded=false;
    hasChange= false;

    maxDate = new Date();
    formattedDate = formatDate(this.maxDate, 'yyyy-MM-dd', 'en-US');

    constructor(
        private formBuilder: FormBuilder, 
        private userService: UserApiService, 
        private route: ActivatedRoute,
        private jwtDecode: JwtTokenDecodeService, 
        private messageService: MessageService,
        private breadcrumb: BreadcrumbService) {}

    ngOnInit(): void {
        this._initForm();
        this._genderOptions();
        this._autoFillData();
        this._getAllStates();
        this._getAllDistricts();
        this._getAllTalukas();
        this._getPanchayat();
        this._getAllVillages();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'Edit Profile'
            }
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
            gender: [this.selectedGen],
            village_id: [''],
            taluka_id: [''],
            state_id: [''],
            district_id: [''],
            panchayatfield: [{value:'', disabled: true}, Validators.required],
            address: [''],
            image: ['']
        })
    }

    //auto-fill existing user detail
    private _autoFillData(){
        this.route.params.subscribe((params) => {
            if(params.id) {
                this.userId = params.id;
                this.userService.getUserDetailbyuid(this.userId).pipe(takeUntil(this.endSubs$)).subscribe((userDetail) => {
                    this.USER_DETAILS=userDetail;
                    this.updateProfileForm.first_name.setValue(userDetail.first_NAME);
                    this.updateProfileForm.middle_name.setValue(userDetail.middle_NAME);
                    this.updateProfileForm.last_name.setValue(userDetail.last_NAME);
                    this.updateProfileForm.whatsapp_no.setValue(userDetail.whatsapp_NO);
                    this.updateProfileForm.gender.setValue(userDetail.gender);
                    this.updateProfileForm.date_of_birth.setValue(userDetail.date_OF_BIRTH);
                    this.updateProfileForm.age.setValue(userDetail.age);
                    this.updateProfileForm.state_id.setValue(userDetail.state_ID);
                    this.updateProfileForm.district_id.setValue(userDetail.district_ID);
                    this.updateProfileForm.taluka_id.setValue(userDetail.taluka_ID);
                    this.updateProfileForm.village_id.setValue(userDetail.village_ID);
                    this.updateProfileForm.panchayatfield.setValue(userDetail.panchayat_ID);
                    this.updateProfileForm.address.setValue(userDetail.address);
                    this.updateProfileForm.unique_id.setValue(userDetail.unique_ID);
                    this.updateProfileForm.email.setValue(userDetail.email);
                    this.roleId=userDetail.role_ID;
                    this.fetchimage=userDetail.user_IMAGE;
                    this.detectFormChange();
                })
            }
        })
    }

    detectFormChange(){
        this.form.valueChanges.subscribe(() => {
            this.hasChange=true;
          });
    }

    getAge(date:any){
        const dob = new Date(date);
        const diff_ms = Date.now() - dob.getTime();
        const age_dt = new Date(diff_ms);
        const age = Math.abs(age_dt.getUTCFullYear() - 1970);
        this.updateProfileForm.age.setValue(age); 
    }

    onUpdate(){
        this.isSubmitted=true;

        if(this.token){
            this.usrId = this.token.user_id;
            this.usrDetId = this.token.user_detail_id;
        }
        
        if(this.form.invalid) return;

        const user_body = {
            email: this.updateProfileForm.email.value,
            unique_id: this.updateProfileForm.unique_id.value
        }

        const user_detail_body = {
            user_DETAILS_ID:this.USER_DETAILS.user_DETAILS_ID,
            user_ID:this.USER_DETAILS.user_ID,
            reg_NUMBER:this.USER_DETAILS.reg_NUMBER,
            user_STATUS:this.USER_DETAILS.user_STATUS,
            created_DATE:this.USER_DETAILS.created_DATE,
            first_NAME: this.updateProfileForm.first_name.value,
            middle_NAME: this.updateProfileForm.middle_name.value,
            last_NAME: this.updateProfileForm.last_name.value,
            whatsapp_NO: this.updateProfileForm.whatsapp_no.value,
            gender: this.updateProfileForm.gender.value,
            date_OF_BIRTH: this.updateProfileForm.date_of_birth.value,
            age: this.updateProfileForm.age.value,
            address: this.updateProfileForm.address.value,
            state_ID: this.updateProfileForm.state_id.value,
            district_ID: this.updateProfileForm.district_id.value,
            taluka_ID: this.updateProfileForm.taluka_id.value,
            village_ID: this.updateProfileForm.village_id.value,
            panchayat_ID: this.updateProfileForm.panchayatfield.value,
            role_ID: this.roleId
        }
       //Update User Detail Table
       this.userService.updateUserDetail(this.usrDetId, user_detail_body).pipe(takeUntil(this.endSubs$)).subscribe(
        () => {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Profile updated successfully!'
            });
        },
        () => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Profile could not be updated!'
            });
        }
        );

        //Image Upload
        // if(this.isUploaded){
        //     this.userService.postImage(this.usrDetId, this.file).pipe(takeUntil(this.endSubs$)).subscribe(
        //         ()=>
        //         {
        //             this.messageService.add({
        //                 severity: 'success',
        //                 summary: 'Success',
        //                 detail: 'Profile picture updated!'
        //             });
        //         },
        //         () => {
        //             this.messageService.add({
        //                 severity: 'error',
        //                 summary: 'Error',
        //                 detail: 'Profile picture could not be updated!'
        //             });
        //         })
        // }

        console.log(this.USER_DETAILS);
        console.log(user_detail_body);
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

                this.updateProfileForm.state_id.setValue(p_name[0].state_id);
                this.updateProfileForm.district_id.setValue(p_name[0].district_id);
                this.updateProfileForm.taluka_id.setValue(p_name[0].taluka_id);
                this.updateProfileForm.village_id.setValue(p_name[0].village_id);
                
            })
        }
    }

    private _genderOptions(){
        this.gender = [
            {gender_name: 'Male', gender_code: 'male'},
            {gender_name: 'Female', gender_code: 'female'},
            {gender_name: 'Others', gender_code: 'others'},
        ];
    }

    get updateProfileForm() {
        return this.form.controls;
    }
}
