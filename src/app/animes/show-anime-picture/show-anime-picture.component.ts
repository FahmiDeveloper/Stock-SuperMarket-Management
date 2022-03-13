import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';

import { AnimeService } from 'src/app/shared/services/anime.service';

import { Anime } from 'src/app/shared/models/anime.model';

@Component({
  selector: 'show-anime-picture',
  templateUrl: './show-anime-picture.component.html',
  styleUrls: ['./show-anime-picture.component.scss']
})

export class ShowAnimePictureComponent implements OnInit {

  @Input() anime: Anime = new Anime();
  @Input() isGrid: boolean;

  pictureAnime: string;
  basePath = '/PicturesAnimes';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;
  isMobile: boolean;

  constructor(
    public modalService: NgbModal, 
    private fireStorage: AngularFireStorage, 
    private animeService: AnimeService,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
  }

  showAnimeImage(contentAnimePicture) {
    this.modalService.open(contentAnimePicture, { windowClass :'viewPicture', centered: true });
    this.pictureAnime = this.anime.imageUrl;
  }

  async onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.pictureAnime = this.anime.imageUrl = url;
        this.animeService.update(this.anime.key, this.anime);
        this.modalService.dismissAll();
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.pictureAnime = '';
    }
  }
}
