import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthMenuComponent } from './health-menu.component';

describe('HealthMenuComponent', () => {
    let component: HealthMenuComponent;
    let fixture: ComponentFixture<HealthMenuComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HealthMenuComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HealthMenuComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
