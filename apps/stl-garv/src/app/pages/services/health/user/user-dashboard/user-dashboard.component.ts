import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '@stl-garv-frontend/ui';

@Component({
    selector: 'stl-garv-frontend-user-dashboard',
    templateUrl: './user-dashboard.component.html',
    styles: []
})
export class UserDashboardComponent implements OnInit {
    constructor(private breadcrumb: BreadcrumbService) {}

    ngOnInit(): void {
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Health',
                routerLink: '/health/user/dashboard'
            }
            ])
        );
    }
}
