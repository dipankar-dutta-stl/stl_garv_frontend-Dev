import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageEntertainComponent } from './home-page-entertain.component';

describe('HomePageEntertainComponent', () => {
    let component: HomePageEntertainComponent;
    let fixture: ComponentFixture<HomePageEntertainComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HomePageEntertainComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(HomePageEntertainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
