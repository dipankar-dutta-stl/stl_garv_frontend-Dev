import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JwtTokenDecodeService, UserApiService, UserDetail } from '@stl-garv-frontend/users';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';
import { formatDate, Location } from '@angular/common';
import { Case, CaseService } from '@stl-garv-frontend/health-api';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { environment } from '@env/environment';



@Component({
    selector: 'stl-garv-frontend-case-form',
    templateUrl: './case-form.component.html',
    styles: []
})
export class CaseFormComponent implements OnInit, OnDestroy {

    cloudFrontURL= environment.cloudFrontURL;
    endSubs$ : Subject<any> = new Subject();
    caseForm: FormGroup;

    uploadedFiles: any[] = [];
    users: UserDetail[]=[];
    doctors: UserDetail[]=[];
    case: Case

    isSubmitted = false;
    editmode=false;
    isUploaded=false;
    isHealthData=false;
    isDoctorMap=false;
    isCaseData=false;
    isPrescription=false;
    hasPresc=false;
    hasChange= false;

    token = this.jwtDecode.tokenDecode();
    vleId: number;
    panchayatId: number;
    caseId: number;
    docMapId: number;
    healthDataId: number;
    prescriptionId: number;

    imageDisplay: string | ArrayBuffer;
    file: File | null = null;

    currDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');


    constructor(
        private formBuilder: FormBuilder, 
        private userService: UserApiService,
        private healthService: CaseService, 
        private route: ActivatedRoute,
        private jwtDecode: JwtTokenDecodeService, 
        private messageService: MessageService,
        private location: Location,
        private breadcrumb: BreadcrumbService
        ) {}

    ngOnInit(): void {
        this._initForm();
        this._getUsersofPanchayat();
        this._checkEditMode();
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Health',
                routerLink: '/health/vle/dashboard'
            },
            {
                label: 'Case Management',
                routerLink: '/health/vle/cases-list'
            },
            {
                label: 'Case Form'
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
        this.caseForm = this.formBuilder.group({
            user: ['', Validators.required],
            doctor: [''],
            bt_temperature: [''],
            pom_oxegen_level: [''],
            bg_glucose_level: [''],
            wm_weight: [''],
            pom_pulse: [''],
            bg_post_glucose_level: [''],
            bp_systolic: [''],
            fb_heart_rates: [''],
            fb_calories: [''],
            bp_diastolic: [''],
            fb_steps: [''],
            bp_ma_pressure: [''],
            bp_pulse: [''],
            vle_note: ['', Validators.required],
            description: [''],
            image: ['']
        })
    }

    private _checkEditMode() {
        this.route.params.subscribe((params)=>{
            if(params.id) {
                this.editmode = true;
                this.caseForm = this.formBuilder.group({
                    user: [{value:'', disabled: true}, Validators.required],
                    doctor: [''],
                    bt_temperature: [''],
                    pom_oxegen_level: [''],
                    bg_glucose_level: [''],
                    wm_weight: [''],
                    pom_pulse: [''],
                    bg_post_glucose_level: [''],
                    bp_systolic: [''],
                    fb_heart_rates: [''],
                    fb_calories: [''],
                    bp_diastolic: [''],
                    fb_steps: [''],
                    bp_ma_pressure: [''],
                    bp_pulse: [''],
                    vle_note: ['', Validators.required],
                    description: [''],
                    image: ['']
                })
                this._autoFillData();
            }

            if(!params.id){
                this.hasChange = true;
            }
        })
    }

    //auto-fill existing user detail
    private _autoFillData(){
        this.route.params.subscribe((params) => {
            if(params.id) {
                this.caseId = params.id;
                this.healthService.getCaseDetailbyId(this.caseId).pipe(takeUntil(this.endSubs$)).subscribe((caseDetail) => {
        
                    this.createCaseForm.user.setValue(caseDetail[0].patient_id);
                    if(caseDetail[0].case!=null){
                        this.createCaseForm.doctor.setValue(caseDetail[0].case.doctor_id);
                    }
                    this.createCaseForm.wm_weight.setValue(caseDetail[0].has_health_data.wm_weight);
                    this.createCaseForm.bt_temperature.setValue(caseDetail[0].has_health_data.bt_temperature);
                    this.createCaseForm.pom_oxegen_level.setValue(caseDetail[0].has_health_data.pom_oxegen_level);
                    this.createCaseForm.bg_glucose_level.setValue(caseDetail[0].has_health_data.bg_glucose_level);
                    this.createCaseForm.pom_pulse.setValue(caseDetail[0].has_health_data.pom_pulse);
                    this.createCaseForm.bg_post_glucose_level.setValue(caseDetail[0].has_health_data.bg_post_glucose_level);
                    this.createCaseForm.bp_systolic.setValue(caseDetail[0].has_health_data.bp_systolic);
                    this.createCaseForm.fb_heart_rates.setValue(caseDetail[0].has_health_data.fb_heart_rates);
                    this.createCaseForm.fb_calories.setValue(caseDetail[0].has_health_data.fb_calories);
                    this.createCaseForm.bp_diastolic.setValue(caseDetail[0].has_health_data.bp_diastolic);
                    this.createCaseForm.fb_steps.setValue(caseDetail[0].has_health_data.fb_steps);
                    this.createCaseForm.bp_ma_pressure.setValue(caseDetail[0].has_health_data.bp_ma_pressure);
                    this.createCaseForm.bp_pulse.setValue(caseDetail[0].has_health_data.bp_pulse);
                    this.createCaseForm.vle_note.setValue(caseDetail[0].vle_note);
                    this.createCaseForm.description.setValue(caseDetail[0].description);
                    if(caseDetail[0].prescription.length!=0){
                        this.hasPresc=true;
                        this.imageDisplay=caseDetail[0].prescription[caseDetail[0].prescription.length-1].prescription_image;
                    }
                    this.createCaseForm.image.setValidators([]);
                    this.createCaseForm.image.updateValueAndValidity();
                    this.detectFormChange();
                })
            }
        })
    }

    detectFormChange(){
        this.caseForm.valueChanges.subscribe(() => {
            this.hasChange=true;
          });
    }

    private _getUsersofPanchayat(){
        if(this.token){
            this.vleId = this.token.user_id;
        }
        this.userService.getUserDetailbyuid(this.vleId).pipe(takeUntil(this.endSubs$)).subscribe((res)=>
        {
            this.panchayatId=res[0].details[0].panchayat_id;
            this._getAllUsers(this.panchayatId);
        })
    }

    private _getAllUsers(pid: number) {
        this.userService.getUserList().pipe(takeUntil(this.endSubs$)).subscribe((usrs)=>{
            const len = usrs.length;
            this.users=usrs;
            this._getUsersandDoctors(usrs, len, pid)
        })
    }

    private _getUsersandDoctors(_users: UserDetail[], TotalUsers: number, pId: number) {
        const users_filtered: UserDetail[]=[];
        const _doctors: UserDetail[]=[];
        for(let _i=0,j=0; _i<TotalUsers; _i++)
         {
            if(_users[_i].role_id==4 && _users[_i].panchayat_id==pId){
                users_filtered[j]=_users[_i];
                j++;
            }
         }
        this.users=users_filtered;
        for(let _i=0,j=0; _i<TotalUsers; _i++)
         {
            if(_users[_i].role_id==3){
                _doctors[j]=_users[_i];
                j++;
            }
         }
        this.doctors=_doctors;
    }


    onSubmit(){
        this.isSubmitted=true;

        if(this.caseForm.invalid) return;

        if(this.editmode) {
            this._updateCase();
        } else {
            this._createCase();
        }
    }

    private _updateCase(){

        const case_body = {
            patient_id: this.createCaseForm.user.value,
            vle_note: this.createCaseForm.vle_note.value,
            description:this.createCaseForm.description.value,
        }

        this.route.params.subscribe((params) => {

            if(params.id) {

                this.caseId = params.id;

                this.healthService.getCaseDetailbyId(this.caseId).pipe(takeUntil(this.endSubs$)).subscribe((detail)=>{


                    if(detail[0].case!=null){
                        this.docMapId=detail[0].case.mapping_id;
                    }

                    if(detail[0].has_health_data!=null){
                        this.healthDataId=detail[0].has_health_data.health_id;
                    }

                    if(detail[0].prescription[0]){
                        this.prescriptionId=detail[0].prescription[0].prescription_id;
                    }

                    if(this.caseId && this.isCaseData){

                        this.healthService.updateCase(this.caseId, case_body).pipe(takeUntil(this.endSubs$)).subscribe(()=>
                        {
                            this.isCaseData=false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Case details updated successfully!'
                            });
                        },
                        () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Case details could not be updated!'
                            }); 
                        })
                    }

                    if(this.docMapId && this.isDoctorMap){

                        const doc_body ={
                            doctor_id: this.createCaseForm.doctor.value,
                        }
                        this.healthService.updateDoctorMap(this.docMapId, doc_body).pipe(takeUntil(this.endSubs$)).subscribe(()=>
                        {
                            this.isDoctorMap=false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Doctor details updated successfully!'
                            });
                        },
                        () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Doctor details could not be updated!'
                            }); 
                        })
                    }

                    else if(!this.docMapId && this.isDoctorMap){

                        const doc_body ={
                            case_id: this.caseId,
                            doctor_id: this.createCaseForm.doctor.value,
                            mapping_status: 'assigned'
                        }
            
                        this.healthService.createDoctorMap(doc_body).pipe(takeUntil(this.endSubs$)).subscribe(
                        ()=> {
                            this.isDoctorMap=false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Doctor details added successfully!'
                            });
                        },
                        () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Doctor could not be created!'
                            }); 
                        }
                        ) 
                    }

                    if(this.healthDataId && this.isHealthData){

                        const health_data = {
                            patient_id: this.createCaseForm.user.value,
                            bt_temperature: this.createCaseForm.bt_temperature.value,
                            pom_oxegen_level: this.createCaseForm.pom_oxegen_level.value,
                            bg_glucose_level: this.createCaseForm.bg_glucose_level.value,
                            wm_weight: this.createCaseForm.wm_weight.value,
                            pom_pulse: this.createCaseForm.pom_pulse.value,
                            bg_post_glucose_level: this.createCaseForm.bg_post_glucose_level.value,
                            bp_systolic: this.createCaseForm.bp_systolic.value,
                            fb_heart_rates: this.createCaseForm.fb_heart_rates.value,
                            fb_calories: this.createCaseForm.fb_calories.value,
                            bp_diastolic: this.createCaseForm.bp_diastolic.value,
                            fb_steps: this.createCaseForm.fb_steps.value,
                            bp_ma_pressure: this.createCaseForm.bp_ma_pressure.value,
                            bp_pulse: this.createCaseForm.bp_pulse.value
                        }
    
                        this.healthService.updateHealthData(this.healthDataId, health_data).pipe(takeUntil(this.endSubs$)).subscribe(()=>
                        {
                            this.isHealthData=false;
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Health data updated successfully!'
                            });
                        },
                        () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Health data could not be updated!'
                            }); 
                        })
                    }

                    if(this.isUploaded){

                        const prescription_body = {
                            case_id: this.caseId,
                            patient_id: this.createCaseForm.user.value,
                            doctor_id: this.createCaseForm.doctor.value
                        }
    
                        this.healthService.createPrescription(prescription_body).pipe(takeUntil(this.endSubs$)).subscribe(
                            (res)=> 
                            { 
                            this.healthService.postPrescriptionImage(res.prescription_id,this.file).pipe(takeUntil(this.endSubs$)).subscribe(
                                ()=>
                                {
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: 'Success',
                                        detail: 'Prescription created!'
                                    });
                                },
                                () => {
                                    this.messageService.add({
                                        severity: 'error',
                                        summary: 'Error',
                                        detail: 'Prescription could not be created!'
                                    }); 
                                })
                            },
                            () => {
                                this.messageService.add({
                                    severity: 'error',
                                    summary: 'Error',
                                    detail: 'Unable to create prescription!'
                                }); 
                        })
                    }
                    
                })
                
            }
        })
    }

    private _createCase(){

        const case_body = {
            vle_id: this.vleId,
            panchayat_id: this.panchayatId,
            patient_id: this.createCaseForm.user.value,
            vle_note: this.createCaseForm.vle_note.value,
            description:this.createCaseForm.description.value,
            case_status: 'active',
            case_date: this.currDate
        }
        this.healthService.createCase(case_body).pipe(takeUntil(this.endSubs$)).subscribe(
        (res)=> {

            this.caseId= res.case_id;

            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Case created successfully!'
            });
            timer(2000)
            .toPromise()
            .then(() => {
                this.location.back();
            });

            const doc_body ={
                case_id: this.caseId,
                doctor_id: this.createCaseForm.doctor.value,
                mapping_status: 'assigned'
            }

            this.healthService.createDoctorMap(doc_body).pipe(takeUntil(this.endSubs$)).subscribe(
            ()=> {
                //empty block
            },
            () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Unable to create doctor!'
                }); 
            }
            )

            const health_data = {
                case_id: this.caseId,
                patient_id: this.createCaseForm.user.value,
                bt_temperature: this.createCaseForm.bt_temperature.value,
                pom_oxegen_level: this.createCaseForm.pom_oxegen_level.value,
                bg_glucose_level: this.createCaseForm.bg_glucose_level.value,
                wm_weight: this.createCaseForm.wm_weight.value,
                pom_pulse: this.createCaseForm.pom_pulse.value,
                bg_post_glucose_level: this.createCaseForm.bg_post_glucose_level.value,
                bp_systolic: this.createCaseForm.bp_systolic.value,
                fb_heart_rates: this.createCaseForm.fb_heart_rates.value,
                fb_calories: this.createCaseForm.fb_calories.value,
                bp_diastolic: this.createCaseForm.bp_diastolic.value,
                fb_steps: this.createCaseForm.fb_steps.value,
                bp_ma_pressure: this.createCaseForm.bp_ma_pressure.value,
                bp_pulse: this.createCaseForm.bp_pulse.value
            }

            this.healthService.createHealthData(health_data).pipe(takeUntil(this.endSubs$)).subscribe(()=> {
                //console.log(res)   nothing to implement here 
            },
            () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Health data could not be created!'
                }); 
            })

            if(this.isUploaded){

                const prescription_body = {
                    case_id: this.caseId,
                    patient_id: this.createCaseForm.user.value,
                    doctor_id: this.createCaseForm.doctor.value
                }

                this.healthService.createPrescription(prescription_body).pipe(takeUntil(this.endSubs$)).subscribe(
                    ()=> 
                    {
                    this.healthService.postPrescriptionImage(res.prescription_id,this.file).pipe(takeUntil(this.endSubs$)).subscribe(
                        ()=>
                        {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Prescription created successfully!'
                            });
                        },
                        () => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Oops! Prescription could not be created'
                            }); 
                        })
                    },
                    () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Unable to create prescription..!'
                        }); 
                })
            }
        },
        () => {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Case could not be created!'
            }); 
        })
    }

    onImageUpload(event) {

        this.isUploaded=true;
        this.isPrescription=true;

        this.file = event.target.files[0];
        
        if (this.file) {
            this.caseForm.patchValue({ image: this.file });
            this.caseForm.get('image').updateValueAndValidity();
            const fileReader = new FileReader();
            fileReader.onload = () => {
                this.imageDisplay = fileReader.result;
            };
            fileReader.readAsDataURL(this.file);
        }
    }

    formChange(ref: number){
        if(ref==1){
            this.isDoctorMap=true;
        }
        else if(ref==2){
            this.isHealthData=true;
        }
        else if(ref==3){
            this.isCaseData=true;
        }
    }

    removeImage(element){
          element.value ="";
          this.imageDisplay ="";
    }

    get createCaseForm() {
        return this.caseForm.controls;
    }
}
