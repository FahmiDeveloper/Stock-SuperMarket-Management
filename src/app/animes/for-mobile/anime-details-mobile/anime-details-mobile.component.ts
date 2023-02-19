import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { AnimeFormMobileComponent } from '../anime-form-mobile/anime-form-mobile.component';

import { AnimeService } from 'src/app/shared/services/anime.service';

import { Anime, StatusAnimes } from 'src/app/shared/models/anime.model';

@Component({
  selector: 'anime-details-mobile',
  templateUrl: './anime-details-mobile.component.html',
  styleUrls: ['./anime-details-mobile.scss']
})

export class AnimeDetailsMobileComponent implements OnInit {

  allAnimes: Anime[];

  anime: Anime = new Anime();

  parent: any;

  statusAnimes: StatusAnimes[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  constructor(
    private animeService: AnimeService, 
    public dialogRef: MatDialogRef<AnimeDetailsMobileComponent>,
    public dialogService: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Anime
  ) {}

  ngOnInit() {}

  editAnime(anime?: Anime) {
    const dialogRef = this.dialogService.open(AnimeFormMobileComponent, {
      width: '98vw',
      height:'70vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.anime = anime;
    dialogRef.componentInstance.allAnimes = this.allAnimes;
    dialogRef.componentInstance.pagedList = this.parent.pagedList;

    dialogRef.afterClosed().subscribe(res => {
      this.parent.pagedList = res;
    });
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