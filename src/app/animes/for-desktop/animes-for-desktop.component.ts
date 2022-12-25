import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';

import { AnimeFormDesktopComponent } from './anime-form-desktop/anime-form-desktop.component';

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { AnimeService } from '../../shared/services/anime.service';
import { UsersListService } from '../../shared/services/list-users.service';

import { FirebaseUserModel } from '../../shared/models/user.model';
import { Anime, StatusAnimes } from '../../shared/models/anime.model';

@Component({
  selector: 'animes-for-desktop',
  templateUrl: './animes-for-desktop.component.html',
  styleUrls: ['./animes-for-desktop.scss']
})

export class AnimesForDesktopComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Anime>();
  dataSourceCopie = new MatTableDataSource<Anime>();
  displayedColumns: string[] = ['picture', 'details'];
  allAnimes: Anime[] = [];
  listAnimesByCurrentName: Anime[] = [];

  animeToDelete: Anime = new Anime();

  queryName: string = '';
  statusId: number;
  sortByDesc: boolean = true;
  currentName: string = '';
  modalRefDeleteAnime: any;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  subscriptionForGetAllAnimes: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  statusAnimes: StatusAnimes[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'},
    {id: 6, status: 'Seasons and/or movies'}
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

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
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
      this.dataSourceCopie.data = animes.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
      this.allAnimes = animes;

      if (this.queryName) {
        this.dataSource.data = animes.filter(anime => (anime.nameAnime.toLowerCase().includes(this.queryName.toLowerCase()) && (anime.isFirst == true)));
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
      }
      
      else if (this.statusId) {
        if (this.statusId == 6) this.dataSource.data = animes.filter(anime => (anime.season) && (anime.isFirst == true));

        else this.dataSource.data = animes.filter(anime => (anime.statusId == this.statusId) && (anime.isFirst == true) && (!anime.season));
           
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
      }
      
      else this.dataSource.data = animes.filter(anime => anime.isFirst == true).sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);

      this.getStatusAnime();
    });
  }

  getStatusAnime() {
    this.dataSource.data.forEach(element=>{
      this.statusAnimes.forEach(statusAnime => {
        if (statusAnime.id == element.statusId) {
          element.status = statusAnime.status;
          element.note = element.note ? element.note : '-';
        }
      })
    })
  }

  newAnime() {
    const dialogRef = this.dialogService.open(AnimeFormDesktopComponent, {width: '800px', data: {movie: {}}});
    dialogRef.componentInstance.arrayAnimes = this.dataSourceCopie.data;
    dialogRef.componentInstance.allAnimes = this.allAnimes;
  }

  editAnime(anime?: Anime) {
    const dialogRef = this.dialogService.open(AnimeFormDesktopComponent, {width: '800px'});
    dialogRef.componentInstance.anime = anime;
  }

  openDeleteAnimeModal(anime: Anime, contentDeleteAnime) {
    this.animeToDelete = anime;
    this.modalRefDeleteAnime =  this.dialogService.open(contentDeleteAnime, {
      width: '30vw',
      height:'35vh',
      maxWidth: '100vw'
    }); 
  }

  confirmDelete() {
    this.animeService.delete(this.animeToDelete.key);
  }

  close() {
    this.modalRefDeleteAnime.close();
  } 

  copyNameAnime(nameAnime: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = nameAnime;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  sortByRefAnimeDesc() {
    this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
    this.sortByDesc = true;
  }

  sortByRefAnimeAsc() {
    this.dataSource.data = this.dataSource.data.sort((n1, n2) => n1.numRefAnime - n2.numRefAnime);
    this.sortByDesc = false;
  }

  onContextMenu(event: MouseEvent, anime: Anime) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'anime': anime };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  viewOtherSeasonsAndMovies(currentAnime: Anime, contentSeasonAndMoviesList) {
    this.currentName = currentAnime.nameAnime;
    this.listAnimesByCurrentName = this.allAnimes.filter(anime => (anime.nameAnime.toLowerCase().includes(currentAnime.nameAnime.toLowerCase())));

    this.dialogService.open(contentSeasonAndMoviesList, {
      width: '40vw',
      height:'70vh',
      maxWidth: '100vw'
    }); 
  }

  ngOnDestroy() {
    this.subscriptionForGetAllAnimes.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }
  
}