import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { MediaService } from '@stl-garv-frontend/entertainment-api';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-media-details',
    templateUrl: './media-details.component.html',
    styles: []
})
export class MediaDetailsComponent implements OnInit, OnDestroy {

    cloudFrontURL= environment.cloudFrontURL;
    title: string;
    mediaDetails: any;

    endSubs$ : Subject<any> = new Subject();

    constructor(
        private routeActivate: ActivatedRoute,
        private mediaService: MediaService
    ) {}

    ngOnInit(): void {
        this.title= this.routeActivate.snapshot.params['title'];

        this._getMediaDetailByTitle();
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }

    private _getMediaDetailByTitle() {
        this.mediaService.getMediaDetailByTitle(this.title).pipe(takeUntil(this.endSubs$)).subscribe(details=>{
            this.mediaDetails= details;
        })
    }
}
