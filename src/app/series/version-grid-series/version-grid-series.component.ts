import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NewOrEditSerieComponent } from './new-or-edit-serie/new-or-edit-serie.component';
import { ShowSeriePictureComponent } from '../show-serie-picture';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SerieService } from 'src/app/shared/services/serie.service';
import { UsersListService } from 'src/app/shared/services/list-users.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Serie, StatusSeries } from 'src/app/shared/models/serie.model';


@Component({
  selector: 'app-version-grid-series',
  templateUrl: './version-grid-series.component.html',
  styleUrls: ['./version-grid-series.component.scss']
})

export class VersionGridSeriesComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Serie>();
  dataSourceCopie = new MatTableDataSource<Serie>();
  displayedColumns: string[] = ['picture', 'name', 'status', 'note', 'star'];
  allSeries: Serie[] = [];
  listSeriesByCurrentName: Serie[] = [];

  serieToDelete: Serie = new Serie();

  queryName: string = "";
  // queryNote: string = "";
  statusId: number;
  sortByDesc: boolean = true;
  currentName: string = '';
  modalRefDeleteSerie: any;

  subscriptionForGetAllSeries: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
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
    protected modalService: NgbModal,
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
      
      // else if (this.queryNote) {
      //   this.dataSource.data = series.filter(serie => serie.note.toLowerCase().includes(this.queryNote.toLowerCase()));
      //   this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
      // }
      
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
    const dialogRef = this.dialogService.open(NewOrEditSerieComponent, {
      width: '98vw',
      height:'73vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.arraySeries = this.dataSourceCopie.data;
    dialogRef.componentInstance.allSeries = this.allSeries; 
  }

  editSerie(serie?: Serie) {
    const dialogRef = this.dialogService.open(NewOrEditSerieComponent, {
      width: '98vw',
      height:'73vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.serie = serie;
  }

  openDeleteSerieModal(serie: Serie, contentDeleteSerie) {
    this.serieToDelete = serie;
    this.modalRefDeleteSerie =  this.dialogService.open(contentDeleteSerie, {
      width: '98vw',
      height:'50vh',
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

  zoomPicture(serie: Serie) {
    const dialogRef = this.dialogService.open(ShowSeriePictureComponent, {
      width: '98vw',
      height:'77vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.serieForModal = serie;
    dialogRef.componentInstance.dialogRef = dialogRef;
  }

  sortByRefSerieDesc() {
    this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
    this.sortByDesc = true;
  }

  sortByRefSerieAsc() {
    this.dataSource.data = this.dataSource.data.sort((n1, n2) => n1.numRefSerie - n2.numRefSerie);
    this.sortByDesc = false;
  }

  viewOtherSeasons(currentSerie: Serie, contentSeasonsList) {
    this.currentName = currentSerie.nameSerie;
    this.listSeriesByCurrentName = this.allSeries.filter(serie => (serie.nameSerie.toLowerCase().includes(currentSerie.nameSerie.toLowerCase())));

    this.dialogService.open(contentSeasonsList, {
      width: '98vw',
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


