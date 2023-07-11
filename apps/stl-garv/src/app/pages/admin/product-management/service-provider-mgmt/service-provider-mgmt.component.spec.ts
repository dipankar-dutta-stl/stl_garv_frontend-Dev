import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceProviderMgmtComponent } from './service-provider-mgmt.component';

describe('ServiceProviderMgmtComponent', () => {
    let component: ServiceProviderMgmtComponent;
    let fixture: ComponentFixture<ServiceProviderMgmtComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ServiceProviderMgmtComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ServiceProviderMgmtComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
