import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';

import { MovieService } from 'src/app/shared/services/movie.service';

import { Movie } from 'src/app/shared/models/movie.model';

@Component({
  selector: 'show-movie-picture',
  templateUrl: './show-movie-picture.component.html',
  styleUrls: ['./show-movie-picture.component.scss']
})

export class ShowMoviePictureComponent implements OnInit {

  @Input() movie: Movie = new Movie();
  @Input() isGrid: boolean;

  pictureMovie: string;
  basePath = '/PicturesMovies';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;
  isMobile: boolean;

  constructor(
    public modalService: NgbModal, 
    private fireStorage: AngularFireStorage, 
    private movieService: MovieService,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
  }

  showMovieImage(contentMoviePicture) {
    this.modalService.open(contentMoviePicture, { windowClass :'viewPicture', centered: true });
    this.pictureMovie = this.movie.imageUrl;
  }

  async onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.pictureMovie = this.movie.imageUrl = url;
        this.movieService.update(this.movie.key, this.movie);
        this.modalService.dismissAll();
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.pictureMovie = '';
    }
   }
}
