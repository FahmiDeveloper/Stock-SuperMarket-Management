import { Component, OnInit } from '@angular/core';

import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Serie } from 'src/app/shared/models/serie.model';
import { SerieService } from 'src/app/shared/services/serie.service';

@Component({
  selector: 'app-serie-form',
  templateUrl: './serie-form.component.html',
  styleUrls: ['./serie-form.component.scss']
})
export class SerieFormComponent implements OnInit {

  basePath = '/PicturesSeries';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  serieId;
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
    private fireStorage: AngularFireStorage,
    private router: Router,
    private route: ActivatedRoute
    ) {}

  ngOnInit() {
    this.getSerieData();
  }

  getSerieData() {
    this.serieId = this.route.snapshot.paramMap.get('id');
    if (this.serieId) {
      this.serieService
        .getSerieId(this.serieId)
        .valueChanges()
        .pipe(take(1))
        .subscribe(serie => {
          this.serie = serie;
      });
    } else {
      this.serie.date = moment().format('YYYY-MM-DD');
      this.serie.time = moment().format('HH:mm');
    }
  }

  save(serie) {
    if (serie.statusId == 3 || serie.statusId == 4 || serie.statusId == 5) serie.path = "";
    if (this.serieId) {
      this.serieService.update(this.serieId, serie);
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
    this.router.navigate(['/series']);
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

  cancel() {
    this.router.navigate(['/series']);
  }

}

export interface StatusSeries {
  id: number,
  status: string
}
