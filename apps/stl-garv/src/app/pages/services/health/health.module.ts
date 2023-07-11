import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UX_Module } from '@stl-garv-frontend/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HealthDashboardComponent } from './VLE/health-dashboard/health-dashboard.component';
import {
    AdminAuthGuard,
    DoctorAuthGuard,
    UserAuthGuard,
    VleAuthGuard
} from '@stl-garv-frontend/users';
import { CaseListComponent } from './VLE/cases/case-list/case-list.component';
import { CaseDetailsComponent } from './VLE/cases/case-details/case-details.component';
import { CaseFormComponent } from './VLE/cases/case-form/case-form.component';
import { UserListComponent } from './VLE/users/user-list/user-list.component';
import { UserFormComponent } from './VLE/users/user-form/user-form.component';
import { UserDetailsComponent } from './VLE/users/user-details/user-details.component';
import { VleUpdateProfileComponent } from './VLE/vle-update-profile/vle-update-profile.component';
import { DoctorDashboardComponent } from './doc/doctor-dashboard/doctor-dashboard.component';
import { DoctorCaseListComponent } from './doc/doctor-case-list/doctor-case-list.component';
import { DoctorCaseFormComponent } from './doc/doctor-case-form/doctor-case-form.component';
import { DoctorCaseDetailsComponent } from './doc/doctor-case-details/doctor-case-details.component';
import { DoctorPatientListComponent } from './doc/doctor-patient-list/doctor-patient-list.component';
import { DoctorPatientDetailsComponent } from './doc/doctor-patient-details/doctor-patient-details.component';
import { DocUpdateProfileComponent } from './doc/doc-update-profile/doc-update-profile.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { UserCaseListComponent } from './user/user-case-list/user-case-list.component';
import { UserCaseDetailsComponent } from './user/user-case-details/user-case-details.component';
import { UpdateProfileComponent } from './user/update-profile/update-profile.component';
import { AdminUpdateProfileComponent } from '../../admin/home/admin-update-profile/admin-update-profile.component';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
    {
        path: 'vle/dashboard',
        component: HealthDashboardComponent,
        canActivate: [VleAuthGuard]
    },
    {
        path: 'vle/cases-list',
        component: CaseListComponent,
        canActivate: [VleAuthGuard]
    },
    {
        path: 'vle/case-details/:id',
        component: CaseDetailsComponent,
        canActivate: [VleAuthGuard]
    },
    {
        path: 'vle/cases-form',
        component: CaseFormComponent,
        canActivate: [VleAuthGuard]
    },
    {
        path: 'vle/cases-form/:id',
        component: CaseFormComponent,
        canActivate: [VleAuthGuard]
    },
    {
        path: 'vle/users-list',
        component: UserListComponent,
        canActivate: [VleAuthGuard]
    },
    {
        path: 'vle/users-form',
        component: UserFormComponent,
        canActivate: [VleAuthGuard]
    },
    {
        path: 'vle/user-details/:id',
        component: UserDetailsComponent,
        canActivate: [VleAuthGuard]
    },
    {
        path: 'vle/users-form/:id',
        component: UserFormComponent,
        canActivate: [VleAuthGuard]
    },
    {
        path: 'VLE/update-profile/:id',
        component: VleUpdateProfileComponent,
        canActivate: [VleAuthGuard]
    },
    {
        path: 'doctor/dashboard',
        component: DoctorDashboardComponent,
        canActivate: [DoctorAuthGuard]
    },
    {
        path: 'doctor/cases-list',
        component: DoctorCaseListComponent,
        canActivate: [DoctorAuthGuard]
    },
    {
        path: 'doctor/cases-form/:id',
        component: DoctorCaseFormComponent,
        canActivate: [DoctorAuthGuard]
    },
    {
        path: 'doctor/case-details/:id',
        component: DoctorCaseDetailsComponent,
        canActivate: [DoctorAuthGuard]
    },
    {
        path: 'doctor/patients-list',
        component: DoctorPatientListComponent,
        canActivate: [DoctorAuthGuard]
    },
    {
        path: 'doctor/patient-details/:id',
        component: DoctorPatientDetailsComponent,
        canActivate: [DoctorAuthGuard]
    },
    {
        path: 'Doctor/update-profile/:id',
        component: DocUpdateProfileComponent,
        canActivate: [DoctorAuthGuard]
    },
    {
        path: 'user/dashboard',
        component: UserDashboardComponent,
        canActivate: [UserAuthGuard]
    },
    {
        path: 'user/cases-list',
        component: UserCaseListComponent,
        canActivate: [UserAuthGuard]
    },
    {
        path: 'user/case-details/:id',
        component: UserCaseDetailsComponent,
        canActivate: [UserAuthGuard]
    },
    {
        path: 'User/update-profile/:id',
        component: UpdateProfileComponent,
        canActivate: [UserAuthGuard]
    },
    {
        path: 'Admin/update-profile/:id',
        component: AdminUpdateProfileComponent,
        canActivate: [AdminAuthGuard]
    }
];



@NgModule({
    declarations: [
        HealthDashboardComponent,
        VleUpdateProfileComponent,
        CaseListComponent,
        CaseFormComponent,
        CaseDetailsComponent,
        UserListComponent,
        UserFormComponent,
        UserDetailsComponent,
        UpdateProfileComponent,
        UserDashboardComponent,
        UserCaseListComponent,
        UserCaseDetailsComponent,
        DoctorDashboardComponent,
        DocUpdateProfileComponent,
        DoctorCaseListComponent,
        DoctorCaseFormComponent,
        DoctorCaseDetailsComponent,
        DoctorPatientListComponent,
        DoctorPatientDetailsComponent,
        AdminUpdateProfileComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        UX_Module,
        SharedModule
    ]
})
export class HealthModule {}
