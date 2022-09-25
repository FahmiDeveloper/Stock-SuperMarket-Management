import { Component, Input, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';

import { SerieService } from 'src/app/shared/services/serie.service';

import { Serie } from 'src/app/shared/models/serie.model';

@Component({
  selector: 'show-serie-picture',
  templateUrl: './show-serie-picture.component.html',
  styleUrls: ['./show-serie-picture.component.scss']
})

export class ShowSeriePictureComponent implements OnInit {

  @Input() serie: Serie = new Serie();

  serieForModal: Serie = new Serie();

  pictureSerie: string;
  basePath = '/PicturesSeries';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;
  isMobile: boolean;
  dialogRef: any;

  constructor(
    public modalService: NgbModal, 
    private fireStorage: AngularFireStorage, 
    private serieService: SerieService,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
  }

  async onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.pictureSerie = this.serie.imageUrl = url;
        this.serieService.update(this.serie.key, this.serie);
        this.modalService.dismissAll();
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.pictureSerie = '';
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
