import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsMgmtComponent } from './products-mgmt.component';

describe('ProductsMgmtComponent', () => {
    let component: ProductsMgmtComponent;
    let fixture: ComponentFixture<ProductsMgmtComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ProductsMgmtComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ProductsMgmtComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
