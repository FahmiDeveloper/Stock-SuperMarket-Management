import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';

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

  menuTopLeftPosition =  {x: '0', y: '0'} 

  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger; 

  statusMovies: StatusMovies[] = [
    {id: 1, status: 'On hold'}, 
    {id: 2, status: 'Not yet downloaded'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not yet watched'},
    {id: 5, status: 'Will be looked for'}
  ];

  constructor(
    private movieService: MovieService, 
    public dialogRef: MatDialogRef<MovieDetailsWithPartsMobileComponent>,
    public dialogService: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

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
    this.showSnackbarTopPosition();
  }

  showSnackbarTopPosition() {
    this.snackBar.open('Text copied', 'Done', {
      duration: 2000,
      verticalPosition: "bottom", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
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

  openMenuTrigger(event: MouseEvent, movie: Movie) { 
    // preventDefault avoids to show the visualization of the right-click menu of the browser 
    event.preventDefault(); 

    // we record the mouse position in our object 
    this.menuTopLeftPosition.x = event.clientX + 'px'; 
    this.menuTopLeftPosition.y = event.clientY + 'px'; 

    // we open the menu 
    // we pass to the menu the information about our object 
    this.matMenuTrigger.menuData = {movie: movie};

    // we open the menu 
    this.matMenuTrigger.openMenu(); 
  }

  close() {
    this.dialogRef.close();
  }

}