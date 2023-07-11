import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VleUpdateProfileComponent } from './vle-update-profile.component';

describe('VleUpdateProfileComponent', () => {
    let component: VleUpdateProfileComponent;
    let fixture: ComponentFixture<VleUpdateProfileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VleUpdateProfileComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(VleUpdateProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
