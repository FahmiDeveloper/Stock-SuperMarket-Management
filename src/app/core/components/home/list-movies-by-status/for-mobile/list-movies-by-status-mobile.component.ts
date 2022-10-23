
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ShowMoviePictureComponent } from 'src/app/movies/show-movie-picture/show-movie-picture.component';

import { Movie } from 'src/app/shared/models/movie.model';

@Component({
    selector: 'list-movies-by-status-mobile',
    templateUrl: './list-movies-by-status-mobile.component.html',
    styleUrls: ['./list-movies-by-status-mobile.scss']
})

export class ListMoviesByStatusForMobileComponent implements OnChanges {

    @Input() listMovies: Movie[];
    @Input() currentStatusForMovie: number;

    dataSource = new MatTableDataSource<Movie>();
    displayedColumns: string[] = ['picture', 'name', 'note', 'star'];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

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

    zoomPicture(movie: Movie) {
        const dialogRef = this.dialogService.open(ShowMoviePictureComponent, {
          width: '98vw',
          height:'77vh',
          maxWidth: '100vw'
        });
        dialogRef.componentInstance.movieForModal = movie;
        dialogRef.componentInstance.dialogRef = dialogRef;
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

}