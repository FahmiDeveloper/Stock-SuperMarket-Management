import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  allMovies: Movie[];
  listMoviesByNameForCreate: Movie[];
  listMoviesByNameForUpdate: Movie[];

  movie: Movie = new Movie();
  
  firstMoviePriority: number;
  fromModalPartsList: boolean;
  selectedYear: number;
  years: number[] = [];

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
    @Inject(MAT_DIALOG_DATA) public data: Movie
  ) {}

  ngOnInit() {
    if (!this.movie.key) {
      this.movie.date = moment().format('YYYY-MM-DD');
      this.movie.time = moment().format('HH:mm');
    }

    this.selectedYear = new Date().getFullYear() + 2;
    for (let year = this.selectedYear; year >= 1990; year--) {
      this.years.push(year);
    }

    if (this.movie.key) this.firstMoviePriority = this.movie.priority;
  }

  save() {
    if (!this.movie.path) this.movie.path = "";
    if (!this.movie.fullNameMovie) this.movie.fullNameMovie = "";
    if (this.movie.key) {
      if (this.fromModalPartsList == true) {
        this.listMoviesByNameForUpdate = this.allMovies
        .filter(movie => (movie.nameMovie.toLowerCase().includes(this.movie.nameMovie.toLowerCase())) && (movie.priority == this.movie.priority))
        .sort((n1, n2) => n1.priority - n2.priority);
  
        this.listMoviesByNameForUpdate.forEach(element => {
          if (element.key !== this.movie.key) {
            element.priority = this.firstMoviePriority;
            this.movieService.update(element.key, element);
          }
        })
      }

      this.movieService.update(this.movie.key, this.movie);
      Swal.fire(
        'Movie data has been Updated successfully',
        '',
        'success'
      )
    } else {
      if (this.arrayMovies[0].numRefMovie) this.movie.numRefMovie = this.arrayMovies[0].numRefMovie + 1;

      this.listMoviesByNameForCreate = this.allMovies.filter(movie => (movie.nameMovie.toLowerCase().includes(this.movie.nameMovie.toLowerCase()))).sort((n1, n2) => n1.priority - n2.priority);

      for (let j = 0; j < this.listMoviesByNameForCreate.length; j++) {
        if (this.listMoviesByNameForCreate[j].priority >= this.movie.priority)
        this.listMoviesByNameForCreate[j].priority = this.listMoviesByNameForCreate[j].priority + 1;
        this.movieService.update(this.listMoviesByNameForCreate[j].key, this.listMoviesByNameForCreate[j]);
      }

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

      (await this.task).ref.getDownloadURL().then(url => {this.movie.imageUrl = url; });  // <<< url is found here

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