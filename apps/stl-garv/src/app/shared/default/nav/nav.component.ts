import { Component, OnInit } from '@angular/core';
import { JwtTokenDecodeService, StorageService } from '@stl-garv-frontend/users';

@Component({
    selector: 'stl-garv-nav',
    templateUrl: './nav.component.html',
    styles: []
})
export class NavComponent implements OnInit {
    constructor(private storageService: StorageService, private jwtDecode: JwtTokenDecodeService) {}
    
    token=this.jwtDecode.tokenDecode();
    isAdmin=false;

    ngOnInit(): void {
        this._checkRole();
    }

    private _checkRole(){
        
        if(this.token && this.token.role=='Admin'){
            this.isAdmin=true;
        }
    }
}
