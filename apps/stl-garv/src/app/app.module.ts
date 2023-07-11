import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';

//import Library Modules
import { BreadcrumbService, UiModule, UX_Module } from '@stl-garv-frontend/ui';
import {
    AdminAuthGuard,
    DefaultAuthGuard,
    JwtInterceptor,
    JwtTokenDecodeService,
    LoginAuthService,
    RestrictguestAuthGuard,
    UserApiService,
    UsersModule,
    VleAuthGuard
} from '@stl-garv-frontend/users';
import {
    MediaCategoriesService,
    MediaService
} from '@stl-garv-frontend/entertainment-api';

import { ConfirmationService, MessageService } from 'primeng/api';

//Environment
import { ENVIRONMENT } from '@stl-garv-frontend/environment';
import { environment } from '@env/environment';

//import {App components}
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/default/header/header.component';
import { FooterComponent } from './shared/default/footer/footer.component';
import { NavComponent } from './shared/default/nav/nav.component';
import { HomePageComponent } from './pages/basic/home-page/home-page.component';
import { ShellComponent } from './shared/default/shell/shell.component';
import { ChangePasswordComponent } from './pages/basic/change-password/change-password.component';
import { CaseService } from '@stl-garv-frontend/health-api';
import { PortalApiService } from '@stl-garv-frontend/e-portal-api';




const routes: Routes = [
    {
        path: '',
        component: ShellComponent,

        children: [
            {
                path: '',
                component: HomePageComponent,
                canActivate: [DefaultAuthGuard]
            },
            {
                path: 'change-password',
                component: ChangePasswordComponent,
                canActivate: [RestrictguestAuthGuard]
            },
            {
                path : 'entertainment' ,
                loadChildren: () => import('./pages/services/entertainment/entertainment.module').then(m => m.EntertainmentModule),
                canActivate: [DefaultAuthGuard]
            },
            {
                path : 'health' ,
                loadChildren: () => import('./pages/services/health/health.module').then(m => m.HealthModule)
            },
            {
                path : 'user' ,
                loadChildren: () => import('./pages/services/user/user.module').then(m => m.UserModule)
            },
            {
                path : 'egovernance' ,
                loadChildren: () => import('./pages/services/e-governance/e-governance.module').then(m => m.EGovernanceModule),
                canActivate: [VleAuthGuard]
            },
            {
                path : 'eportal' ,
                loadChildren: () => import('./pages/services/e-portal/e-portal.module').then(m => m.EPortalModule),
                canActivate: [VleAuthGuard]
            },

            {
                path : 'admin' ,
                loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
                canActivate: [AdminAuthGuard]
            }
        ]
    }
];

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomePageComponent,
        ShellComponent,
        NavComponent,
        ChangePasswordComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
        UsersModule,
        UiModule,
        UX_Module,
        FormsModule,
        ReactiveFormsModule,
    ],
    providers: [
        MediaCategoriesService,
        MediaService,
        LoginAuthService,
        UserApiService,
        CaseService,
        PortalApiService,
        JwtTokenDecodeService,
        MessageService,
        ConfirmationService,
        BreadcrumbService,
        DatePipe,
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        // Let angular know which value to use when injecting the token at runtime.
        { provide: ENVIRONMENT, useValue: environment }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
