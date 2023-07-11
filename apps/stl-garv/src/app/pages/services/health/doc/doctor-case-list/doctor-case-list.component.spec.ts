import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCaseListComponent } from './doctor-case-list.component';

describe('DoctorCaseListComponent', () => {
    let component: DoctorCaseListComponent;
    let fixture: ComponentFixture<DoctorCaseListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DoctorCaseListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DoctorCaseListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
