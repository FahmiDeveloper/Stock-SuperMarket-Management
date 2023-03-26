import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';

import { SerieFormMobileComponent } from '../serie-form-mobile/serie-form-mobile.component';

import { SerieService } from 'src/app/shared/services/serie.service';

import { Serie, StatusSeries } from 'src/app/shared/models/serie.model';

@Component({
  selector: 'serie-details-mobile',
  templateUrl: './serie-details-mobile.component.html',
  styleUrls: ['./serie-details-mobile.scss']
})

export class SerieDetailsMobileComponent implements OnInit {

  allSeries: Serie[];

  serie: Serie = new Serie();

  statusSeries: StatusSeries[] = [
    {id: 1, status: 'On hold'}, 
    {id: 2, status: 'Not yet downloaded'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not yet watched'},
    {id: 5, status: 'Will be looked for'}
  ];

  constructor(
    private serieService: SerieService, 
    public dialogRef: MatDialogRef<SerieDetailsMobileComponent>,
    public dialogService: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Serie
  ) {}

  ngOnInit() {}

  editSerie(serie?: Serie) {
    const dialogRef = this.dialogService.open(SerieFormMobileComponent, {
      width: '98vw',
      height:'75vh',
      maxWidth: '100vw'
    });    
    dialogRef.componentInstance.serie = serie;
    dialogRef.componentInstance.allSeries = this.allSeries;
  }

  deleteSerie(serieId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this serie!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.serieService.delete(serieId);       
        this.dialogRef.close();       
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
    this.showSnackbarTopPosition();
  }

  showSnackbarTopPosition() {
    this.snackBar.open('Text copied', 'Done', {
      duration: 2000,
      verticalPosition: "bottom", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
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