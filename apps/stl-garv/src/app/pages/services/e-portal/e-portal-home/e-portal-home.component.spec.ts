import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EPortalHomeComponent } from './e-portal-home.component';

describe('EPortalHomeComponent', () => {
    let component: EPortalHomeComponent;
    let fixture: ComponentFixture<EPortalHomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EPortalHomeComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(EPortalHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
