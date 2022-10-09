import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { NewOrEditAnimeComponent } from './new-or-edit-anime/new-or-edit-anime.component';
import { ShowAnimePictureComponent } from '../show-anime-picture';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AnimeService } from 'src/app/shared/services/anime.service';
import { UsersListService } from 'src/app/shared/services/list-users.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Anime, StatusAnimes } from 'src/app/shared/models/anime.model';

@Component({
  selector: 'app-version-grid-animes',
  templateUrl: './version-grid-animes.component.html',
  styleUrls: ['./version-grid-animes.component.scss']
})

export class VersionGridAnimesComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Anime>();
  dataSourceCopie = new MatTableDataSource<Anime>();
  displayedColumns: string[] = ['picture', 'name', 'date', 'status', 'note', 'star'];

  queryName: string = "";
  queryNote: string = "";
  statusId: number;
  sortByDesc: boolean = true;

  subscriptionForGetAllAnimes: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  statusAnimes: StatusAnimes[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
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
    this.getAllAnimes();
    this.getRolesUser();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllAnimes() {
    this.subscriptionForGetAllAnimes = this.animeService
    .getAll()
    .subscribe(animes => {
      this.dataSourceCopie.data = animes.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);

      if (this.queryName) {
        this.dataSource.data = animes.filter(anime => anime.nameAnime.toLowerCase().includes(this.queryName.toLowerCase()));
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
      }
      
      else if (this.queryNote) {
        this.dataSource.data = animes.filter(anime => anime.note.toLowerCase().includes(this.queryNote.toLowerCase()));
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
      }
      
      else if (this.statusId) {
        this.dataSource.data = animes.filter(anime => anime.statusId == this.statusId);   
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
      }
      
      else this.dataSource.data = animes.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);

      this.getStatusAnime();
    });
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

  deleteAnime(animeId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this anime!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.animeService.delete(animeId);
        Swal.fire(
          'Anime has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  newAnime() {
    const dialogRef = this.dialogService.open(NewOrEditAnimeComponent, {
      width: '98vw',
      height:'73vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.arrayAnimes = this.dataSourceCopie.data;
    dialogRef.componentInstance.modalRef = dialogRef;
  }

  editAnime(anime?: Anime) {
    const dialogRef = this.dialogService.open(NewOrEditAnimeComponent, {
      width: '98vw',
      height:'73vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.anime = anime;
    dialogRef.componentInstance.modalRef = dialogRef;
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

  zoomPicture(anime?: Anime) {
    const dialogRef = this.dialogService.open(ShowAnimePictureComponent, {
      width: '98vw',
      height:'77vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.animeForModal = anime;
    dialogRef.componentInstance.dialogRef = dialogRef;
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

  ngOnDestroy() {
    this.subscriptionForGetAllAnimes.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }

}
