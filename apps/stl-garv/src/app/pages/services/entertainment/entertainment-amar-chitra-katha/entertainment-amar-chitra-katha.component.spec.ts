import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertainmentAmarChitraKathaComponent } from './entertainment-amar-chitra-katha.component';

describe('EntertainmentAmarChitraKathaComponent', () => {
    let component: EntertainmentAmarChitraKathaComponent;
    let fixture: ComponentFixture<EntertainmentAmarChitraKathaComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EntertainmentAmarChitraKathaComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(EntertainmentAmarChitraKathaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
