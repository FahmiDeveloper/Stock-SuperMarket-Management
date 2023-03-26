import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';

import { AnimeFormDesktopComponent } from '../anime-form-desktop/anime-form-desktop.component';

import { AnimeService } from 'src/app/shared/services/anime.service';

import { Anime, StatusAnimes } from 'src/app/shared/models/anime.model';

@Component({
  selector: 'anime-details-desktop',
  templateUrl: './anime-details-desktop.component.html',
  styleUrls: ['./anime-details-desktop.scss']
})

export class AnimeDetailsDesktopComponent implements OnInit {

  allAnimes: Anime[];

  anime: Anime = new Anime();

  statusAnimes: StatusAnimes[] = [
    {id: 1, status: 'On hold'}, 
    {id: 2, status: 'Not yet downloaded'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not yet watched'},
    {id: 5, status: 'Will be looked for'}
  ];

  constructor(
    private animeService: AnimeService, 
    public dialogRef: MatDialogRef<AnimeDetailsDesktopComponent>,
    public dialogService: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Anime
  ) {}

  ngOnInit() {}

  editAnime(anime?: Anime) {
    const dialogRef = this.dialogService.open(AnimeFormDesktopComponent, {width: '500px'});
    dialogRef.componentInstance.anime = anime;
    dialogRef.componentInstance.allAnimes = this.allAnimes;
  }

  deleteAnime(animeKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this anime!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.animeService.delete(animeKey);
        this.dialogRef.close();     
        Swal.fire(
          'Anime has been deleted successfully',
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

  viewNote(animeNote: string) {
    Swal.fire({
      text: animeNote,
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