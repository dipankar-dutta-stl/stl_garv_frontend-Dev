import { Component, OnInit } from '@angular/core';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-bread-crumb',
    templateUrl: './bread-crumb.component.html',
    styles: []
})
export class BreadCrumbComponent implements OnInit {
    crumbs$: Observable<MenuItem[]>;
    home: MenuItem = { icon: 'pi pi-home', routerLink: '/' };
    constructor(private breadcrumb: BreadcrumbService) {}

    ngOnInit(): void {
        this.crumbs$ = this.breadcrumb.crumbs$;
    }

}
