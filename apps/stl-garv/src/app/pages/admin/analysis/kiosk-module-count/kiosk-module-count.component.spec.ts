import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KioskModuleCountComponent } from './kiosk-module-count.component';

describe('KioskModuleCountComponent', () => {
    let component: KioskModuleCountComponent;
    let fixture: ComponentFixture<KioskModuleCountComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [KioskModuleCountComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(KioskModuleCountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
