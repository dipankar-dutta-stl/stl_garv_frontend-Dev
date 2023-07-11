import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UX_Module } from '@stl-garv-frontend/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AdminEportalHomeComponent } from './e-portal/admin-eportal-home/admin-eportal-home.component';
import { AdminEportalProductComponent } from './e-portal/admin-eportal-product/admin-eportal-product.component';
import { AdminHomeComponent } from './home/admin-home/admin-home.component';
import { CompletedOrdersComponent } from './order-management/completed-orders/completed-orders.component';
import { PaymentsComponent } from './order-management/payments/payments.component';
import { CategoryMgmtComponent } from './product-management/category-mgmt/category-mgmt.component';
import { ProductsMgmtComponent } from './product-management/products-mgmt/products-mgmt.component';
import { ServiceProviderMgmtComponent } from './product-management/service-provider-mgmt/service-provider-mgmt.component';
import { DistrictListComponent } from './region-management/district-mgmt/district-list/district-list.component';
import { PanchayatListComponent } from './region-management/panchayat-mgmt/panchayat-list/panchayat-list.component';
import { StateListComponent } from './region-management/state-mgmt/state-list/state-list.component';
import { TalukaListComponent } from './region-management/taluka-mgmt/taluka-list/taluka-list.component';
import { VillageListComponent } from './region-management/village-mgmt/village-list/village-list.component';
import { AdminUserFormComponent } from './user-management/admin-user-form/admin-user-form.component';
import { DoctorMgmtComponent } from './user-management/doctor-mgmt/doctor-mgmt.component';
import { UserMgmtComponent } from './user-management/user-mgmt/user-mgmt.component';
import { VleMgmtComponent } from './user-management/vle-mgmt/vle-mgmt.component';
import { ModuleManagementComponent } from './module-management/module-management.component';
import { SharedModule } from '../../shared/shared.module';
import { AmarChitraKathaComponent } from './entertainment/amar-chitra-katha/amar-chitra-katha.component';
import { HomePageEntertainComponent } from './entertainment/home-page-entertain/home-page-entertain.component';
import { StlGarvContentComponent } from './entertainment/stl-garv-content/stl-garv-content.component';
import { MediaItemDetailComponent } from './entertainment/media-item-detail/media-item-detail.component';
import { SourceMgmtComponent } from './entertainment/source-mgmt/source-mgmt.component';
import { ModuleCountComponent } from './analysis/module-count/module-count.component';
import { KioskModuleCountComponent } from './analysis/kiosk-module-count/kiosk-module-count.component';
import { KioskMgmtComponent } from './analysis/kiosk-mgmt/kiosk-mgmt.component';

const routes: Routes = [
    {
        path: 'metadata',
        component: AdminHomeComponent
    },

    {
        path: 'metadata/user-management/vle-mgmt',
        component: VleMgmtComponent
    },
    {
        path: 'metadata/user-management/doctor-mgmt',
        component: DoctorMgmtComponent
    },
    {
        path: 'metadata/user-management/user-mgmt',
        component: UserMgmtComponent
    },
    {
        path: 'metadata/user-management/form/:role',
        component: AdminUserFormComponent
    },
    {
        path: 'metadata/user-management/form/:role/:id',
        component: AdminUserFormComponent
    },
    {
        path: 'metadata/region-management/state/list',
        component: StateListComponent
    },
    {
        path: 'metadata/region-management/district/list',
        component: DistrictListComponent
    },
    {
        path: 'metadata/region-management/taluka/list',
        component: TalukaListComponent
    },
    {
        path: 'metadata/region-management/village/list',
        component: VillageListComponent
    },
    {
        path: 'metadata/region-management/panchayat/list',
        component: PanchayatListComponent
    },
    {
        path: 'metadata/product-management/product/list',
        component: ProductsMgmtComponent
    },
    {
        path: 'metadata/product-management/category/list',
        component: CategoryMgmtComponent
    },
    {
        path: 'metadata/product-management/service-provider/list',
        component: ServiceProviderMgmtComponent
    },
    {
        path: 'metadata/order-management/orders',
        component: CompletedOrdersComponent
    },
    {
        path: 'metadata/payments',
        component: PaymentsComponent
    },
    {
        path: 'eportal',
        component: AdminEportalHomeComponent
    },
    {
        path: 'eportal/product-details/:id',
        component: AdminEportalProductComponent
    },
    {
        path: 'module-mgmt',
        component: ModuleManagementComponent
    },
    {
        path: 'source-mgmt',
        component: SourceMgmtComponent
    },
    {
        path: 'entertainment',
        component: HomePageEntertainComponent
    },
    {
        path: 'entertainment/Amar_Chitra_Katha',
        component: AmarChitraKathaComponent
    },
    {
        path: 'entertainment/STL_Garv',
        component: StlGarvContentComponent
    },
    {
        path: 'entertainment/:source/media-details/:title',
        component: MediaItemDetailComponent
    },
    {
        path: 'metadata/region-management/panchayat/list/module-count/:id',
        component: ModuleCountComponent
    },
    {
        path: 'kiosk-management',
        component: KioskMgmtComponent
    },
    {
        path: 'kiosk-management/module-count/:id',
        component: KioskModuleCountComponent
    }
];

@NgModule({
    declarations: [
        AdminHomeComponent,
        DoctorMgmtComponent,
        VleMgmtComponent,
        UserMgmtComponent,
        AdminUserFormComponent,
        StateListComponent,
        DistrictListComponent,
        TalukaListComponent,
        VillageListComponent,
        PanchayatListComponent,
        ProductsMgmtComponent,
        CategoryMgmtComponent,
        ServiceProviderMgmtComponent,
        CompletedOrdersComponent,
        PaymentsComponent,
        AdminEportalHomeComponent,
        AdminEportalProductComponent,
        ModuleManagementComponent,
        AmarChitraKathaComponent,
        HomePageEntertainComponent,
        StlGarvContentComponent,
        MediaItemDetailComponent,
        SourceMgmtComponent,
        ModuleCountComponent,
        KioskModuleCountComponent,
        KioskMgmtComponent
    ],

    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        UX_Module,
        SharedModule,
        Ng2SearchPipeModule
    ]
})
export class AdminModule {}
