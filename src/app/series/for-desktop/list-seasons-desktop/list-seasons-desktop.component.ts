
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { SerieFormDesktopComponent } from '../serie-form-desktop/serie-form-desktop.component';

import { SerieService } from 'src/app/shared/services/serie.service';

import { Serie, StatusSeries } from 'src/app/shared/models/serie.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
    selector: 'list-seasons-desktop',
    templateUrl: './list-seasons-desktop.component.html',
    styleUrls: ['./list-seasons-desktop.scss']
})

export class ListSeasonsForDesktopComponent implements OnChanges {

    @Input() listSeriesByCurrentName: Serie[];
    @Input() currentName: string;
    @Input() dataUserConnected: FirebaseUserModel;
    @Input() allSeries: Serie[];

    dataSource = new MatTableDataSource<Serie>();
    displayedColumns: string[] = ['picture', 'details'];

    serieToDelete: Serie = new Serie();
    modalRefDeleteSerie: any;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  
    contextMenuPosition = { x: '0px', y: '0px' };

    statusSeries: StatusSeries[] = [
        {id: 1, status: 'Wait to sort'}, 
        {id: 2, status: 'Not downloaded yet'}, 
        {id: 3, status: 'Watched'}, 
        {id: 4, status: 'Downloaded but not watched yet'},
        {id: 5, status: 'To search about it'}
    ];

    constructor(public dialogService: MatDialog, private serieService: SerieService) {}
    
    ngOnChanges(changes: import("@angular/core").SimpleChanges) {
        this.dataSource.data = this.listSeriesByCurrentName.sort((n1, n2) => n1.priority - n2.priority);
        this.getStatusSerie();
        this.dataSource.paginator = this.paginator;
    }

    getStatusSerie() {
        this.dataSource.data.forEach(element=>{
          this.statusSeries.forEach(statusSerie => {
            if (statusSerie.id == element.statusId) {
              element.status = statusSerie.status;
              element.note = element.note ? element.note : '-';
            }
          })
        })
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

    onContextMenu(event: MouseEvent, serie: Serie) {
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { 'serie': serie };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
    }

    editSerie(serie?: Serie) {
        const dialogRef = this.dialogService.open(SerieFormDesktopComponent, {width: '800px'});
        dialogRef.componentInstance.serie = serie;
        dialogRef.componentInstance.allSeries = this.allSeries;
        dialogRef.componentInstance.fromModalSeasonsSeriesList = true;
    }

    openDeleteSerieModal(serie: Serie, contentDeleteSerie) {
        this.serieToDelete = serie;
        this.modalRefDeleteSerie =  this.dialogService.open(contentDeleteSerie, {
          width: '30vw',
          height:'35vh',
          maxWidth: '100vw'
        }); 
    }
    
    confirmDelete() {
        const indexOfitem = this.dataSource.data.findIndex(res => res.key === this.serieToDelete.key);
        if (indexOfitem > -1) {
            for (let i = 0; i < this.dataSource.data.length; i++) {
                if (this.dataSource.data[i].priority > this.serieToDelete.priority)
                this.dataSource.data[i].priority = this.dataSource.data[i].priority - 1;
                this.serieService.update(this.dataSource.data[i].key, this.dataSource.data[i]);
            }
            this.dataSource.data.splice(indexOfitem, 1);
            this.serieService.delete(this.serieToDelete.key);  
        }     
    }

    close() {
        this.modalRefDeleteSerie.close();
    }

}