import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleCountComponent } from './module-count.component';

describe('ModuleCountComponent', () => {
    let component: ModuleCountComponent;
    let fixture: ComponentFixture<ModuleCountComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModuleCountComponent]
        }).compileComponents();

        fixture = TestBed.createComponent(ModuleCountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
