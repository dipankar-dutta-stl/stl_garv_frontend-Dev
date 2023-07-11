import { Component } from '@angular/core';
import { environment } from '@env/environment';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
@Component({
    selector: 'stl-garv-egov-home-page',
    templateUrl: './egov-home-page.component.html',
})
export class EgovHomePageComponent  {
    cloudFrontURL= environment.cloudFrontURL;

    constructor(
        private breadcrumb: BreadcrumbService
    ){}
    ngOnInit(): void {
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Governance'
            }
            ])
        );
    }
}
