import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryService } from 'src/app/shared/services/category.service';
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
  subscriptionForGetCategoryName: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  categories$;
  categoryId: string;

  isGrid: boolean = false;

  constructor(
    private movieService: MovieService, 
    private categoryService: CategoryService,
    public userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getAllMovies();
    this.getRolesUser();
    this.loadListCategories();
    this.isGrid = true;
  }

  getAllMovies() {
    this.subscriptionForGetAllMovies = this.movieService
      .getAll()
      .subscribe(movies => {
        this.filteredMovies = this.movies = movies;
        this.getCategoryName();
    });
  }

  getCategoryName() {
    this.filteredMovies.forEach(element=>{
      this.subscriptionForGetCategoryName =  this.categoryService
      .getCategoryId(String(element.categoryId))
      .valueChanges()
      .subscribe(category => {   
        if(category.name) element.nameCategory = category.name;
      });
    })
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

  loadListCategories() {
    this.categories$ = this.categoryService.getAll();
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

 filetrByCategory() {
   this.filteredMovies = (this.categoryId)
       ? this.movies.filter(element=>element.categoryId==this.categoryId)
       : this.movies;
 }

  ngOnDestroy() {
    this.subscriptionForGetAllMovies.unsubscribe();
    this.subscriptionForGetCategoryName.unsubscribe();
  }

}
