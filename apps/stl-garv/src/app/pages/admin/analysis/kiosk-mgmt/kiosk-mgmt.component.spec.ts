import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskMgmtComponent } from './kiosk-mgmt.component';

describe('KioskMgmtComponent', () => {
    let component: KioskMgmtComponent;
    let fixture: ComponentFixture<KioskMgmtComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [KioskMgmtComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(KioskMgmtComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
