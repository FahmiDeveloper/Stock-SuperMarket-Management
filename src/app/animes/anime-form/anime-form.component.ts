import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import * as moment from 'moment';
import Swal from 'sweetalert2';

import { AnimeService } from 'src/app/shared/services/anime.service';

import { Anime, StatusAnimes } from 'src/app/shared/models/anime.model';
import { element } from 'protractor';

@Component({
  selector: 'app-anime-form',
  templateUrl: './anime-form.component.html',
  styleUrls: ['./anime-form.component.scss']
})

export class AnimeFormComponent implements OnInit {

  arrayAnimes: Anime[];
  allAnimes: Anime[];
  listAnimesByNameForCreate: Anime[];
  listAnimesByNameForUpdate: Anime[];

  anime: Anime = new Anime();

  firstAnimePriority: number;
  fromModalSeasonsMoviesList: boolean;

  basePath = '/PicturesAnimes';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  statusAnimes: StatusAnimes[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  formControl = new FormControl('', [Validators.required]);

  constructor(
    private animeService: AnimeService, 
    private fireStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<AnimeFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Anime
  ) {}

  ngOnInit() {
    if (!this.anime.key) {
      this.anime.date = moment().format('YYYY-MM-DD');
      this.anime.time = moment().format('HH:mm');
    }
    if (this.anime.key) this.firstAnimePriority = this.anime.priority;
  }

  save() {
    if (!this.anime.path) this.anime.path = "";
    if (this.anime.key) {
      if (this.fromModalSeasonsMoviesList == true) {
        this.listAnimesByNameForUpdate = this.allAnimes
        .filter(anime => (anime.nameAnime.toLowerCase().includes(this.anime.nameAnime.toLowerCase())) && (anime.priority == this.anime.priority))
        .sort((n1, n2) => n1.priority - n2.priority);
  
        this.listAnimesByNameForUpdate.forEach(element => {
          if (element.key !== this.anime.key) {
            element.priority = this.firstAnimePriority;
            this.animeService.update(element.key, element);
          }
        })
      }
      
      this.animeService.update(this.anime.key, this.anime);
      Swal.fire(
        'Anime data has been Updated successfully',
        '',
        'success'
      )
    }
    else {
      if (this.arrayAnimes[0].numRefAnime) this.anime.numRefAnime = this.arrayAnimes[0].numRefAnime + 1;

      this.listAnimesByNameForCreate = this.allAnimes.filter(anime => (anime.nameAnime.toLowerCase().includes(this.anime.nameAnime.toLowerCase()))).sort((n1, n2) => n1.priority - n2.priority);

      for (let j = 0; j < this.listAnimesByNameForCreate.length; j++) {
        if (this.listAnimesByNameForCreate[j].priority >= this.anime.priority)
        this.listAnimesByNameForCreate[j].priority = this.listAnimesByNameForCreate[j].priority + 1;
        this.animeService.update(this.listAnimesByNameForCreate[j].key, this.listAnimesByNameForCreate[j]);
      }

      this.animeService.create(this.anime);
      Swal.fire(
        'New Anime added successfully',
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

      (await this.task).ref.getDownloadURL().then(url => {this.anime.imageUrl = url; });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.anime.imageUrl = '';
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :'';
  }

  close() {
    this.dialogRef.close();
  }
  
}
