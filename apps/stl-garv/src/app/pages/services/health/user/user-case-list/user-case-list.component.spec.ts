import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCaseListComponent } from './user-case-list.component';

describe('UserCaseListComponent', () => {
    let component: UserCaseListComponent;
    let fixture: ComponentFixture<UserCaseListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserCaseListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(UserCaseListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
