import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';

import { SerieFormDesktopComponent } from './serie-form-desktop/serie-form-desktop.component';

import { AuthService } from '../../shared/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { SerieService } from '../../shared/services/serie.service';
import { UsersListService } from '../../shared/services/list-users.service';

import { FirebaseUserModel } from '../../shared/models/user.model';
import { Serie, StatusSeries } from '../../shared/models/serie.model';

@Component({
    selector: 'series-for-desktop',
    templateUrl: './series-for-desktop.component.html',
    styleUrls: ['./series-for-desktop.scss']
})

export class SeriesForDesktopComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Serie>();
  dataSourceCopie = new MatTableDataSource<Serie>();
  displayedColumns: string[] = ['picture', 'details'];
  allSeries: Serie[] = [];
  listSeriesByCurrentName: Serie[] = [];

  serieToDelete: Serie = new Serie();

  queryName: string = '';
  statusId: number;
  sortByDesc: boolean = true;
  currentName: string = '';

  subscriptionForGetAllSeries: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  modalRefDeleteSerie: any;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

  statusSeries: StatusSeries[] = [
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
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.getRolesUser();
    this.getAllSeries();
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

  getAllSeries() {
    this.subscriptionForGetAllSeries = this.serieService
    .getAll()
    .subscribe(series => {
      this.dataSourceCopie.data = series.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
      this.allSeries = series;

      if (this.queryName) {
        this.dataSource.data = series.filter(serie => (serie.nameSerie.toLowerCase().includes(this.queryName.toLowerCase())) && (serie.isFirst == true));
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
      }
      
      else if (this.statusId) {
        if (this.statusId == 6) this.dataSource.data = series.filter(serie => (serie.priority) && (serie.isFirst == true));

        else this.dataSource.data = series.filter(serie => (serie.statusId == this.statusId) && (serie.isFirst == true) && (!serie.priority));
           
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
      }
      
      else this.dataSource.data = series.filter(serie => serie.isFirst == true).sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);

      this.getStatusSerie();
    });
  }

  getStatusSerie() {
    this.dataSource.data.forEach(element=>{
      this.statusSeries.forEach(statusSerie => {
        if (statusSerie.id == element.statusId) {
          element.status = statusSerie.status;
          element.note = element.note ? element.note : '-';
        }
      })
    })
  }

  newSerie() {
    const dialogRef = this.dialogService.open(SerieFormDesktopComponent, {width: '800px', data: {movie: {}}});
    dialogRef.componentInstance.arraySeries = this.dataSourceCopie.data; 
    dialogRef.componentInstance.allSeries = this.allSeries; 
  }

  editSerie(serie?: Serie) {
    const dialogRef = this.dialogService.open(SerieFormDesktopComponent, {width: '800px'});
    dialogRef.componentInstance.serie = serie;
  } 

  openDeleteSerieModal(serie: Serie, contentDeleteSerie) {
    this.serieToDelete = serie;
    this.modalRefDeleteSerie =  this.dialogService.open(contentDeleteSerie, {
      width: '30vw',
      height:'35vh',
      maxWidth: '100vw'
    }); 
  }

  confirmDelete() {
    this.serieService.delete(this.serieToDelete.key);
  }

  close() {
    this.modalRefDeleteSerie.close();
  }

  copyNameSerie(nameSerie: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = nameSerie;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  sortByRefSerieDesc() {
    this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
    this.sortByDesc = true;
  }

  sortByRefSerieAsc() {
    this.dataSource.data = this.dataSource.data.sort((n1, n2) => n1.numRefSerie - n2.numRefSerie);
    this.sortByDesc = false;
  }

  onContextMenu(event: MouseEvent, serie: Serie) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'serie': serie };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  viewOtherSeasons(currentSerie: Serie, contentSeasonsList) {
    this.currentName = currentSerie.nameSerie;
    this.listSeriesByCurrentName = this.allSeries.filter(serie => (serie.nameSerie.toLowerCase().includes(currentSerie.nameSerie.toLowerCase())));

    this.dialogService.open(contentSeasonsList, {
      width: '40vw',
      height:'70vh',
      maxWidth: '100vw'
    }); 
  }

  ngOnDestroy() {
    this.subscriptionForGetAllSeries.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }
  
}