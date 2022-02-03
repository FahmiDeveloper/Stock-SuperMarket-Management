import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Movie } from 'src/app/shared/models/movie.model';
import { MovieService } from 'src/app/shared/services/movie.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewOrEditMovieComponent } from './new-or-edit-movie/new-or-edit-movie.component';

@Component({
  selector: 'app-version-grid-movies',
  templateUrl: './version-grid-movies.component.html',
  styleUrls: ['./version-grid-movies.component.scss']
})
export class VersionGridMoviesComponent implements OnInit {

  movies: Movie[];
  filteredMovies: Movie[];

  subscriptionForGetAllMovies: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  isGrid: boolean = false;

  queryDate: string = "";

  statusId: number;
  
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
    public authService: AuthService,
    protected modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAllMovies();
    this.getRolesUser();
    this.isGrid = true;
  }

  getAllMovies() {
    this.subscriptionForGetAllMovies = this.movieService
      .getAll()
      .subscribe(movies => {
        this.filteredMovies = this.movies = movies;
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
              this.userService
                .get(user.uid)
                .valueChanges()
                .subscribe(dataUser=>{
                  this.user = dataUser;
                });
              }
          });   
        }
    })
  }

  delete(movieId) {
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

  filter(query: string) {
    this.filteredMovies = (query)
       ? this.movies.filter(movie => movie.nameMovie.toLowerCase().includes(query.toLowerCase()))
       : this.movies;
  }

  filterByDate() {
    this.filteredMovies = (this.queryDate)
      ? this.movies.filter(product => product.date.includes(this.queryDate))
      : this.movies;
  }

  clear() {
    this.queryDate = "";
    this.getAllMovies();
  }

  newMovie() {
    const modalRef = this.modalService.open(NewOrEditMovieComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
  }

  editMovie(movie?: Movie) {
    const modalRef = this.modalService.open(NewOrEditMovieComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
    modalRef.componentInstance.movie = movie;
  }

  getStatusMovie() {
    this.filteredMovies.forEach(element=>{

      this.statusMovies.forEach(statusMovie => {
        if (statusMovie.id == element.statusId) {
             element.status = statusMovie.status;
             element.note = element.note ? element.note : '-';
        }
      })
    })
  }

  filetrByStatus(statusId: number) {
    this.filteredMovies = (statusId)
      ? this.movies.filter(movie => movie.statusId == statusId)
      : this.movies;
  }

  ngOnDestroy() {
    this.subscriptionForGetAllMovies.unsubscribe();
  }

}

export interface StatusMovies {
  id: number,
  status: string
}

