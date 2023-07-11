import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VleMgmtComponent } from './vle-mgmt.component';

describe('VleMgmtComponent', () => {
    let component: VleMgmtComponent;
    let fixture: ComponentFixture<VleMgmtComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VleMgmtComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(VleMgmtComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
