import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as moment from 'moment';

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { SerieService } from 'src/app/shared/services/serie.service';
import { UsersListService } from '../../shared/services/list-users.service';

import { FirebaseUserModel } from '../../shared/models/user.model';
import { Serie, StatusSeries } from 'src/app/shared/models/serie.model';

@Component({
    selector: 'series-for-desktop',
    templateUrl: './series-for-desktop.component.html',
    styleUrls: ['./series-for-desktop.scss']
})

export class SeriesForDesktopComponent implements OnInit, OnDestroy {

  seriesList: Serie[] = [];
  pagedList: Serie[]= [];
  seriesListCopie: Serie[] = [];
  allSeries: Serie[] = [];
  listSeriesByCurrentName: Serie[] = [];

  newSerie: Serie = new Serie();
  selectedSerie: Serie = new Serie();

  serieName: string = '';
  statusId: number;
  sortByDesc: boolean = true;
  currentName: string = '';
  getDetailsSerie: boolean = false;
  editButtonClick: boolean = false;
  clickNewSerie: boolean = false;

  length: number = 0;
  pageSize: number = 6;
  pageSizeOptions: number[] = [6];

  basePath = '/PicturesSeries';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  subscriptionForGetAllSeries: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  statusSeries: StatusSeries[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 5, status: 'To search about it'}
  ];

  allStatusSeries: StatusSeries[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'},
    {id: 6, status: 'Seasons'}
  ];

  constructor(
    private serieService: SerieService, 
    public userService: UserService,
    public usersListService: UsersListService,
    public authService: AuthService,
    private fireStorage: AngularFireStorage
  ) {}

  ngOnInit() {
    this.getRolesUser();
    this.getAllSeries();
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

  getAllSeries() {
    this.getDetailsSerie = false;
    this.clickNewSerie = false;

    this.subscriptionForGetAllSeries = this.serieService
    .getAll()
    .subscribe(series => {
      this.seriesListCopie = series.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
      this.allSeries = series;

      if (this.serieName) {
        this.seriesList = series.filter(serie => (serie.nameSerie.toLowerCase().includes(this.serieName.toLowerCase())) && (serie.isFirst == true));
        this.seriesList = this.seriesList.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
      }
      
      else if (this.statusId) {
        this.seriesList = series.filter(serie => serie.statusId == this.statusId);       
        this.seriesList = this.seriesList.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
      }
      
      else this.seriesList = series.filter(serie => serie.isFirst == true).sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);

      this.pagedList = this.seriesList.slice(0, 6);
      this.length = this.seriesList.length;

      this.getStatusSerie();
    });
  }

  getStatusSerie() {
    this.seriesList.forEach(element=>{
      this.statusSeries.forEach(statusSerie => {
        if (statusSerie.id == element.statusId) {
          element.status = statusSerie.status;
          element.note = element.note ? element.note : '-';
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
    this.pagedList = this.seriesList.slice(startIndex, endIndex);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  showDetailsSerie(serie: Serie) {
    this.getDetailsSerie = true;
    this.editButtonClick = false;
    this.selectedSerie = serie;
    this.allStatusSeries.forEach(statusSerie => {
      if (statusSerie.id == this.selectedSerie.statusId) {
        this.selectedSerie.status = statusSerie.status;
      }
    })
    this.listSeriesByCurrentName = this.allSeries.filter(serie => (serie.nameSerie.toLowerCase() == (this.selectedSerie.nameSerie.toLowerCase()))).sort((n1, n2) => n1.priority - n2.priority);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  getSeasonSerieSelected(seasonSerieSelected: Serie) {
    this.selectedSerie = seasonSerieSelected;
    this.allStatusSeries.forEach(statusSerie => {
      if (statusSerie.id == this.selectedSerie.statusId) {
        this.selectedSerie.status = statusSerie.status;
      }
    })
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  addNewSerie() {
    this.clickNewSerie = true;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  saveNewSerie() {
    this.newSerie.date = moment().format('YYYY-MM-DD');
    if (this.allSeries[0].numRefSerie) this.newSerie.numRefSerie = this.allSeries[0].numRefSerie + 1;
    if (!this.newSerie.path) this.newSerie.path = "";
    this.serieService.create(this.newSerie);
    this.clickNewSerie = false;
    this.getDetailsSerie = false;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    Swal.fire(
    'New serie added successfully',
    '',
    'success'
    ).then((result) => {
      if (result.value) {
        this.newSerie.nameSerie = '';
        if (this.newSerie.isFirst) this.newSerie.isFirst = false;
        this.newSerie.year = null;
        this.newSerie.statusId = null;
        if (this.newSerie.season) this.newSerie.season = null;
        if (this.newSerie.priority) this.newSerie.priority = null;
        if (this.newSerie.currentEpisode) this.newSerie.currentEpisode = null;
        if (this.newSerie.totalEpisodes) this.newSerie.totalEpisodes = null;
        if (this.newSerie.path) this.newSerie.path = '';
        if (this.newSerie.note) this.newSerie.note = '';
        if (this.newSerie.imageUrl) this.newSerie.imageUrl = '';
      }
    })
  }

  cancelFromNewSerie() {
    this.clickNewSerie = false;
    this.getDetailsSerie = false;
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  async uploadPictureForCreateSerie(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.newSerie.imageUrl = url; 
        Swal.fire(
          'Picture has been uploaded successfully',
          '',
          'success'
        )
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.newSerie.imageUrl = '';
    }
  }

  editSerie() {
    this.editButtonClick = true;
  }

  save() {
    this.serieService.update(this.selectedSerie.key, this.selectedSerie);
    this.allStatusSeries.forEach(statusSerie => {
      if (statusSerie.id == this.selectedSerie.statusId) {
        this.selectedSerie.status = statusSerie.status;
      }
    })
    this.editButtonClick = false;
    Swal.fire(
      'Serie data has been Updated successfully',
      '',
      'success'
    )
  }

  cancel() {
    this.editButtonClick = false;
  }

  async uploadPictureForEditSerie(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.selectedSerie.imageUrl = url; 
        this.serieService.update(this.selectedSerie.key, this.selectedSerie);
        Swal.fire(
          'Picture has been uploaded successfully',
          '',
          'success'
        )
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.selectedSerie.imageUrl = '';
    }
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
        this.getDetailsSerie = false;
        document.body.scrollTop = document.documentElement.scrollTop = 0;
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

  followLink(path: string) {
    window.open(path);
  }

  sortByRefSerieDesc() {
    this.pagedList = this.seriesList.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
    this.sortByDesc = true;

    this.pagedList = this.seriesList.slice(0, 6);
    this.length = this.seriesList.length;
  }

  sortByRefSerieAsc() {
    this.pagedList = this.seriesList.sort((n1, n2) => n1.numRefSerie - n2.numRefSerie);
    this.sortByDesc = false;

    this.pagedList = this.seriesList.slice(0, 6);
    this.length = this.seriesList.length;
  }

  ngOnDestroy() {
    this.subscriptionForGetAllSeries.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }
  
}