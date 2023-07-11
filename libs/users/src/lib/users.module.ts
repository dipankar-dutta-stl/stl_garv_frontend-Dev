import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import {DialogModule} from 'primeng/dialog';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';

export const usersRoutes: Route[] = [];

const user_UX_Module = [
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    CheckboxModule,
    ToastModule,
    ProgressSpinnerModule,
    DialogModule
];

const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'reset-password',
        component: ResetPasswordComponent
    }
];

@NgModule({
    imports: [CommonModule, RouterModule.forChild(routes), user_UX_Module],
    declarations: [LoginComponent, RegisterComponent, ResetPasswordComponent],
    exports: [LoginComponent]
})
export class UsersModule {}
