import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AnimeDetailsWithSeasonsMobileComponent } from './anime-details-with-seasons-mobile/anime-details-with-seasons-mobile.component';
import { AnimeFormMobileComponent } from './anime-form-mobile/anime-form-mobile.component';
import { AnimeDetailsMobileComponent } from './anime-details-mobile/anime-details-mobile.component';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AnimeService } from 'src/app/shared/services/anime.service';
import { UsersListService } from 'src/app/shared/services/list-users.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Anime, StatusAnimes } from 'src/app/shared/models/anime.model';

@Component({
  selector: 'animes-for-mobile',
  templateUrl: './animes-for-mobile.component.html',
  styleUrls: ['./animes-for-mobile.scss']
})

export class AnimesForMobileComponent implements OnInit, OnDestroy {

  animesList: Anime[] = [];
  pagedList: Anime[]= [];
  animesListCopie: Anime[] = [];
  allAnimes: Anime[] = [];
  listSeasonsByParentAnimeKey: Anime[] = [];

  animeName: string = '';
  statusId: number;
  sortByDesc: boolean = true;

  length: number = 0;
  pageSize: number = 6;
  pageSizeOptions: number[] = [6];

  subscriptionForGetAllAnimes: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  statusAnimes: StatusAnimes[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 5, status: 'To search about it'}
  ];

  constructor(
    private animeService: AnimeService, 
    public userService: UserService,
    public usersListService: UsersListService,
    public authService: AuthService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.getRolesUser();
    this.getAllAnimes();
  }

  getRolesUser() {
    this.subscriptionForUser = this.authService
      .isConnected
      .subscribe(res=>{
        if(res) {
          this.userService
            .getCurrentUser()
            .then(user=>{
              if(user) {
                let connectedUserFromList: FirebaseUserModel = new FirebaseUserModel();

                this.subscriptionForGetAllUsers = this.usersListService
                .getAll()
                .subscribe((users: FirebaseUserModel[]) => { 
                  connectedUserFromList = users.find(element => element.email == user.email);

                  this.usersListService
                  .get(connectedUserFromList.key)
                  .valueChanges()
                  .subscribe(dataUser=>{
                    this.dataUserConnected = dataUser;
                  });
                });
              }
          });   
        }
    })
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
        this.animesList = animes.filter(anime => anime.statusId == this.statusId);       
        this.animesList = this.animesList.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
      }
      
      else this.animesList = animes.filter(anime => anime.isFirst == true).sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
      
      this.animesList.forEach(anime => {
        this.checkIfAnimeHaveSeasons(anime);
      })

      this.pagedList = this.animesList.slice(0, 6);
      this.length = this.animesList.length;

    });
  }

  checkIfAnimeHaveSeasons(animeData: Anime) {
    if (this.allAnimes.filter(anime => anime.parentAnimeKey && anime.parentAnimeKey == animeData.key).length > 0) {
      animeData.haveSeasons = true;
    } else {
      animeData.haveSeasons = false;
    }
  }

  OnPageChange(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedList = this.animesList.slice(startIndex, endIndex);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  showDetailsAnime(animeSelected: Anime) {
    this.listSeasonsByParentAnimeKey = this.allAnimes
    .filter(anime => (anime.key == animeSelected.key) || (anime.parentAnimeKey == animeSelected.key))
    .sort((n1, n2) => n1.priority - n2.priority);

    const dialogRef = this.dialogService.open(AnimeDetailsWithSeasonsMobileComponent, {
      width: '98vw',
      height:'75vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.anime = animeSelected;
    dialogRef.componentInstance.allAnimes = this.allAnimes;
    dialogRef.componentInstance.listSeasonsByParentAnimeKey = this.listSeasonsByParentAnimeKey;
    dialogRef.componentInstance.parent = this;
  }

  newAnime() {
    const dialogRef = this.dialogService.open(AnimeFormMobileComponent, {
      width: '98vw',
      height:'75vh',
      maxWidth: '100vw', 
      data: {movie: {}}
    });
    dialogRef.componentInstance.arrayAnimes = this.animesListCopie;
    dialogRef.componentInstance.allAnimes = this.allAnimes;  
  }

  viewDetailsAnime(anime: Anime) {
    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      width: '98vw',
      maxWidth: '100vw'
    }
    const dialogRef = this.dialogService.open(AnimeDetailsMobileComponent, config);

    dialogRef.componentInstance.anime = anime;
    dialogRef.componentInstance.allAnimes = this.allAnimes;
    dialogRef.componentInstance.parent = this;
  }

  editAnime(anime?: Anime) {
    const dialogRef = this.dialogService.open(AnimeFormMobileComponent, {
      width: '98vw',
      height:'75vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.anime = anime;
    dialogRef.componentInstance.allAnimes = this.allAnimes;
    dialogRef.componentInstance.pagedList = this.pagedList;

    dialogRef.afterClosed().subscribe(res => {
      this.pagedList = res;
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

  sortByRefAnimeDesc() {
    this.pagedList = this.animesList.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
    this.sortByDesc = true;

    this.pagedList = this.animesList.slice(0, 6);
    this.length = this.animesList.length;
  }

  sortByRefAnimeAsc() {
    this.pagedList = this.animesList.sort((n1, n2) => n1.numRefAnime - n2.numRefAnime);
    this.sortByDesc = false;

    this.pagedList = this.animesList.slice(0, 6);
    this.length = this.animesList.length;
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

  ngOnDestroy() {
    this.subscriptionForGetAllAnimes.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }

}
