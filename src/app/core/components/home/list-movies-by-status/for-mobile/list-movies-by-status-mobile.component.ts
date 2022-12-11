
import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ShowMoviePictureComponent } from 'src/app/movies/show-movie-picture/show-movie-picture.component';
import { NewOrEditMovieComponent } from 'src/app/movies/version-grid-movies/new-or-edit-movie/new-or-edit-movie.component';

import { MovieService } from 'src/app/shared/services/movie.service';

import { Movie } from 'src/app/shared/models/movie.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
    selector: 'list-movies-by-status-mobile',
    templateUrl: './list-movies-by-status-mobile.component.html',
    styleUrls: ['./list-movies-by-status-mobile.scss']
})

export class ListMoviesByStatusForMobileComponent implements OnChanges {

    @Input() listMovies: Movie[];
    @Input() currentStatusForMovie: number;
    @Input() dataUserConnected: FirebaseUserModel;

    dataSource = new MatTableDataSource<Movie>();
    displayedColumns: string[] = ['picture', 'name', 'part', 'note', 'star'];

    movieToDelete: Movie = new Movie();

    sortByDesc: boolean = true;
    queryName: string = '';
    modalRefDeleteMovie: any;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

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
        const dialogRef = this.dialogService.open(NewOrEditMovieComponent, {
            width: '98vw',
            height:'73vh',
            maxWidth: '100vw'
          });
        dialogRef.componentInstance.movie = movie;
    }

    openDeleteMovieModal(movie: Movie, contentDeleteMovie) {
        this.movieToDelete = movie;
        this.modalRefDeleteMovie =  this.dialogService.open(contentDeleteMovie, {
            width: '98vw',
            height:'50vh',
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