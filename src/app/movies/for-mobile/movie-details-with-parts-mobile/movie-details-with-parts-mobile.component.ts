import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { MovieFormMobileComponent } from '../movie-form-mobile/movie-form-mobile.component';

import { MovieService } from 'src/app/shared/services/movie.service';

import { Movie, StatusMovies } from 'src/app/shared/models/movie.model';

@Component({
  selector: 'movie-details-with-parts-mobile',
  templateUrl: './movie-details-with-parts-mobile.component.html',
  styleUrls: ['./movie-details-with-parts-mobile.scss']
})

export class MovieDetailsWithPartsMobileComponent implements OnInit {

  listPartsByParentFilmKey: Movie[];
  allMovies: Movie[];

  movie: Movie = new Movie();

  statusMovies: StatusMovies[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  constructor(
    private movieService: MovieService, 
    public dialogRef: MatDialogRef<MovieDetailsWithPartsMobileComponent>,
    public dialogService: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Movie
  ) {}

  ngOnInit() {}

  showDetailsMovie(moviePartSelected: Movie, elem: HTMLElement) {
    this.movie = moviePartSelected;
    elem.scrollIntoView();
  }

  editMovie(movie?: Movie) {
    const dialogRef = this.dialogService.open(MovieFormMobileComponent, {
      width: '98vw',
      height:'70vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.movie = movie;
    dialogRef.componentInstance.allMovies = this.allMovies;  
  }

  deleteMovie(movieId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this movie!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.movieService.delete(movieId);
        this.listPartsByParentFilmKey.forEach((movie, index) => {
          if(movie.key === movieId) this.listPartsByParentFilmKey.splice(index,1);
        });
        if (this.listPartsByParentFilmKey.length == 0) {
          this.dialogRef.close();
        }
        else {
          this.movie = this.listPartsByParentFilmKey[0];
        }
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

  viewNote(movieNote: string) {
    Swal.fire({
      text: movieNote,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Close'
    });
  }

  followLink(path: string) {
    window.open(path);
  }

  close() {
    this.dialogRef.close();
  }

}