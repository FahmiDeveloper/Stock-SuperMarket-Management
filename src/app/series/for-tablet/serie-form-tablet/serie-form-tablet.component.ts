import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import { Observable } from 'rxjs';

import Swal from 'sweetalert2';

import { SerieService } from 'src/app/shared/services/serie.service';

import { Serie, StatusSeries } from 'src/app/shared/models/serie.model';

@Component({
  selector: 'serie-form-tablet',
  templateUrl: './serie-form-tablet.component.html',
  styleUrls: ['./serie-form-tablet.scss']
})

export class SerieFormTabletComponent implements OnInit {

  arraySeries: Serie[];
  seasonSeriesList: Serie[] = [];
  allSeries: Serie[];

  serie: Serie = new Serie();

  parentSerieName: string;
  
  basePath = '/PicturesSeries';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  formControl = new FormControl('', [Validators.required]);

  statusSeries: StatusSeries[] = [
    {id: 1, status: 'On hold'}, 
    {id: 2, status: 'Not yet downloaded'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not yet watched'},
    {id: 5, status: 'Will be looked for'}
  ];

  constructor(
    private serieService: SerieService, 
    private fireStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<SerieFormTabletComponent>,
    public dialogService: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Serie[]
  ) {}

  ngOnInit() {
    this.seasonSeriesList = this.allSeries
    .filter(serie => serie.isFirst == true && serie.season && serie.season == 1)
    .sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);

    if (this.serie.key) {
      if (this.seasonSeriesList.find(serie => serie.key == this.serie.parentSerieKey)) {
        this.parentSerieName = this.seasonSeriesList.find(serie => serie.key == this.serie.parentSerieKey).nameSerie;
      }
    }
  }

  filterByParentName(serieName: string) {
    if (serieName) {
      this.seasonSeriesList = this.allSeries
      .filter(serie => serie.nameSerie.toLowerCase().includes(serieName.toLowerCase()) && serie.isFirst == true && serie.season && serie.season == 1)
      .sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
    } else {
      this.seasonSeriesList = this.allSeries
      .filter(serie => serie.isFirst == true && serie.season && serie.season == 1)
      .sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
    }
  }

  getParentSerieKey(serieKey: string) {
    if (this.seasonSeriesList.find(serie => serie.key == serieKey)) {
      this.parentSerieName = this.seasonSeriesList.find(serie => serie.key == serieKey).nameSerie;
    }
    this.serie.parentSerieKey = serieKey;
  }

  save() {
    if (!this.serie.notLiked || this.serie.statusId !== 3) {this.serie.notLiked = false;}
    if (this.serie.key) {
      this.serieService.update(this.serie.key, this.serie);
      Swal.fire(
        'Serie data has been updated successfully',
        '',
        'success'
      )
    } else {
      if (this.arraySeries[0].numRefSerie) this.serie.numRefSerie = this.arraySeries[0].numRefSerie + 1;
      if (!this.serie.isFirst) this.serie.isFirst = false;

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

      (await this.task).ref.getDownloadURL().then(url => {
        this.serie.imageUrl = url;
        Swal.fire(
          'Picture has been uploaded successfully',
          '',
          'success'
        )
      });  // <<< url is found here

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