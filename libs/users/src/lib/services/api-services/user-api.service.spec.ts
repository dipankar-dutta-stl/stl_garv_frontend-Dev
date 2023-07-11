import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserApiService } from './user-api.service';
import { ENVIRONMENT } from '@stl-garv-frontend/environment';

const url = 'https://appseksdev.stlgarv.com/user/view_module';

const testData = {
  module_name: 'test',
  module_image: 'health.jpg',
  description: 'test desc',
  status: 'active'
}

const mId = 1;

const environment = {
  production: false,
  apiURL: 'https://appseksdev.stlgarv.com/',
  cloudFrontURL: 'https://d1ppcfmkludwal.cloudfront.net/'
}


describe('UserApiService', () => {
  let service: UserApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserApiService,
        { provide: ENVIRONMENT, useValue: environment }
      ]
    });
    service = TestBed.inject(UserApiService);
    httpTestingController = TestBed.inject(HttpTestingController)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Check get All Modules API', () => {
    service.getAllModules().subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const request = httpTestingController.expectOne(url);
    request.flush(testData);
    expect(request.request.method).toBe('GET');
  });

  it('Check createModule() API', () => {
    service.createModule(testData).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const request = httpTestingController.expectOne('https://appseksdev.stlgarv.com/user/add_module');
    request.flush(testData);
    expect(request.request.method).toBe('POST');
  });

  it('Check getModuleById() API', () => {
    service.getModulebyId(mId).subscribe((data) => {
      expect(data).toEqual(testData);
    });
    const request = httpTestingController.expectOne('https://appseksdev.stlgarv.com/user/view_module/' + mId)
    request.flush(testData);
    expect(request.request.method).toBe('GET');
  });

  it('Ckeck updateModule() API', ()=>{
      const res ={
        Responce: "Updated Succesfully"
      }
     service.updateModule(mId, testData).subscribe((data)=>{
        expect(data).toEqual(res);
     });
     const request = httpTestingController.expectOne('https://appseksdev.stlgarv.com/user/edit_module/'+mId)
     request.flush(testData);
     expect(request.request.method).toBe('PUT');
  });

  it('Check deleteModule() API', ()=>{
    const res ={
      Responce: "deleted Succesfully"
    }
    service.deleteModule(mId).subscribe((data)=>{
      expect(data).toEqual(res);
    });
    const request = httpTestingController.expectOne('https://appseksdev.stlgarv.com/user/delete_module/'+mId)
    request.flush(testData);
    expect(request.request.method).toBe('DELETE');
  });
});