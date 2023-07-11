import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocUpdateProfileComponent } from './doc-update-profile.component';

describe('DocUpdateProfileComponent', () => {
    let component: DocUpdateProfileComponent;
    let fixture: ComponentFixture<DocUpdateProfileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DocUpdateProfileComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(DocUpdateProfileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
