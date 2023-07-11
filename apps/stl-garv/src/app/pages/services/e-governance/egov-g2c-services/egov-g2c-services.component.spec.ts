import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgovG2cServicesComponent } from './egov-g2c-services.component';

describe('EgovG2cServicesComponent', () => {
    let component: EgovG2cServicesComponent;
    let fixture: ComponentFixture<EgovG2cServicesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EgovG2cServicesComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(EgovG2cServicesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
