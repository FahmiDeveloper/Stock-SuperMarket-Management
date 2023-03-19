import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as moment from 'moment';

import { MovieDetailsWithPartsDesktopComponent } from './movie-details-with-parts-desktop/movie-details-with-parts-desktop.component';
import { MovieFormDesktopComponent } from './movie-form-desktop/movie-form-desktop.component';
import { MovieDetailsDesktopComponent } from './movie-details-desktop/movie-details-desktop.component';

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { MovieService } from '../../shared/services/movie.service';
import { UsersListService } from '../../shared/services/list-users.service';

import { Movie, StatusMovies } from '../../shared/models/movie.model';

@Component({
  selector: 'movies-for-desktop',
  templateUrl: './movies-for-desktop.component.html',
  styleUrls: ['./movies-for-desktop.scss']
})

export class MoviesForDesktopComponent implements OnInit, OnDestroy {

  moviesList: Movie[] = [];
  moviesListCopie: Movie[] = [];
  allMovies: Movie[] = [];
  listPartsByParentFilmKey: Movie[] = [];

  p: number = 1;

  movieName: string = '';
  statusId: number;
  sortByDesc: boolean = true;
  isDesktop: boolean;
  isTablet: boolean;
  optionSelected: number;
  dislike: boolean = false;
  nbrMoviesToCheckToday: number = 0;

  subscriptionForGetAllMovies: Subscription;
  subscriptionForGetAllMoviesForSelect: Subscription;

  statusMovies: StatusMovies[] = [
    {id: 1, status: 'On hold'}, 
    {id: 2, status: 'Not yet downloaded'},
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not yet watched'},
    {id: 5, status: 'Will be looked for'}
  ];

  constructor(
    private movieService: MovieService, 
    public userService: UserService,
    public usersListService: UsersListService,
    public authService: AuthService,
    private deviceService: DeviceDetectorService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();
    this.getAllMovies();
    this.getAllMoviesForSelect();
  }

  getAllMovies() {    
    this.subscriptionForGetAllMovies = this.movieService
    .getAll()
    .subscribe((movies: Movie[]) => {
      this.moviesListCopie = movies.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
      this.allMovies = movies;

      if (this.movieName) {
        this.moviesList = movies.filter(movie => (movie.nameMovie.toLowerCase().includes(this.movieName.toLowerCase()) && (movie.isFirst == true)));
        this.moviesList = this.moviesList.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
      }

      else if (this.statusId) {
        if (this.statusId == 1) {
          if (this.dislike) this.dislike = false;
          if (this.optionSelected) {
            if (this.optionSelected == 1) {
              this.moviesList = movies.filter(movie => movie.statusId == this.statusId && !movie.checkDate); 
            }
            else {
              this.moviesList = movies.filter(movie => movie.statusId == this.statusId && movie.checkDate && movie.checkDate == moment().format('YYYY-MM-DD'));
            }      
          }
          else  {
            this.moviesList = movies.filter(movie => movie.statusId == this.statusId);
          }
          this.moviesList = this.moviesList.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
        }
        else {
          if (this.optionSelected) this.optionSelected = null;
          if (this.statusId == 3) {
            if (this.dislike) {
              this.moviesList = movies.filter(movie => movie.statusId == this.statusId && movie.notLiked == true);
            }
            else  {
              this.moviesList = movies.filter(movie => movie.statusId == this.statusId);
            }
          }
          else {
            if (this.dislike) this.dislike = false;
            this.moviesList = movies.filter(movie => movie.statusId == this.statusId);
          }     
          this.moviesList = this.statusId == 2 ? this.moviesList.sort((n1, n2) => n1.numRefMovie - n2.numRefMovie) : this.moviesList.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);            
        }
      }
      
      else this.moviesList = movies.filter(movie => movie.isFirst == true).sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
    });
  }

  getAllMoviesForSelect() {
    this.subscriptionForGetAllMoviesForSelect = this.movieService
    .getAll()
    .subscribe((movies: Movie[]) => {
      this.nbrMoviesToCheckToday = movies.filter(movie => movie.statusId == 1 && movie.checkDate && movie.checkDate == moment().format('YYYY-MM-DD')).length;
    })
  }

  OnPageChange(event: PageEvent){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  showDetailsMovie(movieSelected: Movie) {
    this.listPartsByParentFilmKey = this.allMovies
    .filter(movie => (movie.key == movieSelected.key) || (movie.parentFilmKey == movieSelected.key))
    .sort((n1, n2) => n1.priority - n2.priority);

    const dialogRef = this.dialogService.open(MovieDetailsWithPartsDesktopComponent, {width: '600px'});
    dialogRef.componentInstance.movie = movieSelected;
    dialogRef.componentInstance.allMovies = this.allMovies;
    dialogRef.componentInstance.listPartsByParentFilmKey = this.listPartsByParentFilmKey;
    dialogRef.componentInstance.isDesktop = this.isDesktop;
  }

  newMovie() {
    const dialogRef = this.dialogService.open(MovieFormDesktopComponent, {width: '500px', data: {movie: {}}});
    dialogRef.componentInstance.arrayMovies = this.moviesListCopie;
    dialogRef.componentInstance.allMovies = this.allMovies;
  }

  viewDetailsMovie(movie: Movie) {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(MovieDetailsDesktopComponent, config);

    dialogRef.componentInstance.movie = movie;
    dialogRef.componentInstance.allMovies = this.allMovies;
  }

  editMovie(movie?: Movie) {
    const dialogRef = this.dialogService.open(MovieFormDesktopComponent, {width: '500px'});
    dialogRef.componentInstance.movie = movie;
    dialogRef.componentInstance.allMovies = this.allMovies; 
  }

  deleteMovie(movieKey: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this movie!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.movieService.delete(movieKey);
        Swal.fire(
          'Movie has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  followLink(path: string) {
    window.open(path);
  }

  copyText(text: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }
  
  ngOnDestroy() {
    this.subscriptionForGetAllMovies.unsubscribe();
    this.subscriptionForGetAllMoviesForSelect.unsubscribe();
  }

}