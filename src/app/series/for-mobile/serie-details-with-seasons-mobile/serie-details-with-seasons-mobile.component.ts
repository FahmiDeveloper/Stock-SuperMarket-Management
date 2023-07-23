import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';

import Swal from 'sweetalert2';

import { SerieFormMobileComponent } from '../serie-form-mobile/serie-form-mobile.component';

import { SerieService } from 'src/app/shared/services/serie.service';

import { Serie, StatusSeries } from 'src/app/shared/models/serie.model';
@Component({
  selector: 'serie-details-with-seasons-mobile',
  templateUrl: './serie-details-with-seasons-mobile.component.html',
  styleUrls: ['./serie-details-with-seasons-mobile.scss']
})

export class SerieDetailsWithSeasonsMobileComponent implements OnInit {

  listSeasonsByParentSerieKey: Serie[];
  allSeries: Serie[];

  serie: Serie = new Serie();

  menuTopLeftPosition =  {x: '0', y: '0'} 

  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger;

  statusSeries: StatusSeries[] = [
    {id: 1, status: 'On hold'}, 
    {id: 2, status: 'Not yet downloaded'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not yet watched'},
    {id: 5, status: 'Will be looked for'}
  ];

  constructor(
    private serieService: SerieService, 
    public dialogRef: MatDialogRef<SerieDetailsWithSeasonsMobileComponent>,
    public dialogService: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  showDetailsSerie(serieSeasonSelected: Serie, elem: HTMLElement) {
    this.serie = serieSeasonSelected;
    elem.scrollIntoView();
  }

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

  openMenuTrigger(event: MouseEvent, serie: Serie) { 
    // preventDefault avoids to show the visualization of the right-click menu of the browser 
    event.preventDefault(); 

    // we record the mouse position in our object 
    this.menuTopLeftPosition.x = event.clientX + 'px'; 
    this.menuTopLeftPosition.y = event.clientY + 'px'; 

    // we open the menu 
    // we pass to the menu the information about our object 
    this.matMenuTrigger.menuData = {serie: serie};

    // we open the menu 
    this.matMenuTrigger.openMenu(); 
  }

  close() {
    this.dialogRef.close();
  }

}