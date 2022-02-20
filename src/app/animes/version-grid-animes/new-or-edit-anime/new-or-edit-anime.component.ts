import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { AnimeService } from 'src/app/shared/services/anime.service';

import { Anime } from 'src/app/shared/models/anime.model';

@Component({
  selector: 'new-or-edit-anime',
  templateUrl: './new-or-edit-anime.component.html',
  styleUrls: ['./new-or-edit-anime.scss']
})

export class NewOrEditAnimeComponent implements OnInit {

  basePath = '/PicturesAnimes';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;
  modalRef: any;

  anime: Anime = new Anime();

  statusAnimes: StatusAnimes[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  constructor(
      public modalService: NgbModal, 
      private fireStorage: AngularFireStorage,
      private animeService: AnimeService 
  ) {}

  ngOnInit() {
    if (!this.anime.key) {
      this.anime.date = moment().format('YYYY-MM-DD');
      this.anime.time = moment().format('HH:mm');
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
}

export interface StatusAnimes {
  id: number,
  status: string
}
