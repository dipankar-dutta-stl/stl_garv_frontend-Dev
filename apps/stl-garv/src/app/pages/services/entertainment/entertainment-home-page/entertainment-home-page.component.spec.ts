import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertainmentHomePageComponent } from './entertainment-home-page.component';

describe('EntertainmentHomePageComponent', () => {
    let component: EntertainmentHomePageComponent;
    let fixture: ComponentFixture<EntertainmentHomePageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EntertainmentHomePageComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(EntertainmentHomePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
