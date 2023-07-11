import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorPatientDetailsComponent } from './doctor-patient-details.component';

describe('DoctorPatientDetailsComponent', () => {
    let component: DoctorPatientDetailsComponent;
    let fixture: ComponentFixture<DoctorPatientDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DoctorPatientDetailsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DoctorPatientDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
