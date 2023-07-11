import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCaseFormComponent } from './doctor-case-form.component';

describe('DoctorCaseFormComponent', () => {
    let component: DoctorCaseFormComponent;
    let fixture: ComponentFixture<DoctorCaseFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DoctorCaseFormComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DoctorCaseFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
