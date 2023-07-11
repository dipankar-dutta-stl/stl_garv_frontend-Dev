import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEportalProductComponent } from './admin-eportal-product.component';

describe('AdminEportalProductComponent', () => {
    let component: AdminEportalProductComponent;
    let fixture: ComponentFixture<AdminEportalProductComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AdminEportalProductComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(AdminEportalProductComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
