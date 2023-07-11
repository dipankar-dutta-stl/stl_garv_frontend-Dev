import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceMgmtComponent } from './source-mgmt.component';

describe('SourceMgmtComponent', () => {
    let component: SourceMgmtComponent;
    let fixture: ComponentFixture<SourceMgmtComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SourceMgmtComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(SourceMgmtComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
