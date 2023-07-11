import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EgovHomePageComponent } from './egov-home-page.component';

describe('EgovHomePageComponent', () => {
    let component: EgovHomePageComponent;
    let fixture: ComponentFixture<EgovHomePageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EgovHomePageComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(EgovHomePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
