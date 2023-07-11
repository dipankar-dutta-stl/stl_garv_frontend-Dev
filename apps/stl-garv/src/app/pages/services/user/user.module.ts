import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UX_Module } from '@stl-garv-frontend/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { VleAuthGuard } from '@stl-garv-frontend/users';

import { SharedModule } from '../../../shared/shared.module';
import { UserMgmtListComponent } from './user-mgmt-list/user-mgmt-list.component';
import { CreateUserComponent } from './create-user/create-user.component';

const routes: Routes = [
    {
        path: 'vle/users-mgmt',
        component: UserMgmtListComponent,
        canActivate: [VleAuthGuard]
    },
    {
        path: 'vle/user-form',
        component: CreateUserComponent,
        canActivate: [VleAuthGuard]
    },
    {
        path: 'vle/user-form/:id',
        component: CreateUserComponent,
        canActivate: [VleAuthGuard]
    }
];

@NgModule({
    declarations: [UserMgmtListComponent, CreateUserComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        UX_Module,
        SharedModule
    ]
})
export class UserModule {}
