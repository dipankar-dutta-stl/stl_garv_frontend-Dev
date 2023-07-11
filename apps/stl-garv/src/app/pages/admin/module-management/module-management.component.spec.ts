import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { UserApiService } from '@stl-garv-frontend/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ModuleManagementComponent } from './module-management.component';
import { APP_BASE_HREF } from '@angular/common';

const expRes =[
    {
       module_name: 'test',
       module_image: 'health.jpg',
       description: 'test desc',
       status: 'active'
    },
    {
        module_name: 'test2',
        module_image: 'education.jpg',
        description: 'test desc 2',
        status: 'active'
    }

];
const  UserApiServiceMock = {
    getAllModules: jest.fn(),
    createModule: jest.fn()
};


describe('ModuleManagementComponent', () => {
    let component: ModuleManagementComponent;
    let fixture: ComponentFixture<ModuleManagementComponent>;
 
    beforeEach(async () => {
        
        await TestBed.configureTestingModule({
            declarations: [ModuleManagementComponent],
            imports: [
                HttpClientTestingModule
              ],
            providers: [
                 MessageService, ConfirmationService,FormBuilder,
                {
                    provide: UserApiService, useValue: UserApiServiceMock,
                },
                {provide: APP_BASE_HREF, useValue: '/'}
                
            ],
            schemas:[NO_ERRORS_SCHEMA]
        }).compileComponents();

        fixture = TestBed.createComponent(ModuleManagementComponent);
        component = fixture.componentInstance;
    });

    afterEach(() => {
        if (fixture) {
          fixture.destroy();
        }
         UserApiServiceMock.getAllModules.mockReset();
      });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return a list if data available', async () => {
        UserApiServiceMock.getAllModules.mockImplementationOnce(() => of(expRes));
        component.ngOnInit();
        expect(component.moduleList.length).toBeGreaterThanOrEqual(1);
      });

    it('Checking getAllModule() method', ()=>{ 
        jest.spyOn(UserApiServiceMock, 'getAllModules').mockReturnValue(of(expRes));
        fixture.detectChanges();
        expect(component.moduleList).toBe(expRes);
    })

    it('Checking createModule() method', ()=>{
        const testModuleData ={
            module_name: 'test',
            module_image: 'health.jpg',
            description: 'test desc',
            status: 'active'
        }
        expect(component).toBeTruthy();
        UserApiServiceMock.createModule.mockImplementationOnce(() => of(testModuleData));
        component._createModule(testModuleData);
        expect(component.testModule).toBe(testModuleData);
    })
});