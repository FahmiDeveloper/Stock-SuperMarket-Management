import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { SerieService } from 'src/app/shared/services/serie.service';
import { Serie } from 'src/app/shared/models/serie.model';

@Component({
  selector: 'app-serie-form',
  templateUrl: './serie-form.component.html',
  styleUrls: ['./serie-form.component.scss']
})

export class SerieFormComponent implements OnInit {

  basePath = '/PicturesSeries';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;
  modalRef: any;

  serie: Serie = new Serie();

  statusSeries: StatusSeries[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  constructor(
    private serieService: SerieService, 
    private fireStorage: AngularFireStorage
  ) {}

  ngOnInit() {
    if (!this.serie.key) {
      this.serie.date = moment().format('YYYY-MM-DD');
      this.serie.time = moment().format('HH:mm');
    }  
  }

  save(serie) {
    if (!serie.path) serie.path = "";
    if (this.serie.key) {
      this.serieService.update(this.serie.key, serie);
      Swal.fire(
        'Serie data has been Updated successfully',
        '',
        'success'
      )
    }
    else {
      this.serieService.create(serie);
      Swal.fire(
        'New Serie added successfully',
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

      (await this.task).ref.getDownloadURL().then(url => {this.serie.imageUrl = url; });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.serie.imageUrl = '';
    }
  }
}

export interface StatusSeries {
  id: number,
  status: string
}
