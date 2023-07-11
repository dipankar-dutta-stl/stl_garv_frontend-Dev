import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanchayatListComponent } from './panchayat-list.component';

describe('PanchayatListComponent', () => {
    let component: PanchayatListComponent;
    let fixture: ComponentFixture<PanchayatListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PanchayatListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(PanchayatListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
