
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ShowSeriePictureComponent } from 'src/app/series/show-serie-picture/show-serie-picture.component';
import { SerieFormMobileComponent } from 'src/app/series/for-mobile/serie-form-mobile/serie-form-mobile.component';

import { SerieService } from 'src/app/shared/services/serie.service';

import { Serie } from 'src/app/shared/models/serie.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
    selector: 'list-series-by-status-mobile',
    templateUrl: './list-series-by-status-mobile.component.html',
    styleUrls: ['./list-series-by-status-mobile.scss']
})

export class ListSeriesByStatusForMobileComponent implements OnChanges {

    @Input() listSeries: Serie[];
    @Input() currentStatusForSerie: number;
    @Input() dataUserConnected: FirebaseUserModel;

    dataSource = new MatTableDataSource<Serie>();
    displayedColumns: string[] = ['picture', 'name', 'season', 'episodes', 'note', 'star'];

    serieToDelete: Serie = new Serie();

    sortByDesc: boolean = true;
    queryName: string = '';
    modalRefDeleteSerie: any;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    constructor(public dialogService: MatDialog, private serieService:SerieService) {}
    
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

    sortByRefSerieDesc() {
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
        this.sortByDesc = true;
    }
    
    sortByRefSerieAsc() {
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n1.numRefSerie - n2.numRefSerie);
        this.sortByDesc = false;
    }

    filterSeries() {
        if (this.currentStatusForSerie == 1) {
            if (this.queryName) {
                this.filterSeriesByNameAndStatus(this.queryName, 1);
            } else {
                this.filterSeriesByNameAndStatus('', 1);
            }
        } else if (this.currentStatusForSerie == 2) {
            if (this.queryName) {
                this.filterSeriesByNameAndStatus(this.queryName, 2);
            } else {
                this.filterSeriesByNameAndStatus('', 2);
            }
        } else if (this.currentStatusForSerie == 3) {
            if (this.queryName) {
                this.filterSeriesByNameAndStatus(this.queryName, 3);
            } else {
                this.filterSeriesByNameAndStatus('', 3);
            }
        }  else if (this.currentStatusForSerie == 4) {
            if (this.queryName) {
                this.filterSeriesByNameAndStatus(this.queryName, 4);
            } else {
                this.filterSeriesByNameAndStatus('', 4);
            }
        } else {
            if (this.queryName) {
                this.filterSeriesByNameAndStatus(this.queryName, 5);
            } else {
                this.filterSeriesByNameAndStatus('', 5);
            }
        }       
    }

    filterSeriesByNameAndStatus(queryName: string, statusSerie: number) {
        if (queryName) {
            this.dataSource.data = this.listSeries.filter(serie => (serie.nameSerie.toLowerCase().includes(queryName.toLowerCase())) && (serie.statusId == statusSerie));
        } else {
            this.dataSource.data = this.listSeries.filter(serie => serie.statusId == statusSerie);
        }
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n1.priority - n2.priority);
    }

    editSerie(serie: Serie) {
        const dialogRef = this.dialogService.open(SerieFormMobileComponent, {
            width: '98vw',
            height:'73vh',
            maxWidth: '100vw'
        });
        dialogRef.componentInstance.serie = serie;
    }

    openDeleteSerieModal(serie: Serie, contentDeleteSerie) {
        this.serieToDelete = serie;
        this.modalRefDeleteSerie =  this.dialogService.open(contentDeleteSerie, {
            width: '98vw',
            height:'50vh',
            maxWidth: '100vw'
        }); 
    }
    
    confirmDelete() {
        this.serieService.delete(this.serieToDelete.key);
    }
    
    close() {
        this.modalRefDeleteSerie.close();
    }

}