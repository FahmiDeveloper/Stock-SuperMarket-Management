import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { MovieDetailsWithPartsMobileComponent } from './movie-details-with-parts-mobile/movie-details-with-parts-mobile.component';
import { MovieFormMobileComponent } from './movie-form-mobile/movie-form-mobile.component';

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { MovieService } from '../../shared/services/movie.service';
import { UsersListService } from '../../shared/services/list-users.service';

import { FirebaseUserModel } from '../../shared/models/user.model';
import { Movie, StatusMovies } from '../../shared/models/movie.model';

@Component({
  selector: 'movies-for-mobile',
  templateUrl: './movies-for-mobile.component.html',
  styleUrls: ['./movies-for-mobile.scss']
})

export class MoviesForMobileComponent implements OnInit, OnDestroy {

  moviesList: Movie[] = [];
  pagedList: Movie[]= [];
  moviesListCopie: Movie[] = [];
  allMovies: Movie[] = [];
  listPartsByParentFilmKey: Movie[] = [];

  movieName: string = '';
  statusId: number;
  sortByDesc: boolean = true;

  length: number = 0;
  pageSize: number = 6;
  pageSizeOptions: number[] = [6];

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
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
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

      this.pagedList = this.moviesList.slice(0, 6);
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
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  showDetailsMovie(movieSelected: Movie) {
    this.listPartsByParentFilmKey = this.allMovies
    .filter(movie => (movie.key == movieSelected.key) || (movie.parentFilmKey == movieSelected.key))
    .sort((n1, n2) => n1.priority - n2.priority);

    const dialogRef = this.dialogService.open(MovieDetailsWithPartsMobileComponent, {
      width: '98vw',
      height:'75vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.movie = movieSelected;
    dialogRef.componentInstance.allMovies = this.allMovies;
    dialogRef.componentInstance.listPartsByParentFilmKey = this.listPartsByParentFilmKey;
  }

  newMovie() {
    const dialogRef = this.dialogService.open(MovieFormMobileComponent, {
      width: '98vw',
      height:'75vh',
      maxWidth: '100vw', 
      data: {movie: {}}
    });
    dialogRef.componentInstance.arrayMovies = this.moviesListCopie;
    dialogRef.componentInstance.allMovies = this.allMovies;  
  }

  editMovie(movie?: Movie) {
    const dialogRef = this.dialogService.open(MovieFormMobileComponent, {
      width: '98vw',
      height:'75vh',
      maxWidth: '100vw'
    });
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

    this.pagedList = this.moviesList.slice(0, 6);
    this.length = this.moviesList.length;
  }

  sortByRefMovieAsc() {
    this.pagedList = this.moviesList.sort((n1, n2) => n1.numRefMovie - n2.numRefMovie);
    this.sortByDesc = false;

    this.pagedList = this.moviesList.slice(0, 6);
    this.length = this.moviesList.length;
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
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }

}