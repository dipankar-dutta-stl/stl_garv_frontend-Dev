import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorMgmtComponent } from './doctor-mgmt.component';

describe('DoctorMgmtComponent', () => {
    let component: DoctorMgmtComponent;
    let fixture: ComponentFixture<DoctorMgmtComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DoctorMgmtComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DoctorMgmtComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
