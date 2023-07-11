import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UX_Module } from '@stl-garv-frontend/ui';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { EntertainmentHomePageComponent } from './entertainment-home-page/entertainment-home-page.component';
import { EntertainmentAmarChitraKathaComponent } from './entertainment-amar-chitra-katha/entertainment-amar-chitra-katha.component';
import { EntertainmentStlGarvContentComponent } from './entertainment-stl-garv-content/entertainment-stl-garv-content.component';
import { MediaDetailsComponent } from './media-details/media-details.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: EntertainmentHomePageComponent
  },
  {
    path: 'Amar_Chitra_Katha',
    component: EntertainmentAmarChitraKathaComponent,
  },
  {
    path: 'STL_Garv',
    component: EntertainmentStlGarvContentComponent,
  },
  {
    path: ':source/media-details/:title',
    component: MediaDetailsComponent
  }
]

@NgModule({
  declarations: [
    EntertainmentHomePageComponent,
    EntertainmentAmarChitraKathaComponent,
    EntertainmentStlGarvContentComponent,
    MediaDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Ng2SearchPipeModule,
    FormsModule,
    UX_Module,
    SharedModule
  ]
})
export class EntertainmentModule { }
