import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Movie } from 'src/app/shared/models/movie.model';
import { MovieService } from 'src/app/shared/services/movie.service';

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

  constructor(
    private movieService: MovieService, 
    public userService: UserService,
    public authService: AuthService
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

  ngOnDestroy() {
    this.subscriptionForGetAllMovies.unsubscribe();
  }

}
