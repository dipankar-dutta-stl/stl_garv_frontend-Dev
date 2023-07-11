import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EgovHomePageComponent } from './egov-home-page/egov-home-page.component';
import { EgovG2cServicesComponent } from './egov-g2c-services/egov-g2c-services.component';
import { UX_Module } from '@stl-garv-frontend/ui';
import { SharedModule } from '../../../shared/shared.module';


const routes: Routes = [
  {
    path: '',
    component: EgovHomePageComponent
  },
  {
    path : 'g2cservices',
    component: EgovG2cServicesComponent
  }
]

@NgModule({
  declarations: [
    EgovG2cServicesComponent,
    EgovHomePageComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UX_Module,
    SharedModule,
  ]
})
export class EGovernanceModule { }
