import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { DeviceDetectorService } from 'ngx-device-detector';

import { MovieDetailsWithPartsDesktopComponent } from './movie-details-with-parts/movie-details-with-parts-desktop.component';
import { MovieFormDesktopComponent } from './movie-form-desktop/movie-form-desktop.component';

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { MovieService } from '../../shared/services/movie.service';
import { UsersListService } from '../../shared/services/list-users.service';

import { FirebaseUserModel } from '../../shared/models/user.model';
import { Movie, StatusMovies } from '../../shared/models/movie.model';

@Component({
  selector: 'movies-for-desktop',
  templateUrl: './movies-for-desktop.component.html',
  styleUrls: ['./movies-for-desktop.scss']
})

export class MoviesForDesktopComponent implements OnInit, OnDestroy {

  moviesList: Movie[] = [];
  pagedList: Movie[]= [];
  moviesListCopie: Movie[] = [];
  allMovies: Movie[] = [];
  listPartsByParentFilmKey: Movie[] = [];

  movieName: string = '';
  statusId: number;
  sortByDesc: boolean = true;
  isDesktop: boolean;
  isTablet: boolean;

  length: number = 0;

  subscriptionForGetAllMovies: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  statusMovies: StatusMovies[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 5, status: 'To search about it'}
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
    this.getRolesUser();
    this.getAllMovies(); 
  }

  getRolesUser() {
    this.subscriptionForUser = this.authService
      .isConnected
      .subscribe(res=>{
        if(res) {
          this.userService
            .getCurrentUser()
            .then(user=>{
              if(user) {
                let connectedUserFromList: FirebaseUserModel = new FirebaseUserModel();

                this.subscriptionForGetAllUsers = this.usersListService
                .getAll()
                .subscribe((users: FirebaseUserModel[]) => { 
                  connectedUserFromList = users.find(element => element.email == user.email);

                  this.usersListService
                  .get(connectedUserFromList.key)
                  .valueChanges()
                  .subscribe(dataUser=>{
                    this.dataUserConnected = dataUser;
                  });
                });
              }
          });   
        }
    })
  }

  getAllMovies() {    
    this.subscriptionForGetAllMovies = this.movieService
    .getAll()
    .subscribe(movies => {
      this.moviesListCopie = movies.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
      this.allMovies = movies;

      if (this.movieName) {
        this.moviesList = movies.filter(movie => (movie.nameMovie.toLowerCase().includes(this.movieName.toLowerCase()) && (movie.isFirst == true)));
        this.moviesList = this.moviesList.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
      }
      
      else if (this.statusId) {
        this.moviesList = movies.filter(movie => movie.statusId == this.statusId);       
        this.moviesList = this.moviesList.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
      }
      
      else this.moviesList = movies.filter(movie => movie.isFirst == true).sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);

      this.pagedList = this.isDesktop ? this.moviesList.slice(0, 8) : this.moviesList.slice(0, 6);
      this.length = this.moviesList.length;

    });
  }

  OnPageChange(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedList = this.moviesList.slice(startIndex, endIndex);
  }

  showDetailsMovie(movieSelected: Movie) {
    this.listPartsByParentFilmKey = this.allMovies
    .filter(movie => (movie.key == movieSelected.key) || (movie.parentFilmKey == movieSelected.key))
    .sort((n1, n2) => n1.priority - n2.priority);

    const dialogRef = this.dialogService.open(MovieDetailsWithPartsDesktopComponent, {width: '600px'});
    dialogRef.componentInstance.movie = movieSelected;
    dialogRef.componentInstance.allMovies = this.allMovies;
    dialogRef.componentInstance.listPartsByParentFilmKey = this.listPartsByParentFilmKey;
  }

  newMovie() {
    const dialogRef = this.dialogService.open(MovieFormDesktopComponent, {width: '500px', data: {movie: {}}});
    dialogRef.componentInstance.arrayMovies = this.moviesListCopie;
    dialogRef.componentInstance.allMovies = this.allMovies;
  }

  editMovie(movie?: Movie) {
    const dialogRef = this.dialogService.open(MovieFormDesktopComponent, {width: '500px'});
    dialogRef.componentInstance.movie = movie;
    dialogRef.componentInstance.allMovies = this.allMovies;
  }

  deleteMovie(movieId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this movie!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.movieService.delete(movieId);
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

  sortByRefMovieDesc() {
    this.pagedList = this.moviesList.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
    this.sortByDesc = true;

    this.pagedList = this.isDesktop ? this.moviesList.slice(0, 8) : this.moviesList.slice(0, 6);
    this.length = this.moviesList.length;
  }

  sortByRefMovieAsc() {
    this.pagedList = this.moviesList.sort((n1, n2) => n1.numRefMovie - n2.numRefMovie);
    this.sortByDesc = false;

    this.pagedList = this.isDesktop ? this.moviesList.slice(0, 8) : this.moviesList.slice(0, 6);
    this.length = this.moviesList.length;
  }
  
  ngOnDestroy() {
    this.subscriptionForGetAllMovies.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }

}