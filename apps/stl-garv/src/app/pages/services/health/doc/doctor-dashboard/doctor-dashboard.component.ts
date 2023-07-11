import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { BreadcrumbService } from '@stl-garv-frontend/ui';

@Component({
    selector: 'stl-garv-frontend-doctor-dashboard',
    templateUrl: './doctor-dashboard.component.html',
    styles: []
})
export class DoctorDashboardComponent implements OnInit {
    cloudFrontURL= environment.cloudFrontURL;
    constructor(private breadcrumb: BreadcrumbService) {}

    ngOnInit(): void {
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Health',
                routerLink: '/health/doctor/dashboard'
            }
            ])
        );
    }
}
