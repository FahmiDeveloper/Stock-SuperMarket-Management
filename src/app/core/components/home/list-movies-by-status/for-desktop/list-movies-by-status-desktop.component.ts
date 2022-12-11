
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { MovieFormComponent } from 'src/app/movies/movie-form/movie-form.component';

import { MovieService } from 'src/app/shared/services/movie.service';

import { Movie } from 'src/app/shared/models/movie.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
    selector: 'list-movies-by-status-desktop',
    templateUrl: './list-movies-by-status-desktop.component.html',
    styleUrls: ['./list-movies-by-status-desktop.scss']
})

export class ListMoviesByStatusForDesktopComponent implements OnChanges {

    @Input() listMovies: Movie[];
    @Input() currentStatusForMovie: number;
    @Input() dataUserConnected: FirebaseUserModel;

    dataSource = new MatTableDataSource<Movie>();
    displayedColumns: string[] = ['picture', 'details'];

    movieToDelete: Movie = new Movie();

    sortByDesc: boolean = true;
    queryName: string = '';
    modalRefDeleteMovie: any;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

    @ViewChild(MatMenuTrigger)
    contextMenu: MatMenuTrigger;
  
    contextMenuPosition = { x: '0px', y: '0px' };

    constructor(public dialogService: MatDialog, private movieService: MovieService) {}
    
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
    
    sortByRefMovieDesc() {
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
        this.sortByDesc = true;
    }
    
    sortByRefMovieAsc() {
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n1.numRefMovie - n2.numRefMovie);
        this.sortByDesc = false;
    }

    filterMovies() {
        if (this.currentStatusForMovie == 1) {
            if (this.queryName) {
                this.filterMoviesByNameAndStatus(this.queryName, 1);
            } else {
                this.filterMoviesByNameAndStatus('', 1);
            }
        } else if (this.currentStatusForMovie == 2) {
            if (this.queryName) {
                this.filterMoviesByNameAndStatus(this.queryName, 2);
            } else {
                this.filterMoviesByNameAndStatus('', 2);
            }
        } else if (this.currentStatusForMovie == 3) {
            if (this.queryName) {
                this.filterMoviesByNameAndStatus(this.queryName, 3);
            } else {
                this.filterMoviesByNameAndStatus('', 3);
            }
        }  else if (this.currentStatusForMovie == 4) {
            if (this.queryName) {
                this.filterMoviesByNameAndStatus(this.queryName, 4);
            } else {
                this.filterMoviesByNameAndStatus('', 4);
            }
        } else {
            if (this.queryName) {
                this.filterMoviesByNameAndStatus(this.queryName, 5);
            } else {
                this.filterMoviesByNameAndStatus('', 5);
            }
        }       
    }

    filterMoviesByNameAndStatus(queryName: string, statusMovie: number) {
        if (queryName) {
            this.dataSource.data = this.listMovies.filter(movie => (movie.nameMovie.toLowerCase().includes(queryName.toLowerCase())) && (movie.statusId == statusMovie));
        } else {
            this.dataSource.data = this.listMovies.filter(movie => movie.statusId == statusMovie);
        }
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n1.priority - n2.priority);
    }

    editMovie(movie: Movie) {
        const dialogRef = this.dialogService.open(MovieFormComponent, {width: '800px'});
        dialogRef.componentInstance.movie = movie;
    }

    openDeleteMovieModal(movie: Movie, contentDeleteMovie) {
        this.movieToDelete = movie;
        this.modalRefDeleteMovie =  this.dialogService.open(contentDeleteMovie, {
          width: '30vw',
          height:'35vh',
          maxWidth: '100vw'
        }); 
    }
    
    confirmDelete() {
        this.movieService.delete(this.movieToDelete.key);
    }
    
    close() {
        this.modalRefDeleteMovie.close();
    }

}