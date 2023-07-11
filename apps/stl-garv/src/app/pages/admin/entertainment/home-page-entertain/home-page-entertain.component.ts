import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Source, SourceService } from '@stl-garv-frontend/entertainment-api';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '@env/environment';
import { BreadcrumbService } from '@stl-garv-frontend/ui';

@Component({
    selector: 'stl-garv-frontend-home-page-entertain',
    templateUrl: './home-page-entertain.component.html',
    styles: []
})
export class HomePageEntertainComponent implements OnInit, OnDestroy{

    endSubs$ : Subject<any> = new Subject();
    sourceList: Source[]=[];

    cloudFrontURL= environment.cloudFrontURL;

    constructor(
        private sourceService: SourceService,
        private router: Router,
        private breadcrumb: BreadcrumbService
    ) {}

    ngOnInit(): void {
       this._getAllSource();
       setTimeout(() =>
            this.breadcrumb.setCrumbs([
            {
                label: 'Entertainment',
                routerLink: '/entertainment'
            }
            ])
        );
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getAllSource(){
        this.sourceService.getAllSources().pipe(takeUntil(this.endSubs$)).subscribe((res)=>{
            this.sourceList=res;
           
        })
    }

    navigateByUrl(url: string, isRedirect: number){

        if(isRedirect==1){
            window.location.href=url
        }

        else{
            switch (url) {

                case '/Amar_Chitra_Katha':
                    this.router.navigate(['admin/entertainment/Amar_Chitra_Katha'])
                    break;
            
                case '/STL_Garv':
                    this.router.navigate(['admin/entertainment/STL_Garv']) 
                    break;
                    
                default:
                    this.router.navigate(['']);
                    break;

            }
        }
        
    }
}
