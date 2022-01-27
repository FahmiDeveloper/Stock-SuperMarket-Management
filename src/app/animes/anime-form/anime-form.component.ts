import { Component, OnInit } from '@angular/core';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { CategoryService } from 'src/app/shared/services/category.service';

import { Anime } from 'src/app/shared/models/anime.model';
import { AnimeService } from 'src/app/shared/services/anime.service';

@Component({
  selector: 'app-anime-form',
  templateUrl: './anime-form.component.html',
  styleUrls: ['./anime-form.component.scss']
})
export class AnimeFormComponent implements OnInit {

  basePath = '/PicturesAnimes';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  animeId;
  anime: Anime = new Anime();

  constructor(
    private animeService: AnimeService, 
    private fireStorage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.getAnimeData();
  }

  getAnimeData() {
    this.animeId = this.route.snapshot.paramMap.get('id');
    if (this.animeId) {
      this.animeService
        .getAnimeId(this.animeId)
        .valueChanges()
        .pipe(take(1))
        .subscribe(anime => {
          this.anime = anime;
      });
    } else {
      this.anime.date = moment().format('YYYY-MM-DD');
      this.anime.time = moment().format('HH:mm');
    }
  }

  save(anime) {
    this.animeService
      .checkIfMovieNameExistInTable(anime.nameAnime)
      .pipe(take(1))
      .subscribe((res: number) => {
          if(res) {
            Swal.fire(
              'Anime name already exist!',
              '',
              'warning'
            )
          } else {
            this.createOrUpdateAnime(anime);
          }
    })
  }

  createOrUpdateAnime(anime) {
    if (this.animeId) {
        this.animeService.update(this.animeId, anime);
        Swal.fire(
          'Anime data has been Updated successfully',
          '',
          'success'
        )
      }
      else {
        this.animeService.create(anime);
        Swal.fire(
          'New Anime added successfully',
          '',
          'success'
        )
      }
      this.router.navigate(['/animes']);
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

  cancel() {
    this.router.navigate(['/animes']);
  }

}
