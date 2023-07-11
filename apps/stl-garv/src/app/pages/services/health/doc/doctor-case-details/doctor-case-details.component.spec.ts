import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCaseDetailsComponent } from './doctor-case-details.component';

describe('DoctorCaseDetailsComponent', () => {
    let component: DoctorCaseDetailsComponent;
    let fixture: ComponentFixture<DoctorCaseDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DoctorCaseDetailsComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DoctorCaseDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
