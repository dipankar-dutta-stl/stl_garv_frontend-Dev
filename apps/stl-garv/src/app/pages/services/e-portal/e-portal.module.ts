import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UX_Module } from '@stl-garv-frontend/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EPortalHomeComponent } from './e-portal-home/e-portal-home.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { HealthModule } from '../health/health.module';
import { VleOrdersComponent } from './vle-orders/vle-orders.component';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
    {
        path: '',
        component: EPortalHomeComponent,
        pathMatch: 'full'
    },
    {
        path: 'product-details/:id',
        component: ProductDetailsComponent
    },
    {
        path: 'my-orders',
        component: VleOrdersComponent
    }
];

@NgModule({
    declarations: [EPortalHomeComponent, ProductDetailsComponent, VleOrdersComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        SharedModule,
        ReactiveFormsModule,
        UX_Module,
        Ng2SearchPipeModule
    ]
})
export class EPortalModule {}
