import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StlGarvContentComponent } from './stl-garv-content.component';

describe('StlGarvContentComponent', () => {
    let component: StlGarvContentComponent;
    let fixture: ComponentFixture<StlGarvContentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StlGarvContentComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(StlGarvContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
