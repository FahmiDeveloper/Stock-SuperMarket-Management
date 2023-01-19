import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import * as moment from 'moment';
import Swal from 'sweetalert2';

import { MovieService } from 'src/app/shared/services/movie.service';

import { Movie, StatusMovies } from 'src/app/shared/models/movie.model';

@Component({
  selector: 'movie-form-desktop',
  templateUrl: './movie-form-desktop.component.html',
  styleUrls: ['./movie-form-desktop.scss']
})

export class MovieFormDesktopComponent implements OnInit {

  arrayMovies: Movie[];
  partMoviesList: Movie[] = [];
  allMovies: Movie[];

  movie: Movie = new Movie();

  parentFilmName: string;
  
  basePath = '/PicturesMovies';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  formControl = new FormControl('', [Validators.required]);

  statusMovies: StatusMovies[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  constructor(
    private movieService: MovieService, 
    private fireStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<MovieFormDesktopComponent>,
    public dialogService: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Movie
  ) {}

  ngOnInit() {
    this.partMoviesList = this.allMovies
    .filter(movie => movie.isFirst == true && movie.part && movie.part == 1)
    .sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);

    if (!this.movie.key) {
      this.movie.date = moment().format('YYYY-MM-DD');
    }

    if (this.movie.key) {
      if (this.partMoviesList.find(movie => movie.key == this.movie.parentFilmKey)) {
        this.parentFilmName = this.partMoviesList.find(movie => movie.key == this.movie.parentFilmKey).nameMovie;
      }
    }
  }

  filterByParentName(movieName: string) {
    if (movieName) {
      this.partMoviesList = this.allMovies
      .filter(movie => movie.nameMovie.toLowerCase().includes(movieName.toLowerCase()) && movie.isFirst == true && movie.part && movie.part == 1)
      .sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
    } else {
      this.partMoviesList = this.allMovies
      .filter(movie => movie.isFirst == true && movie.part && movie.part == 1)
      .sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
    }
  }

  getParentFilmKey(movieKey: string) {
    if (this.partMoviesList.find(movie => movie.key == movieKey)) {
      this.parentFilmName = this.partMoviesList.find(movie => movie.key == movieKey).nameMovie;
    }
    this.movie.parentFilmKey = movieKey;
  }

  save() {
    if (!this.movie.notLiked || this.movie.statusId !== 3) {this.movie.notLiked = false;}
    if (this.movie.key) {
      this.movieService.update(this.movie.key, this.movie);
      Swal.fire(
        'Movie data has been Updated successfully',
        '',
        'success'
      )
    } else {
      if (this.arrayMovies[0].numRefMovie) this.movie.numRefMovie = this.arrayMovies[0].numRefMovie + 1;
      if (!this.movie.isFirst) this.movie.isFirst = false;

      this.movieService.create(this.movie);
      Swal.fire(
      'New Movie added successfully',
      '',
      'success'
      )
    }
    this.close();
  }

  async onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.movie.imageUrl = url;
        Swal.fire(
          'Picture has been uploaded successfully',
          '',
          'success'
        )
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.movie.imageUrl = '';
    }
  } 

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :'';
  }

  close() {
    this.dialogRef.close();
  }

}