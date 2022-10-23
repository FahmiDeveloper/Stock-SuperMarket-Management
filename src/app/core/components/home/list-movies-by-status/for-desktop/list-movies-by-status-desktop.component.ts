
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Movie } from 'src/app/shared/models/movie.model';

@Component({
    selector: 'list-movies-by-status-desktop',
    templateUrl: './list-movies-by-status-desktop.component.html',
    styleUrls: ['./list-movies-by-status-desktop.scss']
})

export class ListMoviesByStatusForDesktopComponent implements OnChanges {

    @Input() listMovies: Movie[];
    @Input() currentStatusForMovie: number;

    dataSource = new MatTableDataSource<Movie>();
    displayedColumns: string[] = ['picture', 'details'];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
  
    contextMenuPosition = { x: '0px', y: '0px' };

    constructor(public dialogService: MatDialog) {}
    
    ngOnChanges(changes: import("@angular/core").SimpleChanges) {

        if (this.currentStatusForMovie == 1) {
            this.dataSource.data = this.listMovies.filter(movie => movie.statusId == 1);
        } else if (this.currentStatusForMovie == 2) {
            this.dataSource.data = this.listMovies.filter(movie => movie.statusId == 2);
        } else if (this.currentStatusForMovie == 3) {
            this.dataSource.data = this.listMovies.filter(movie => movie.statusId == 3);
        } else if (this.currentStatusForMovie == 4) {
            this.dataSource.data = this.listMovies.filter(movie => movie.statusId == 4);
        } else {
            this.dataSource.data = this.listMovies.filter(movie => movie.statusId == 5);
        }
        this.dataSource.paginator = this.paginator;

    }

    copyNameMovie(nameMovie: string){
        let selBox = document.createElement('textarea');
        selBox.style.position = 'fixed';
        selBox.style.left = '0';
        selBox.style.top = '0';
        selBox.style.opacity = '0';
        selBox.value = nameMovie;
        document.body.appendChild(selBox);
        selBox.focus();
        selBox.select();
        document.execCommand('copy');
        document.body.removeChild(selBox);
    }

    onContextMenu(event: MouseEvent, movie: Movie) {
        event.preventDefault();
        this.contextMenuPosition.x = event.clientX + 'px';
        this.contextMenuPosition.y = event.clientY + 'px';
        this.contextMenu.menuData = { 'movie': movie };
        this.contextMenu.menu.focusFirstItem('mouse');
        this.contextMenu.openMenu();
    }    

}