import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEportalHomeComponent } from './admin-eportal-home.component';

describe('AdminEportalHomeComponent', () => {
    let component: AdminEportalHomeComponent;
    let fixture: ComponentFixture<AdminEportalHomeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminEportalHomeComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminEportalHomeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
