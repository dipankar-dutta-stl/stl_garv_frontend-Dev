import { Component } from '@angular/core';
import { environment } from '@env/environment';
import { BreadcrumbService } from '@stl-garv-frontend/ui';
@Component({
    selector: 'stl-garv-frontend-egov-g2c-services',
    templateUrl: './egov-g2c-services.component.html',
})

export class EgovG2cServicesComponent {
    cloudFrontURL= environment.cloudFrontURL;
    showdiv=false;
    constructor(
        private breadcrumb: BreadcrumbService
    ){}
   
    ngOnInit(): void {
        setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'E-Governance',
                routerLink: '/egovernance'
            },
            {
                label: 'G2C Services'
            }
            ])
        );
    }

    showDiv(){
         this.showdiv= true;
    }

    hideDiv(){
        this.showdiv=false;
    }
}
