import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route, Routes } from '@angular/router';
import { UnderDevComponent } from './under-dev/under-dev.component';


//UI/UX Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CardModule } from 'primeng/card';
import { MenuModule } from 'primeng/menu';
import { TabMenuModule } from 'primeng/tabmenu';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { CarouselModule } from 'primeng/carousel';
import { DropdownModule } from 'primeng/dropdown';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DialogModule } from 'primeng/dialog';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { CheckboxModule } from 'primeng/checkbox';
import { InputMaskModule } from 'primeng/inputmask';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { FileUploadModule } from 'primeng/fileupload';
import {SelectButtonModule} from 'primeng/selectbutton';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TooltipModule} from 'primeng/tooltip';
import {InputSwitchModule} from 'primeng/inputswitch';
import {ListboxModule} from 'primeng/listbox';
import {CalendarModule} from 'primeng/calendar';

export const UX_Module = [
    ButtonModule,
    InputTextModule,
    AvatarModule,
    AvatarGroupModule,
    CardModule,
    MenuModule,
    TabMenuModule,
    ChartModule,
    TableModule,
    ToastModule,
    ConfirmDialogModule,
    ToolbarModule,
    CarouselModule,
    DropdownModule,
    TieredMenuModule,
    DialogModule,
    BreadcrumbModule,
    CheckboxModule,
    InputMaskModule,
    PasswordModule,
    DividerModule,
    FileUploadModule,
    SelectButtonModule,
    ProgressSpinnerModule,
    TooltipModule,
    InputSwitchModule,
    ListboxModule,
    CalendarModule
];

export const uiRoutes: Route[] = [];

const routes : Routes = [
    {
        path: 'dev',
        component: UnderDevComponent
    }
]

@NgModule({
    imports: [CommonModule,RouterModule.forChild(routes),UX_Module],
    declarations: [UnderDevComponent],
    exports: [UnderDevComponent]
})
export class UiModule {}
