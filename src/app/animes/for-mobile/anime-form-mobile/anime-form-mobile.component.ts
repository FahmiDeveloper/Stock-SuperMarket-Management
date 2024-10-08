import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import Swal from 'sweetalert2';

import { AnimeService } from 'src/app/shared/services/anime.service';

import { Anime, StatusAnimes } from 'src/app/shared/models/anime.model';

@Component({
  selector: 'anime-form-mobile',
  templateUrl: './anime-form-mobile.component.html',
  styleUrls: ['./anime-form-mobile.scss']
})

export class AnimeFormMobileComponent implements OnInit {

  arrayAnimes: Anime[] = [];
  seasonAnimesListJap: Anime[] = [];
  seasonAnimesListEng: Anime[] = [];
  allAnimes: Anime[] = [];

  anime: Anime = new Anime();

  parentAnimeNameJap = '';
  parentAnimeNameEng = '';

  basePath = '/PicturesAnimes';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  formControl = new FormControl('', [Validators.required]);

  statusAnimes: StatusAnimes[] = [
    { id: 1, status: 'On hold' },
    { id: 2, status: 'Not yet downloaded' },
    { id: 3, status: 'Watched' },
    { id: 4, status: 'Downloaded but not yet watched' },
    { id: 5, status: 'Will be looked for' }
  ];

  constructor(
    private animeService: AnimeService,
    private fireStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<AnimeFormMobileComponent>,
    public dialogService: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Anime[]
  ) { }

  ngOnInit() {
    this.seasonAnimesListJap = this.allAnimes.filter(anime => anime.priority && anime.priority == 1 && anime.nameAnime !== '-').sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
    this.seasonAnimesListEng = this.allAnimes.filter(anime => anime.priority && anime.priority == 1 && anime.nameAnime == '-' && anime.nameAnimeEng !== '-').sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);

    if (this.anime.key) {
      if (this.seasonAnimesListJap.find(anime => anime.key == this.anime.parentAnimeKey)) {
        this.parentAnimeNameJap = this.seasonAnimesListJap.find(anime => anime.key == this.anime.parentAnimeKey).nameAnime;
      }
      if (this.seasonAnimesListEng.find(anime => anime.key == this.anime.parentAnimeKey)) {
        this.parentAnimeNameEng = this.seasonAnimesListEng.find(anime => anime.key == this.anime.parentAnimeKey).nameAnimeEng;
      }
    }
  }

  filterByParentNameJap(animeName: string) {
    if (animeName) {
      this.seasonAnimesListJap = this.allAnimes
        .filter(anime => anime.nameAnime.toLowerCase().includes(animeName.toLowerCase()) && anime.priority && anime.priority == 1 && anime.nameAnime !== '-')
        .sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
    } else {
      this.seasonAnimesListJap = this.allAnimes
        .filter(anime => anime.priority && anime.priority == 1 && anime.nameAnime !== '-')
        .sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
    }
  }

  filterByParentNameEng(animeName: string) {
    if (animeName) {
      this.seasonAnimesListEng = this.allAnimes
        .filter(anime => anime.nameAnimeEng.toLowerCase().includes(animeName.toLowerCase()) && anime.priority && anime.priority == 1 && anime.nameAnime == '-' && anime.nameAnimeEng !== '-')
        .sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
    } else {
      this.seasonAnimesListEng = this.allAnimes
        .filter(anime => anime.priority && anime.priority == 1 && anime.nameAnime == '-' && anime.nameAnimeEng !== '-')
        .sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
    }
  }

  getParentAnimeKeyJap(animeKey: string) {
    if (this.seasonAnimesListJap.find(anime => anime.key == animeKey)) {
      this.parentAnimeNameJap = this.seasonAnimesListJap.find(anime => anime.key == animeKey).nameAnime;
    }
    this.anime.parentAnimeKey = animeKey;
  }

  getParentAnimeKeyEng(animeKey: string) {
    if (this.seasonAnimesListEng.find(anime => anime.key == animeKey)) {
      this.parentAnimeNameEng = this.seasonAnimesListEng.find(anime => anime.key == animeKey).nameAnimeEng;
    }
    this.anime.parentAnimeKey = animeKey;
  }

  save() {
    if (!this.anime.notLiked || this.anime.statusId !== 3) { this.anime.notLiked = false; }
    if (this.anime.key) {
      this.animeService.update(this.anime.key, this.anime);
      Swal.fire(
        'Anime data has been updated successfully',
        '',
        'success'
      )
    } else {
      if (this.arrayAnimes[0].numRefAnime) this.anime.numRefAnime = this.arrayAnimes[0].numRefAnime + 1;
      if (!this.anime.isFirst) this.anime.isFirst = false;

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
      this.task = this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.anime.imageUrl = url;
        Swal.fire(
          'Picture has been uploaded successfully',
          '',
          'success'
        )
      });  // <<< url is found here

    } else {
      alert('No images selected');
      this.anime.imageUrl = '';
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' : '';
  }

  close() {
    this.dialogRef.close();
  }

}