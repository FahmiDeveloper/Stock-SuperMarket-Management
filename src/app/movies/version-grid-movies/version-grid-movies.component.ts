import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NewOrEditMovieComponent } from './new-or-edit-movie/new-or-edit-movie.component';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { MovieService } from 'src/app/shared/services/movie.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Movie } from 'src/app/shared/models/movie.model';

@Component({
  selector: 'app-version-grid-movies',
  templateUrl: './version-grid-movies.component.html',
  styleUrls: ['./version-grid-movies.component.scss']
})

export class VersionGridMoviesComponent implements OnInit, OnDestroy {

  filteredMovies: Movie[];
  p: number = 1;
  isGrid: boolean = false;
  // queryDate: string = "";
  statusId: number;
  modalRefSearch: any;
  queryName: string = "";
  queryNote: string = "";

  user: FirebaseUserModel = new FirebaseUserModel();

  subscriptionForGetAllMovies: Subscription;
  subscriptionForUser: Subscription;

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
      if (this.queryName) 
      this.filteredMovies = movies.filter(movie => movie.nameMovie.toLowerCase().includes(this.queryName.toLowerCase()));
      
      else if (this.queryNote) 
      this.filteredMovies = movies.filter(movie => movie.note.toLowerCase().includes(this.queryNote.toLowerCase()));
      
      // else if (this.queryDate) 
      // this.filteredMovies = movies.filter(movie => movie.date.includes(this.queryDate));
      
      else if (this.statusId) 
      this.filteredMovies = movies.filter(movie => movie.statusId == this.statusId);   
      
      else this.filteredMovies = movies;

      this.getStatusMovie();
      if (this.queryName || this.queryNote || this.statusId) this.modalRefSearch.close();
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

  clear() {
    this.queryName = "";
    this.queryNote = "";
    // this.queryDate = "";
    this.statusId = null;
    this.getAllMovies();
    this.modalRefSearch.close();
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

  openModalSearch(contentModalSearch) {
    this.modalRefSearch = this.modalService.open(contentModalSearch as Component, { size: 'lg', centered: true });
  }

  ngOnDestroy() {
    this.subscriptionForGetAllMovies.unsubscribe();
    this.subscriptionForUser.unsubscribe();
  }
}

export interface StatusMovies {
  id: number,
  status: string
}

