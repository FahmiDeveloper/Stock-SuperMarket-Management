import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { SerieFormDesktopComponent } from '../serie-form-desktop/serie-form-desktop.component';

import { SerieService } from 'src/app/shared/services/serie.service';

import { Serie, StatusSeries } from 'src/app/shared/models/serie.model';

@Component({
  selector: 'serie-details-with-seasons-desktop',
  templateUrl: './serie-details-with-seasons-desktop.component.html',
  styleUrls: ['./serie-details-with-seasons-desktop.scss']
})

export class SerieDetailsWithSeasonsDesktopComponent implements OnInit {

  listSeasonsByParentSerieKey: Serie[];
  allSeries: Serie[];

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
    public dialogRef: MatDialogRef<SerieDetailsWithSeasonsDesktopComponent>,
    public dialogService: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Serie
  ) {}

  ngOnInit() {}

  getSeasonSerieSelected(serieSeasonSelected: Serie) {
    this.serie = serieSeasonSelected;
  }

  editSerie(serie?: Serie) {
    const dialogRef = this.dialogService.open(SerieFormDesktopComponent, {width: '500px'});
    dialogRef.componentInstance.serie = serie;
    dialogRef.componentInstance.allSeries = this.allSeries;
  }

  deleteSerie(serieId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this serie!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.serieService.delete(serieId);
        this.listSeasonsByParentSerieKey.forEach((serie, index) => {
          if(serie.key === serieId) this.listSeasonsByParentSerieKey.splice(index,1);
        });
        if (this.listSeasonsByParentSerieKey.length == 0) {
          this.dialogRef.close();
        }
        else {
          this.serie = this.listSeasonsByParentSerieKey[0];
        }
        Swal.fire(
          'Serie has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }
  
  copyText(text: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  viewNote(serieNote: string) {
    Swal.fire({
      text: serieNote,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Close'
    });
  }

  followLink(path: string) {
    window.open(path);
  }

  close() {
    this.dialogRef.close();
  }

}