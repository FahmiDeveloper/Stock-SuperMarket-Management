import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { NewOrEditSerieComponent } from './new-or-edit-serie/new-or-edit-serie.component';
import { ShowSeriePictureComponent } from '../show-serie-picture';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SerieService } from 'src/app/shared/services/serie.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Serie, StatusSeries } from 'src/app/shared/models/serie.model';


@Component({
  selector: 'app-version-grid-series',
  templateUrl: './version-grid-series.component.html',
  styleUrls: ['./version-grid-series.component.scss']
})

export class VersionGridSeriesComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Serie>();
  displayedColumns: string[] = ['picture', 'name', 'date', 'status', 'note', 'star'];

  queryName: string = "";
  queryNote: string = "";
  statusId: number;
  sortByDesc: boolean = true;

  subscriptionForGetAllSeries: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

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
    public authService: AuthService,
    protected modalService: NgbModal,
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
              this.userService
                .get(user.uid)
                .valueChanges()
                .subscribe(dataUser=>{
                  this.user = dataUser;
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

  newSerie() {
    const dialogRef = this.dialogService.open(NewOrEditSerieComponent, {
      width: '98vw',
      height:'73vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.arraySeries = this.dataSource.data;
    dialogRef.componentInstance.modalRef = dialogRef;
  }

  editSerie(serie?: Serie) {
    const dialogRef = this.dialogService.open(NewOrEditSerieComponent, {
      width: '98vw',
      height:'73vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.serie = serie;
    dialogRef.componentInstance.modalRef = dialogRef;
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

  zoomPicture(serie?: Serie) {
    const dialogRef = this.dialogService.open(ShowSeriePictureComponent, {
      width: '98vw',
      height:'77vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.serieForModal = serie;
    dialogRef.componentInstance.dialogRef = dialogRef;
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
  }
}


