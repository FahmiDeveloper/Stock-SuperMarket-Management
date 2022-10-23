import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import * as moment from 'moment';
import Swal from 'sweetalert2';

import { SerieService } from 'src/app/shared/services/serie.service';

import { Serie, StatusSeries } from 'src/app/shared/models/serie.model';

@Component({
  selector: 'app-serie-form',
  templateUrl: './serie-form.component.html',
  styleUrls: ['./serie-form.component.scss']
})

export class SerieFormComponent implements OnInit {

  serie: Serie = new Serie();
  arraySeries: Serie[];

  basePath = '/PicturesSeries';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;
  modalRef: any;
  nbrsList: number[] = [];

  statusSeries: StatusSeries[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  formControl = new FormControl('', [Validators.required]);

  constructor(
    private serieService: SerieService, 
    private fireStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<SerieFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Serie
  ) {}

  ngOnInit() {
    if (!this.serie.key) {
      this.serie.date = moment().format('YYYY-MM-DD');
      this.serie.time = moment().format('HH:mm');
    }
    for (let i = 1; i <= 100; i++) {
      this.nbrsList.push(i);
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
      if (this.arraySeries[0].numRefSerie) serie.numRefSerie = this.arraySeries[0].numRefSerie + 1;
      this.serieService.create(serie);
      Swal.fire(
        'New Serie added successfully',
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

      (await this.task).ref.getDownloadURL().then(url => {this.serie.imageUrl = url; });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.serie.imageUrl = '';
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :'';
  }

  close() {
    this.dialogRef.close();
  }
}
