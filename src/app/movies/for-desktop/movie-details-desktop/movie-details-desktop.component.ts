import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { MovieFormDesktopComponent } from '../movie-form-desktop/movie-form-desktop.component';

import { MovieService } from 'src/app/shared/services/movie.service';

import { Movie, StatusMovies } from 'src/app/shared/models/movie.model';

@Component({
  selector: 'movie-details-desktop',
  templateUrl: './movie-details-desktop.component.html',
  styleUrls: ['./movie-details-desktop.scss']
})

export class MovieDetailsDesktopComponent implements OnInit {

  allMovies: Movie[];

  movie: Movie = new Movie();

  parent: any;

  statusMovies: StatusMovies[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  constructor(
    private movieService: MovieService, 
    public dialogRef: MatDialogRef<MovieDetailsDesktopComponent>,
    public dialogService: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Movie
  ) {}

  ngOnInit() {}

  editMovie(movie?: Movie) {
    const dialogRef = this.dialogService.open(MovieFormDesktopComponent, {width: '500px'});
    dialogRef.componentInstance.movie = movie;
    dialogRef.componentInstance.allMovies = this.allMovies;
    dialogRef.componentInstance.pagedList = this.parent.pagedList;

    dialogRef.afterClosed().subscribe(res => {
      this.parent.pagedList = res;
    });
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
        this.dialogRef.close();
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