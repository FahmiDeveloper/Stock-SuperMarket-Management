import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';

import { FirebaseUserModel } from '../shared/models/user.model';

import { Movie } from '../shared/models/movie.model';
import { MovieService } from '../shared/services/movie.service';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent implements OnInit, OnDestroy {

  movies: Movie[];
  filteredMovies: Movie[];

  subscriptionForGetAllMovies: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  queryDate: string = "";

  constructor(
    private movieService: MovieService, 
    public userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getAllMovies();
    this.getRolesUser();
  }

  getAllMovies() {
    this.subscriptionForGetAllMovies = this.movieService
      .getAll()
      .subscribe(movies => {
        this.filteredMovies = this.movies = movies;
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

  ngOnDestroy() {
    this.subscriptionForGetAllMovies.unsubscribe();
  }

}
