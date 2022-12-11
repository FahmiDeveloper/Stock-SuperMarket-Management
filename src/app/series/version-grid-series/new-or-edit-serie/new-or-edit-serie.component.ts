import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import * as moment from 'moment';
import Swal from 'sweetalert2';

import { SerieService } from 'src/app/shared/services/serie.service';

import { Serie, StatusSeries } from 'src/app/shared/models/serie.model';

@Component({
  selector: 'new-or-edit-serie',
  templateUrl: './new-or-edit-serie.component.html',
  styleUrls: ['./new-or-edit-serie.scss']
})

export class NewOrEditSerieComponent implements OnInit {

  arraySeries: Serie[];
  allSeries: Serie[];
  listSeriesByNameForCreate: Serie[];
  listSeriesByNameForUpdate: Serie[];

  serie: Serie = new Serie();

  firstSeriePriority: number;
  fromModalSeasonsSeriesList: boolean;

  basePath = '/PicturesSeries';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

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
      public dialogRef: MatDialogRef<NewOrEditSerieComponent>,
      @Inject(MAT_DIALOG_DATA) public data: Serie
  ) {}

  ngOnInit() {
    if (!this.serie.key) {
      this.serie.date = moment().format('YYYY-MM-DD');
      this.serie.time = moment().format('HH:mm');
    }
    if (this.serie.key) this.firstSeriePriority = this.serie.priority;
  }

  save() {
    if (!this.serie.path) this.serie.path = "";
    if (this.serie.key) {
      if (this.fromModalSeasonsSeriesList == true) {
        this.listSeriesByNameForUpdate = this.allSeries
        .filter(serie => (serie.nameSerie.toLowerCase().includes(this.serie.nameSerie.toLowerCase())) && (serie.priority == this.serie.priority))
        .sort((n1, n2) => n1.priority - n2.priority);
  
        this.listSeriesByNameForUpdate.forEach(element => {
          if (element.key !== this.serie.key) {
            element.priority = this.firstSeriePriority;
            this.serieService.update(element.key, element);
          }
        })
      }
      this.serieService.update(this.serie.key, this.serie);
      Swal.fire(
        'Serie data has been Updated successfully',
        '',
        'success'
      )
    } else {
      if (this.arraySeries[0].numRefSerie) this.serie.numRefSerie = this.arraySeries[0].numRefSerie + 1;

      this.listSeriesByNameForCreate = this.allSeries.filter(serie => (serie.nameSerie.toLowerCase().includes(this.serie.nameSerie.toLowerCase()))).sort((n1, n2) => n1.priority - n2.priority);

      for (let j = 0; j < this.listSeriesByNameForCreate.length; j++) {
        if (this.listSeriesByNameForCreate[j].priority >= this.serie.priority)
        this.listSeriesByNameForCreate[j].priority = this.listSeriesByNameForCreate[j].priority + 1;
        this.serieService.update(this.listSeriesByNameForCreate[j].key, this.listSeriesByNameForCreate[j]);
      }

      this.serieService.create(this.serie);
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
