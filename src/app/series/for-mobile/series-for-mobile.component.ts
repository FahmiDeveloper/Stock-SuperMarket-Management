import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { SerieDetailsWithSeasonsMobileComponent } from './serie-details-with-seasons-mobile/serie-details-with-seasons-mobile.component';
import { SerieFormMobileComponent } from './serie-form-mobile/serie-form-mobile.component';

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { SerieService } from 'src/app/shared/services/serie.service';
import { UsersListService } from '../../shared/services/list-users.service';

import { FirebaseUserModel } from '../../shared/models/user.model';
import { Serie, StatusSeries } from 'src/app/shared/models/serie.model';

@Component({
    selector: 'series-for-mobile',
    templateUrl: './series-for-mobile.component.html',
    styleUrls: ['./series-for-mobile.scss']
})

export class SeriesForMobileComponent implements OnInit, OnDestroy {

  seriesList: Serie[] = [];
  pagedList: Serie[]= [];
  seriesListCopie: Serie[] = [];
  allSeries: Serie[] = [];
  listSeasonsByParentSerieKey: Serie[] = [];

  serieName: string = '';
  statusId: number;
  sortByDesc: boolean = true;
 
  length: number = 0;
  pageSize: number = 6;
  pageSizeOptions: number[] = [6];

  subscriptionForGetAllSeries: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  statusSeries: StatusSeries[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 5, status: 'To search about it'}
  ];

  constructor(
    private serieService: SerieService, 
    public userService: UserService,
    public usersListService: UsersListService,
    public authService: AuthService,
    public dialogService: MatDialog
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

    });
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

  showDetailsSerie(serieSelected: Serie) {
    this.listSeasonsByParentSerieKey = this.allSeries
    .filter(serie => (serie.key == serieSelected.key) || (serie.parentSerieKey == serieSelected.key))
    .sort((n1, n2) => n1.priority - n2.priority);

    const dialogRef = this.dialogService.open(SerieDetailsWithSeasonsMobileComponent, {
      width: '98vw',
      height:'75vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.serie = serieSelected;
    dialogRef.componentInstance.allSeries = this.allSeries;
    dialogRef.componentInstance.listSeasonsByParentSerieKey = this.listSeasonsByParentSerieKey;
  }

  newSerie() {
    const dialogRef = this.dialogService.open(SerieFormMobileComponent, {
      width: '98vw',
      height:'75vh',
      maxWidth: '100vw', 
      data: {movie: {}}
    });
    dialogRef.componentInstance.arraySeries = this.seriesListCopie;
    dialogRef.componentInstance.allSeries = this.allSeries;
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
      text: 'delete this serie!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.serieService.delete(serieId);
        Swal.fire(
          'Serie has been deleted successfully',
          '',
          'success'
        )
      }
    })
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
    this.subscriptionForGetAllSeries.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }
}


