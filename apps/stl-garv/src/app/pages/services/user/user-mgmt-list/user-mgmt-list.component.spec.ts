import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMgmtListComponent } from './user-mgmt-list.component';

describe('UserMgmtListComponent', () => {
    let component: UserMgmtListComponent;
    let fixture: ComponentFixture<UserMgmtListComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [UserMgmtListComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(UserMgmtListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
