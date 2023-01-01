import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as moment from 'moment';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MovieService } from 'src/app/shared/services/movie.service';
import { UsersListService } from 'src/app/shared/services/list-users.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Movie, StatusMovies } from 'src/app/shared/models/movie.model';

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
  listPartsByCurrentName: Movie[] = [];

  newMovie: Movie = new Movie();
  selectedMovie: Movie = new Movie();

  movieName: string = '';
  statusId: number;
  sortByDesc: boolean = true;
  currentName: string = '';
  getDetailsMovie: boolean = false;
  editButtonClick: boolean = false;
  clickNewMovie: boolean = false;

  basePath = '/PicturesMovies';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  length: number = 0;
  pageSize: number = 6;
  pageSizeOptions: number[] = [6];

  subscriptionForGetAllMovies: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  statusMovies: StatusMovies[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 5, status: 'To search about it'}
  ];

  allStatusMovies: StatusMovies[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  constructor(
    private movieService: MovieService, 
    public userService: UserService,
    public usersListService: UsersListService,
    public authService: AuthService,
    private fireStorage: AngularFireStorage
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
    this.getDetailsMovie = false;
    this.clickNewMovie = false;

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

      this.getStatusMovie();
    });
  }

  getStatusMovie() {
    this.moviesList.forEach(element=>{
      this.statusMovies.forEach(statusMovie => {
        if (statusMovie.id == element.statusId) {
          element.status = statusMovie.status;
        }
      })
    })
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

  showDetailsMovie(movie: Movie) {
    this.getDetailsMovie = true;
    this.editButtonClick = false;
    this.selectedMovie = movie;
    this.allStatusMovies.forEach(statusMovie => {
      if (statusMovie.id == this.selectedMovie.statusId) {
        this.selectedMovie.status = statusMovie.status;
      }
    })
    this.listPartsByCurrentName = this.allMovies.filter(movie => (movie.nameMovie.toLowerCase() == (this.selectedMovie.nameMovie.toLowerCase()))).sort((n1, n2) => n1.priority - n2.priority);;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  getPartMovieSelected(moviePartSelected: Movie) {
    this.selectedMovie = moviePartSelected;
    this.allStatusMovies.forEach(statusMovie => {
      if (statusMovie.id == this.selectedMovie.statusId) {
        this.selectedMovie.status = statusMovie.status;
      }
    })
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  addNewMovie() {
    this.clickNewMovie = true;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  saveNewMovie() {
    this.newMovie.date = moment().format('YYYY-MM-DD');
    if (this.allMovies[0].numRefMovie) this.newMovie.numRefMovie = this.allMovies[0].numRefMovie + 1;
    this.movieService.create(this.newMovie);
    this.clickNewMovie = false;
    this.getDetailsMovie = false;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    Swal.fire(
    'New Movie added successfully',
    '',
    'success'
    ).then((result) => {
      if (result.value) {
        this.newMovie.nameMovie = '';
        if (this.newMovie.fullNameMovie) this.newMovie.fullNameMovie = '';
        if (this.newMovie.isFirst) this.newMovie.isFirst = false;
        this.newMovie.year = null;
        this.newMovie.statusId = null;
        if (this.newMovie.part) this.newMovie.part = null;
        if (this.newMovie.priority) this.newMovie.priority = null;
        if (this.newMovie.path) this.newMovie.path = '';
        if (this.newMovie.note) this.newMovie.note = '';
        if (this.newMovie.imageUrl) this.newMovie.imageUrl = '';
      }
    })
  }

  cancelFromNewMovie() {
    this.clickNewMovie = false;
    this.getDetailsMovie = false;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  async uploadPictureForCreateMovie(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.newMovie.imageUrl = url; 
        Swal.fire(
          'Picture has been uploaded successfully',
          '',
          'success'
        )
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.newMovie.imageUrl = '';
    }
  }

  editMovie() {
    this.editButtonClick = true;
  }

  save() {
    this.movieService.update(this.selectedMovie.key, this.selectedMovie);
    this.allStatusMovies.forEach(statusMovie => {
      if (statusMovie.id == this.selectedMovie.statusId) {
        this.selectedMovie.status = statusMovie.status;
      }
    })
    this.editButtonClick = false;
    Swal.fire(
      'Movie data has been Updated successfully',
      '',
      'success'
    )
  }

  cancel() {
    this.editButtonClick = false;
  }

  async uploadPictureForEditMovie(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.selectedMovie.imageUrl = url; 
        this.movieService.update(this.selectedMovie.key, this.selectedMovie);
        Swal.fire(
          'Picture has been uploaded successfully',
          '',
          'success'
        )
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.selectedMovie.imageUrl = '';
    }
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
        this.getDetailsMovie = false;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
        Swal.fire(
          'Movie has been deleted successfully',
          '',
          'success'
        )
      }
    })
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

  viewNote(movieNote: string) {
    Swal.fire({
      text: movieNote,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Close'
    });
  }

  ngOnDestroy() {
    this.subscriptionForGetAllMovies.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }

}