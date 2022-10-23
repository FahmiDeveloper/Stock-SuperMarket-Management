
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ShowSeriePictureComponent } from 'src/app/series/show-serie-picture/show-serie-picture.component';

import { Serie } from 'src/app/shared/models/serie.model';

@Component({
    selector: 'list-series-by-status-mobile',
    templateUrl: './list-series-by-status-mobile.component.html',
    styleUrls: ['./list-series-by-status-mobile.scss']
})

export class ListSeriesByStatusForMobileComponent implements OnChanges {

    @Input() listSeries: Serie[];
    @Input() currentStatusForSerie: number;

    dataSource = new MatTableDataSource<Serie>();
    displayedColumns: string[] = ['picture', 'name', 'note', 'star'];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(public dialogService: MatDialog) {}
    
    ngOnChanges(changes: import("@angular/core").SimpleChanges) {

        if (this.currentStatusForSerie == 1) {
            this.dataSource.data = this.listSeries.filter(serie => serie.statusId == 1);
        } else if (this.currentStatusForSerie == 2) {
            this.dataSource.data = this.listSeries.filter(serie => serie.statusId == 2);
        } else if (this.currentStatusForSerie == 3) {
            this.dataSource.data = this.listSeries.filter(serie => serie.statusId == 3);
        } else if (this.currentStatusForSerie == 4) {
            this.dataSource.data = this.listSeries.filter(serie => serie.statusId == 4);
        } else {
            this.dataSource.data = this.listSeries.filter(serie => serie.statusId == 5);
        }
        this.dataSource.paginator = this.paginator;

    }

    zoomPicture(serie: Serie) {
        const dialogRef = this.dialogService.open(ShowSeriePictureComponent, {
          width: '98vw',
          height:'77vh',
          maxWidth: '100vw'
        });
        dialogRef.componentInstance.serieForModal = serie;
        dialogRef.componentInstance.dialogRef = dialogRef;
    }

    copyNameSerie(nameSerie: string){
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = nameSerie;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

}