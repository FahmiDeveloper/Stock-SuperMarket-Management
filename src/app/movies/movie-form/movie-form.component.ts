import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { MovieService } from 'src/app/shared/services/movie.service';

import { Movie } from 'src/app/shared/models/movie.model';

@Component({
  selector: 'app-movie-form',
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.scss']
})
export class MovieFormComponent implements OnInit {

  basePath = '/PicturesMovies';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  movie: Movie = new Movie();

  statusMovies: StatusMovies[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  modalRef: any;

  constructor(
    private movieService: MovieService, 
    private fireStorage: AngularFireStorage
  ) {}

  ngOnInit() {
    if (!this.movie.key) {
      this.movie.date = moment().format('YYYY-MM-DD');
      this.movie.time = moment().format('HH:mm');
    }
  }

  save(movie) {
    if (!movie.path) movie.path = "";
    if (this.movie.key) {
      this.movieService.update(this.movie.key, movie);
      Swal.fire(
        'Movie data has been Updated successfully',
        '',
        'success'
      )
    } else {
      this.movieService.create(movie);
      Swal.fire(
      'New Movie added successfully',
      '',
      'success'
      )
    }
    this.modalRef.close();
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
}

export interface StatusMovies {
  id: number,
  status: string
}
