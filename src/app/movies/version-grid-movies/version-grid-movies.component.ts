import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { NewOrEditMovieComponent } from './new-or-edit-movie/new-or-edit-movie.component';
import { ShowMoviePictureComponent } from '../show-movie-picture/show-movie-picture.component';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MovieService } from 'src/app/shared/services/movie.service';
import { UsersListService } from 'src/app/shared/services/list-users.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Movie, StatusMovies } from 'src/app/shared/models/movie.model';


@Component({
  selector: 'app-version-grid-movies',
  templateUrl: './version-grid-movies.component.html',
  styleUrls: ['./version-grid-movies.component.scss']
})

export class VersionGridMoviesComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Movie>();
  dataSourceCopie = new MatTableDataSource<Movie>();
  displayedColumns: string[] = ['picture', 'name', 'date', 'status', 'note', 'star'];

  queryName: string = "";
  queryNote: string = "";
  statusId: number;
  sortByDesc: boolean = true;

  subscriptionForGetAllMovies: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  statusMovies: StatusMovies[] = [
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
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.getAllMovies();
    this.getRolesUser();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllMovies() {
    this.subscriptionForGetAllMovies = this.movieService
    .getAll()
    .subscribe(movies => {
      this.dataSourceCopie.data = movies.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);

      if (this.queryName) {
        this.dataSource.data = movies.filter(movie => movie.nameMovie.toLowerCase().includes(this.queryName.toLowerCase()));
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
      }
      
      else if (this.queryNote) {
        this.dataSource.data = movies.filter(movie => movie.note.toLowerCase().includes(this.queryNote.toLowerCase()));
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
      }
      
      else if (this.statusId) {
        this.dataSource.data = movies.filter(movie => movie.statusId == this.statusId);   
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
      }
      
      else this.dataSource.data = movies.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);

      this.getStatusMovie();
    });
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

  newMovie() {
    const dialogRef = this.dialogService.open(NewOrEditMovieComponent, {
      width: '98vw',
      height:'73vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.arrayMovies = this.dataSourceCopie.data;
    dialogRef.componentInstance.modalRef = dialogRef;
  }

  editMovie(movie?: Movie) {
    const dialogRef = this.dialogService.open(NewOrEditMovieComponent, {
      width: '98vw',
      height:'73vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.movie = movie;
    dialogRef.componentInstance.modalRef = dialogRef;
  }

  getStatusMovie() {
    this.dataSource.data.forEach(element=>{
      this.statusMovies.forEach(statusMovie => {
        if (statusMovie.id == element.statusId) {
          element.status = statusMovie.status;
          element.note = element.note ? element.note : '-';
        }
      })
    })
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

  ngOnDestroy() {
    this.subscriptionForGetAllMovies.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }

}