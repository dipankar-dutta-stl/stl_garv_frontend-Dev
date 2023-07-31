import { Component, OnInit } from '@angular/core';
import { JwtTokenDecodeService, StorageService } from '@stl-garv-frontend/users';
import {MenuItem} from 'primeng/api';

@Component({
    selector: 'stl-garv-health-menu',
    templateUrl: './health-menu.component.html',
    styles: []
})
export class HealthMenuComponent implements OnInit {

    constructor(private storageService: StorageService, private jwtDecode: JwtTokenDecodeService) {}

    items: MenuItem[];
    activeItem: MenuItem;
    token=this.jwtDecode.tokenDecode();
    isVle = false;
    isDoctor = false;
    isUser =false;
    isAdmin =false;

    ngOnInit(): void {
        this._checkRole();
        this._tabMenu();
    }

    private _checkRole(){
        
        if(this.token && this.token.role=='VLE'){
            this.isVle=true; 
            
        }

        if(this.token && this.token.role=='Doctor'){
            this.isDoctor=true;
            
        }

        if(this.token && this.token.role=='User'){
            this.isUser=true;
        }
        if(this.token && this.token.role=='Admin'){
            this.isAdmin=true;
        }
    }

    private _tabMenu() {
        this.items = [
            // {label: 'Dashboard',routerLink: '/health/vle/dashboard', visible:this.isVle},
            // {label: 'User Management',routerLink: '/health/vle/users-list', visible:this.isVle},
            {label: 'Case Management',routerLink: '/health/vle/cases-list', visible:this.isVle},
            // {label: 'Dynamic Field', visible:this.isVle},

            // {label: 'Dashboard',routerLink: '/health/doctor/dashboard', visible:this.isDoctor},
            {label: 'My Cases',routerLink: '/health/doctor/cases-list', visible:this.isDoctor},
            // {label: 'My Patients',routerLink: '/health/doctor/patients-list', visible:this.isDoctor},

            // {label: 'Dashboard',routerLink: '/health/user/dashboard', visible:this.isUser},
            {label: 'My Cases',routerLink: '/health/user/cases-list', visible:this.isUser},

            {label: 'Dashboard',routerLink: '/admin/metadata', visible:this.isAdmin},
            {label: 'Users',routerLink: '/admin/metadata/user-management/vle-mgmt', visible:this.isAdmin},
            {label: 'Products',routerLink: '/admin/metadata/product-management/product/list', visible:this.isAdmin},
            {label: 'Region',routerLink: '/admin/metadata/region-management/state/list', visible:this.isAdmin},
            {label: 'Modules',routerLink: '/admin/module-mgmt', visible:this.isAdmin},
            {label: 'Entertain Sources',routerLink: '/admin/source-mgmt', visible:this.isAdmin},
            {label: 'Kiosk',routerLink: '/admin/kiosk-management', visible:this.isAdmin}
        ];
        this.activeItem = this.items[0];
            
    }
}
