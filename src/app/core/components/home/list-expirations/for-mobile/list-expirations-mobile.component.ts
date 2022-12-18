import { Component, Input, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Expiration } from 'src/app/shared/models/expiration.model';

@Component({
    selector: 'expirations-list-mobile',
    templateUrl: './list-expirations-mobile.component.html',
    styleUrls: ['./list-expirations-mobile.scss']
})

export class ListExpirationsForMobileComponent {

    @Input() expirationsList: Expiration[];
    @Input() allExpirationsList: Expiration[];

    content: string = '';

    dataSource = new MatTableDataSource<Expiration>();
    displayedColumns: string[] = ['content', 'cost', 'start','expiration', 'duration', 'rest', 'status', 'note'];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
    ngOnChanges(changes: import("@angular/core").SimpleChanges) {

        this.dataSource.data = this.expirationsList;

        if (this.dataSource.data.length > 0) {
            this.dataSource.data.forEach(expiration => {
                this.calculateDateDiff(expiration);
                this.checkExpiredStatus(expiration);
                this.calculateRestDays(expiration);
            })
        }

        this.dataSource.paginator = this.paginator;

    }

    calculateDateDiff(expiration: Expiration) {
        var dateStart:any = new Date(expiration.dateStart);
        var dateExpiration:any = new Date(expiration.dateExpiration);
        var dateDiff = new Date(dateExpiration - dateStart);
    
        expiration.duration = Math.abs(dateDiff.getUTCFullYear() - 1970) + "Y " + (dateDiff.getMonth()) + "M " + dateDiff.getDate() + "D";
    }
    
    checkExpiredStatus(expiration: Expiration) {
        let currentDate = new Date();
        let composedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        let dateExpiration = new Date(expiration.dateExpiration);
    
        expiration.isExpired = (composedDate.getTime() > dateExpiration.getTime()) ? true : false ;
    }
    
    calculateRestDays(expiration: Expiration) { 
        // var Time = new Date(expiration.dateExpiration).getTime() - new Date().getTime(); 
        // var Days = Time / (1000 * 3600 * 24); //
        // expiration.rtrt = Number(Days);
    
        const now = new Date();
        const dateExpiration = (new Date(expiration.dateExpiration)).getTime();
        const nowTime = now.getTime();
    
        const diff = Math.abs(dateExpiration - nowTime);
    
        let diffEnDays  = Math.round(diff / (1000 * 60 * 60  * 24));
    
        var years = Math.floor(diffEnDays / 365);
        var months = Math.floor(diffEnDays % 365 / 30);
        var days = Math.floor(diffEnDays % 365 % 30);
    
        expiration.restdays = years + "Y " + months + "M " + days + "D";
    }

    filterByContent() {
        if (this.content) {
            this.dataSource.data = this.allExpirationsList.filter(expiration => expiration.contentName.toLowerCase().includes(this.content.toLowerCase()));
        }
    }

}