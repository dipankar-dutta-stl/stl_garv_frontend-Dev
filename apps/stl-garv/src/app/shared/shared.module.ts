import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadCrumbComponent } from './default/bread-crumb/bread-crumb.component';
import { HealthMenuComponent } from './default/health-menu/health-menu.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UX_Module } from '@stl-garv-frontend/ui';



@NgModule({
  declarations: [
    BreadCrumbComponent, 
    HealthMenuComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UX_Module,
  ],
  exports: [BreadCrumbComponent, HealthMenuComponent]
})
export class SharedModule { }
