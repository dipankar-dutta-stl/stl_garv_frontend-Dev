import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VleOrdersComponent } from './vle-orders.component';

describe('VleOrdersComponent', () => {
    let component: VleOrdersComponent;
    let fixture: ComponentFixture<VleOrdersComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VleOrdersComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(VleOrdersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
