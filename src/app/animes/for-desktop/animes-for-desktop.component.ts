import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { BreakpointObserver } from '@angular/cdk/layout';

import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { DeviceDetectorService } from 'ngx-device-detector';

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

  animesList: Anime[] = [];
  pagedList: Anime[]= [];
  animesListCopie: Anime[] = [];
  allAnimes: Anime[] = [];
  listAnimesByCurrentName: Anime[] = [];

  newAnime: Anime = new Anime();
  selectedAnime: Anime = new Anime();

  animeName: string = '';
  statusId: number;
  sortByDesc: boolean = true;
  currentName: string = '';
  getDetailsAnime: boolean = false;
  editButtonClick: boolean = false;
  clickNewAnime: boolean = false;
  isTablet: boolean;
  isLinear = false;
  isPortrait: boolean;

  length: number = 0;
  pageSize: number = 6;
  pageSizeOptions: number[] = [6];

  basePath = '/PicturesAnimes';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  subscriptionForGetAllAnimes: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  statusAnimes: StatusAnimes[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 5, status: 'To search about it'}
  ];

  allStatusAnimes: StatusAnimes[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ]

  constructor(
    private animeService: AnimeService, 
    public userService: UserService,
    public usersListService: UsersListService,
    public authService: AuthService,
    private fireStorage: AngularFireStorage,
    private deviceService: DeviceDetectorService,
    private bpObserable: BreakpointObserver
  ) {}

  ngOnInit() {
    this.isTablet = this.deviceService.isTablet();
    this.getRolesUser();
    this.getAllAnimes();

    this.bpObserable
    .observe([
      '(orientation: portrait)',
    ])
    .subscribe(result => {
      if(result.matches){
        this.isPortrait = true;
      }
    });
    this.bpObserable
    .observe([
      '(orientation: landscape)',
    ])
    .subscribe(result => {
      if(result.matches){
        this.isPortrait = false;
      }
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

  getAllAnimes() {
    this.getDetailsAnime = false;
    this.clickNewAnime = false;

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

      if (this.animesList.length) {
        if (this.isTablet) {
          if (this.isPortrait) {
            if (this.animesList.length == 1) {
              this.animesList.forEach(anime => {
                if (anime.fullNameAnime) {
                  anime.nameAnimeToShow = (anime.fullNameAnime.length > 39) ? anime.fullNameAnime.substring(0, 39) + '...' : anime.fullNameAnime;
                } else {
                  anime.nameAnimeToShow = (anime.nameAnime.length > 39) ? anime.nameAnime.substring(0, 39) + '...' : anime.nameAnime;
                }
              })
            } else if (this.animesList.length == 2) {
              this.animesList.forEach(anime => {
                if (anime.fullNameAnime) {
                  anime.nameAnimeToShow = (anime.fullNameAnime.length > 38) ? anime.fullNameAnime.substring(0, 38) + '...' : anime.fullNameAnime;
                } else {
                  anime.nameAnimeToShow = (anime.nameAnime.length > 38) ? anime.nameAnime.substring(0, 38) + '...' : anime.nameAnime;
                }
              })
            } else {
              this.animesList.forEach(anime => {
                if (anime.fullNameAnime) {
                  anime.nameAnimeToShow = (anime.fullNameAnime.length > 20) ? anime.fullNameAnime.substring(0, 20) + '...' : anime.fullNameAnime;
                } else {
                  anime.nameAnimeToShow = (anime.nameAnime.length > 20) ? anime.nameAnime.substring(0, 20) + '...' : anime.nameAnime;
                }
              })
            }
          } else {
            if (this.animesList.length == 1) {
              this.animesList.forEach(anime => {
                if (anime.fullNameAnime) {
                  anime.nameAnimeToShow = (anime.fullNameAnime.length > 39) ? anime.fullNameAnime.substring(0, 39) + '...' : anime.fullNameAnime;
                } else {
                  anime.nameAnimeToShow = (anime.nameAnime.length > 39) ? anime.nameAnime.substring(0, 39) + '...' : anime.nameAnime;
                }
              })
            } else if (this.animesList.length == 2) {
              this.animesList.forEach(anime => {
                if (anime.fullNameAnime) {
                  anime.nameAnimeToShow = (anime.fullNameAnime.length > 38) ? anime.fullNameAnime.substring(0, 38) + '...' : anime.fullNameAnime;
                } else {
                  anime.nameAnimeToShow = (anime.nameAnime.length > 38) ? anime.nameAnime.substring(0, 38) + '...' : anime.nameAnime;
                }
              })
            } else {
              this.animesList.forEach(anime => {
                if (anime.fullNameAnime) {
                  anime.nameAnimeToShow = (anime.fullNameAnime.length > 32) ? anime.fullNameAnime.substring(0, 32) + '...' : anime.fullNameAnime;
                } else {
                  anime.nameAnimeToShow = (anime.nameAnime.length > 32) ? anime.nameAnime.substring(0, 32) + '...' : anime.nameAnime;
                }
              })
            }
          }     
        } else {
          this.animesList.forEach(anime => {
            if (anime.fullNameAnime) {
              anime.nameAnimeToShow = (anime.fullNameAnime.length > 39) ? anime.fullNameAnime.substring(0, 39) + '...' : anime.fullNameAnime;
            } else {
              anime.nameAnimeToShow = (anime.nameAnime.length > 39) ? anime.nameAnime.substring(0, 39) + '...' : anime.nameAnime;
            }
          })
        }     
      }

      this.pagedList = this.animesList.slice(0, 6);
      this.length = this.animesList.length;

      this.getStatusAnime();
    });
  }

  getStatusAnime() {
    this.animesList.forEach(element=>{
      this.statusAnimes.forEach(statusAnime => {
        if (statusAnime.id == element.statusId) {
          element.status = statusAnime.status;
        }
      })
    })
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

  showDetailsAnime(anime: Anime) {
    this.getDetailsAnime = true;
    this.editButtonClick = false;
    this.selectedAnime = anime;
    this.allStatusAnimes.forEach(statusAnime => {
      if (statusAnime.id == this.selectedAnime.statusId) {
        this.selectedAnime.status = statusAnime.status;
      }
    })
    this.listAnimesByCurrentName = this.allAnimes.filter(anime => (anime.nameAnime.toLowerCase() == (this.selectedAnime.nameAnime.toLowerCase()))).sort((n1, n2) => n1.priority - n2.priority);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  getSeasonAnimeSelected(seasonAnimeSelected: Anime) {
    this.selectedAnime = seasonAnimeSelected;
    this.allStatusAnimes.forEach(statusAnime => {
      if (statusAnime.id == this.selectedAnime.statusId) {
        this.selectedAnime.status = statusAnime.status;
      }
    })
    this.editButtonClick = false;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  addNewAnime() {
    this.clickNewAnime = true;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  saveNewAnime() {
    this.newAnime.date = moment().format('YYYY-MM-DD');
    if (this.allAnimes[0].numRefAnime) this.newAnime.numRefAnime = this.allAnimes[0].numRefAnime + 1;
    this.animeService.create(this.newAnime);
    this.clickNewAnime = false;
    this.getDetailsAnime = false;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    Swal.fire(
    'New anime added successfully',
    '',
    'success'
    ).then((result) => {
      if (result.value) {
        this.newAnime.nameAnime = '';
        if (this.newAnime.isFirst) this.newAnime.isFirst = false;
        this.newAnime.statusId = null;
        this.newAnime.type = '';
        if (this.newAnime.season) this.newAnime.season = null;
        if (this.newAnime.priority) this.newAnime.priority = null;
        if (this.newAnime.currentEpisode) this.newAnime.currentEpisode = null;
        if (this.newAnime.totalEpisodes) this.newAnime.totalEpisodes = null;
        if (this.newAnime.path) this.newAnime.path = '';
        if (this.newAnime.note) this.newAnime.note = '';
        if (this.newAnime.imageUrl) this.newAnime.imageUrl = '';
      }
    })
  }

  cancelFromNewAnime() {
    this.clickNewAnime = false;
    this.getDetailsAnime = false;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  async uploadPictureForCreateAnime(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.newAnime.imageUrl = url; 
        Swal.fire(
          'Picture has been uploaded successfully',
          '',
          'success'
        )
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.newAnime.imageUrl = '';
    }
  }

  editAnime() {
    this.editButtonClick = true;
  }

  save() {
    this.animeService.update(this.selectedAnime.key, this.selectedAnime);
    this.allStatusAnimes.forEach(statusAnime => {
      if (statusAnime.id == this.selectedAnime.statusId) {
        this.selectedAnime.status = statusAnime.status;
      }
    })
    this.editButtonClick = false;
    Swal.fire(
      'Anime data has been Updated successfully',
      '',
      'success'
    )
  }

  cancel() {
    this.editButtonClick = false;
  }

  async uploadPictureForEditAnime(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.selectedAnime.imageUrl = url; 
        this.animeService.update(this.selectedAnime.key, this.selectedAnime);
        Swal.fire(
          'Picture has been uploaded successfully',
          '',
          'success'
        )
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.selectedAnime.imageUrl = '';
    }
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
        this.getDetailsAnime = false;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
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

  viewNote(animeNote: string) {
    Swal.fire({
      text: animeNote,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Close'
    });
  }

  ngOnDestroy() {
    this.subscriptionForGetAllAnimes.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }
  
}