import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmarChitraKathaComponent } from './amar-chitra-katha.component';

describe('AmarChitraKathaComponent', () => {
    let component: AmarChitraKathaComponent;
    let fixture: ComponentFixture<AmarChitraKathaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AmarChitraKathaComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AmarChitraKathaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
