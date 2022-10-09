import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { SerieFormComponent } from './serie-form/serie-form.component';

import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { SerieService } from '../shared/services/serie.service';
import { UsersListService } from '../shared/services/list-users.service';

import { FirebaseUserModel } from '../shared/models/user.model';
import { Serie, StatusSeries } from '../shared/models/serie.model';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})

export class SeriesComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Serie>();
  dataSourceCopie = new MatTableDataSource<Serie>();
  displayedColumns: string[] = ['picture', 'details', 'actions'];

  queryName: string = "";
  queryNote: string = "";
  statusId: number;
  sortByDesc: boolean = true;

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
    this.getAllSeries();
    this.getRolesUser();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllSeries() {
    this.subscriptionForGetAllSeries = this.serieService
    .getAll()
    .subscribe(series => {
      this.dataSourceCopie.data = series.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);

      if (this.queryName) {
        this.dataSource.data = series.filter(serie => serie.nameSerie.toLowerCase().includes(this.queryName.toLowerCase()));
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
      }
      
      else if (this.queryNote) {
        this.dataSource.data = series.filter(serie => serie.note.toLowerCase().includes(this.queryNote.toLowerCase()));
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
      }
      
      else if (this.statusId) {
        this.dataSource.data = series.filter(serie => serie.statusId == this.statusId);   
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
      }
      
      else this.dataSource.data = series.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);

      this.getStatusSerie();
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
    const dialogRef = this.dialogService.open(SerieFormComponent, {width: '800px', data: {movie: {}}});
    dialogRef.componentInstance.arraySeries = this.dataSourceCopie.data; 
  }

  editSerie(serie?: Serie) {
    const dialogRef = this.dialogService.open(SerieFormComponent, {width: '800px'});
    dialogRef.componentInstance.serie = serie;
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

  ngOnDestroy() {
    this.subscriptionForGetAllSeries.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }
  
}

