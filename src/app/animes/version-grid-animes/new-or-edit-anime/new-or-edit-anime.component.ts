import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import * as moment from 'moment';
import Swal from 'sweetalert2';

import { AnimeService } from 'src/app/shared/services/anime.service';

import { Anime, StatusAnimes } from 'src/app/shared/models/anime.model';

@Component({
  selector: 'new-or-edit-anime',
  templateUrl: './new-or-edit-anime.component.html',
  styleUrls: ['./new-or-edit-anime.scss']
})

export class NewOrEditAnimeComponent implements OnInit {

  anime: Anime = new Anime();
  arrayAnimes: Anime[];

  basePath = '/PicturesAnimes';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;
  modalRef: any;
  nbrsList: number[] = [];

  formControl = new FormControl('', [Validators.required]);

  statusAnimes: StatusAnimes[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  constructor(
      private fireStorage: AngularFireStorage,
      private animeService: AnimeService 
  ) {}

  ngOnInit() {
    if (!this.anime.key) {
      this.anime.date = moment().format('YYYY-MM-DD');
      this.anime.time = moment().format('HH:mm');
    }
    for (let i = 1; i <= 100; i++) {
      this.nbrsList.push(i);
    }
  }

  save(anime) {
    if (!anime.path) anime.path = "";
    if (this.anime.key) {
      this.animeService.update(this.anime.key, anime);
      Swal.fire(
        'Anime data has been Updated successfully',
        '',
        'success'
      )
    } else {
      if (this.arrayAnimes[0].numRefAnime) anime.numRefAnime = this.arrayAnimes[0].numRefAnime + 1;
      this.animeService.create(anime);
      Swal.fire(
      'New Anime added successfully',
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

      (await this.task).ref.getDownloadURL().then(url => {this.anime.imageUrl = url; });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.anime.imageUrl = '';
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :'';
  }
}
