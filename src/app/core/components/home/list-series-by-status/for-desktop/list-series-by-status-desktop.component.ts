import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Serie } from 'src/app/shared/models/serie.model';

@Component({
    selector: 'list-series-by-status-desktop',
    templateUrl: './list-series-by-status-desktop.component.html',
    styleUrls: ['./list-series-by-status-desktop.scss']
})

export class ListSeriesByStatusForDesktopComponent implements OnChanges {

    @Input() listSeries: Serie[];
    @Input() currentStatusForSerie: number;

    dataSource = new MatTableDataSource<Serie>();
    displayedColumns: string[] = ['picture', 'details'];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
  
    contextMenuPosition = { x: '0px', y: '0px' };
    
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

}