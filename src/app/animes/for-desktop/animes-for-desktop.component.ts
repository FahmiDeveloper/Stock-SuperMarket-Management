import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as moment from 'moment';

import { AnimeDetailsWithSeasonsDesktopComponent } from './anime-details-with-seasons-desktop/anime-details-with-seasons-desktop.component';
import { AnimeFormDesktopComponent } from './anime-form-desktop/anime-form-desktop.component';

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { AnimeService } from '../../shared/services/anime.service';
import { UsersListService } from '../../shared/services/list-users.service';

import { Anime, StatusAnimes } from '../../shared/models/anime.model';

@Component({
  selector: 'animes-for-desktop',
  templateUrl: './animes-for-desktop.component.html',
  styleUrls: ['./animes-for-desktop.scss']
})

export class AnimesForDesktopComponent implements OnInit, OnDestroy {

  animesList: Anime[] = [];
  animesListCopie: Anime[] = [];
  allAnimes: Anime[] = [];
  listSeasonsByParentAnimeKey: Anime[] = [];

  p: number = 1;

  animeName: string = '';
  statusId: number;
  sortByDesc: boolean = true;
  optionSelected: number;
  dislike: boolean = false;
  nbrAnimesToCheckToday: number = 0;
  itemsPerPage: number;

  menuTopLeftPosition =  {x: '0', y: '0'} 

  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger; 
 
  subscriptionForGetAllAnimes: Subscription;
  subscriptionForGetAllAnimesForSelect: Subscription;

  statusAnimes: StatusAnimes[] = [
    {id: 1, status: 'On hold'}, 
    {id: 2, status: 'Not yet downloaded'},
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not yet watched'},
    {id: 5, status: 'Will be looked for'}
  ];

  constructor(
    private animeService: AnimeService, 
    public userService: UserService,
    public usersListService: UsersListService,
    public authService: AuthService,
    public dialogService: MatDialog,
    private snackBar: MatSnackBar,
    private cdRef:ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.itemsPerPage = window.innerWidth <= 1366 ? 15 : 16;
    this.getAllAnimes();
    this.getAllAnimesForSelect();
  }

  getAllAnimes() {
    this.subscriptionForGetAllAnimes = this.animeService
    .getAll()
    .subscribe(animes => {
      this.animesListCopie = animes.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
      this.allAnimes = animes;

      if (this.animeName) {
        this.animesList = animes.filter(anime => (anime.nameAnime.toLowerCase().includes(this.animeName.toLowerCase()) && (anime.isFirst == true)));
        this.animesList = this.animesList.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
      }

      else if (this.statusId) {
        if (this.statusId == 1) {
          if (this.dislike) this.dislike = false;
          if (this.optionSelected) {
            if (this.optionSelected == 1) {
              this.animesList = animes.filter(anime => anime.statusId == this.statusId && !anime.checkDate); 
            }
            else {
              this.animesList = animes.filter(anime => anime.statusId == this.statusId && anime.checkDate && anime.checkDate == moment().format('YYYY-MM-DD') &&
              (!anime.currentEpisode || (anime.currentEpisode && !anime.totalEpisodes) || (anime.currentEpisode && anime.totalEpisodes && anime.currentEpisode < anime.totalEpisodes)));
            }   
          }
          else  {
            this.animesList = animes.filter(anime => anime.statusId == this.statusId);
          }
          this.animesList = this.animesList.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
        }
        else {
          if (this.optionSelected) this.optionSelected = null;
          if (this.statusId == 3) {
            if (this.dislike) {
              this.animesList = animes.filter(anime => anime.statusId == this.statusId && anime.notLiked == true);
            }
            else  {
              this.animesList = animes.filter(anime => anime.statusId == this.statusId);
            }
          }
          else {
            if (this.dislike) this.dislike = false;
            this.animesList = animes.filter(anime => anime.statusId == this.statusId);
          }     
          this.animesList = this.statusId == 3 ? this.animesList.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime) : this.animesList.sort((n1, n2) => n1.numRefAnime - n2.numRefAnime);            
        }
      }
      
      else this.animesList = animes.filter(anime => anime.isFirst == true).sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);

      this.animesList.forEach(anime => {
        this.checkIfAnimeHaveSeasons(anime);
      })

    });
  }
 
  getAllAnimesForSelect() {
    this.subscriptionForGetAllAnimesForSelect = this.animeService
    .getAll()
    .subscribe((animes: Anime[]) => {
      this.nbrAnimesToCheckToday = animes.filter(anime => anime.statusId == 1 && anime.checkDate && anime.checkDate == moment().format('YYYY-MM-DD') &&
      (!anime.currentEpisode || (anime.currentEpisode && !anime.totalEpisodes) || (anime.currentEpisode && anime.currentEpisode && anime.currentEpisode < anime.totalEpisodes))).length;
      this.cdRef.detectChanges();
    })
  }

  checkIfAnimeHaveSeasons(animeData: Anime) {
    if (this.allAnimes.filter(anime => anime.parentAnimeKey && anime.parentAnimeKey == animeData.key).length > 0) {
      animeData.haveSeasons = true;
    } else {
      animeData.haveSeasons = false;
    }
  }

  OnPageChange(event: PageEvent){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  showDetailsAnime(animeSelected: Anime) {
    this.listSeasonsByParentAnimeKey = this.allAnimes
    .filter(anime => (anime.key == animeSelected.key) || (anime.parentAnimeKey == animeSelected.key))
    .sort((n1, n2) => n1.priority - n2.priority);

    const dialogRef = this.dialogService.open(AnimeDetailsWithSeasonsDesktopComponent, {width: '1150px'});
    dialogRef.componentInstance.anime = animeSelected;
    dialogRef.componentInstance.allAnimes = this.allAnimes;
    dialogRef.componentInstance.listSeasonsByParentAnimeKey = this.listSeasonsByParentAnimeKey;
  }

  newAnime() {
    const dialogRef = this.dialogService.open(AnimeFormDesktopComponent, {width: '500px', data: {movie: {}}});
    dialogRef.componentInstance.arrayAnimes = this.animesListCopie;
    dialogRef.componentInstance.allAnimes = this.allAnimes;
  }

  editAnime(anime?: Anime) {
    const dialogRef = this.dialogService.open(AnimeFormDesktopComponent, {width: '500px'});
    dialogRef.componentInstance.anime = anime;
    dialogRef.componentInstance.allAnimes = this.allAnimes;
  }

  deleteAnime(animeKey: string) {
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
        Swal.fire(
          'Anime has been deleted successfully',
          '',
          'success'
        )
      }
    })
  } 

  followLink(path: string) {
    window.open(path);
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

  onRightClick(event: MouseEvent, anime: Anime) { 
    // preventDefault avoids to show the visualization of the right-click menu of the browser 
    event.preventDefault(); 

    // we record the mouse position in our object 
    this.menuTopLeftPosition.x = event.clientX + 'px'; 
    this.menuTopLeftPosition.y = event.clientY + 'px'; 

    // we open the menu 
    // we pass to the menu the information about our object 
    this.matMenuTrigger.menuData = {anime: anime};

    // we open the menu 
    this.matMenuTrigger.openMenu(); 
  }

  ngOnDestroy() {
    this.subscriptionForGetAllAnimes.unsubscribe();
    this.subscriptionForGetAllAnimesForSelect.unsubscribe();
  }
  
}