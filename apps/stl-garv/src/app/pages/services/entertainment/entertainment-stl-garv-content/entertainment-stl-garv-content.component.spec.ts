import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertainmentStlGarvContentComponent } from './entertainment-stl-garv-content.component';

describe('EntertainmentStlGarvContentComponent', () => {
    let component: EntertainmentStlGarvContentComponent;
    let fixture: ComponentFixture<EntertainmentStlGarvContentComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EntertainmentStlGarvContentComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(EntertainmentStlGarvContentComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
