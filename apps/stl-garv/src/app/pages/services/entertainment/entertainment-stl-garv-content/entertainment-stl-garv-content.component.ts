import { Component, OnDestroy, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { Media, MediaCategoriesService, mediaCategory, MediaService } from '@stl-garv-frontend/entertainment-api';
import { MenuItem } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'stl-garv-frontend-entertainment-stl-garv-content',
    templateUrl: './entertainment-stl-garv-content.component.html',
    styles: []
})
export class EntertainmentStlGarvContentComponent implements OnInit, OnDestroy {
    cloudFrontURL= environment.cloudFrontURL;
    items: MenuItem[];
    category_items: MenuItem[];
    activeItem: MenuItem;

    mediaCategories: mediaCategory[] = [];
    selectedMediaCategory: mediaCategory;


    mediaContents: Media[] = [];
    varContents: Media[] = [];
    videoContents: Media[] =[];
    audioContents: Media[] =[];
    pdfContents: Media[] =[];

    endSubs$ : Subject<any> = new Subject();

    mediaType: string;
    term = '';
    searchTerm = '';

    constructor(
        private mediacategoriesService: MediaCategoriesService,
        private mediacontentService: MediaService
    ) {}

    ngOnInit(): void {
        this._tabMenu();
        this._filterMenu();
        this._getMediaCategories();
        this._getMediaContent();
    }

    //end subscriptions to avoid memory leak
    ngOnDestroy(): void {
        this.endSubs$.next(true);
        this.endSubs$.complete();
    }
    
     //get all categories
     private _getMediaCategories() {
        this.mediacategoriesService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe(cats=> {
            this.mediaCategories =cats;
        })
    }

    //get all media content
    private _getMediaContent() {
        this.mediacontentService.getMediaContent().pipe(takeUntil(this.endSubs$)).subscribe(media=> {
            this.mediaContents =media;

            this._getAudioContent();
            this._getPdfContent();
            this._getVideoContent();
            
        })
    }


     //get audio content
     private _getAudioContent() {
        this.mediaType='Audio';
        for (let _i=0,j=0; _i<this.mediaContents.length; _i++){
            if(this.mediaContents[_i].media_type == "Audio" && this.mediaContents[_i].source == "STL_Garv") {
                this.audioContents[j]=this.mediaContents[_i];
                j++;
                
            }
        }
        this.varContents=this.audioContents;
    }

    //get ebook content
    private _getPdfContent() {
        this.mediaType='PDF';
        for (let _i=0,j=0; _i<this.mediaContents.length; _i++){
            if(this.mediaContents[_i].media_type == "PDF" && this.mediaContents[_i].source == "STL_Garv") {
                this.pdfContents[j]=this.mediaContents[_i];
                j++;
            }
        }
        this.varContents=this.pdfContents;
    }

    //get video content
    private _getVideoContent() {
        this.mediaType='Video';
        for (let _i=0,j=0; _i<this.mediaContents.length; _i++){
            if(this.mediaContents[_i].media_type =="Video" && this.mediaContents[_i].source == "STL_Garv") {
                this.videoContents[j]=this.mediaContents[_i];
                j++;
                
            }
        }
        this.varContents=this.videoContents;
    }

     //Category Filter
     private _categoryFilter(medtype:string, cat_name:string){
        const body ={
            media_type: medtype,
            category_name: cat_name
        }

        this.mediacontentService.filterMediaByCategorySgc(body).subscribe(response =>{
            this.varContents=response;
        })

    }

    //Clear Filter
    private _clearFilter(){
        if(this.mediaType=='Video'){
            this._getVideoContent();
        }

        else if (this.mediaType=='Audio'){
            this._getAudioContent();
        }

        else if (this.mediaType=='PDF'){
            this._getPdfContent();
        }
    }

    private _tabMenu() {
        this.items = [
            {label: 'Video',command: () => {this._getVideoContent()} },
            {label: 'Audio',command: () => {this._getAudioContent()}},
            {label: 'EBook',command: () => {this._getPdfContent()}},
            
        ];
        this.activeItem = this.items[0];
            
    }
    
    private _filterMenu() {
        this.category_items = [
            {
            label:'Best Sellers',
            icon:'pi pi-star',
            command: () => {this._categoryFilter(this.mediaType, 'Best Sellers')}
            },
            {
            label:'Languages',
            icon:'pi pi-comments',
            items:[
                {
                    label:'English',
                    icon:'pi pi-hashtag',
                    command: () => {this._categoryFilter(this.mediaType, 'English')}
                },
                {
                    label:'Hindi',
                    icon:'pi pi-hashtag',
                    command: () => {this._categoryFilter(this.mediaType, 'Hindi')}
                },
                {
                    label:'Marathi',
                    icon:'pi pi-hashtag',
                    command: () => {this._categoryFilter(this.mediaType, 'Marathi')}
                },
                {
                    label:'Tamil',
                    icon:'pi pi-hashtag',
                    command: () => {this._categoryFilter(this.mediaType, 'Tollywood')}
                },

            ]
        },
            {
            label:'Genre',
            icon:'pi pi-bookmark-fill',
            items:[
                {
                    label:'Action',
                    icon:'pi pi-bookmark',
                    command: () => {this._categoryFilter(this.mediaType, 'Action')}

                },
                {
                    label:'Crime',
                    icon:'pi pi-bookmark',
                    command: () => {this._categoryFilter(this.mediaType, 'Crime')}

                },
                {
                    label:'Drama',
                    icon:'pi pi-bookmark',
                    command: () => {this._categoryFilter(this.mediaType, 'Drama')}
                },
                {
                    label:'Horror',
                    icon:'pi pi-bookmark',
                    command: () => {this._categoryFilter(this.mediaType, 'Horror')}
                },
                {
                    label:'Romance',
                    icon:'pi pi-bookmark',
                    command: () => {this._categoryFilter(this.mediaType, 'Romance')}
                }
            ]
        },
            {
            label:'Movies',
            icon:'pi pi-video',
            command: () => {this._categoryFilter(this.mediaType, 'Movies')}
            },
            {
            label:'TV Shows',
            icon:'pi pi-video',
            command: () => {this._categoryFilter(this.mediaType, 'TV Shows')}
            },
            {
            label:'Short Stories',
            icon:'pi pi-video',
            command: () => {this._categoryFilter(this.mediaType, 'Short Stories')}
            },
            {
            separator:true
            },
            {
            label:'Clear Filters',
            icon:'pi pi-filter-slash',
            command: () => {this._clearFilter()}
            }
        ]
    }


}
