import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Serie } from 'src/app/shared/models/serie.model';
import { SerieService } from 'src/app/shared/services/serie.service';
import { NewOrEditSerieComponent } from './new-or-edit-serie/new-or-edit-serie.component';


@Component({
  selector: 'app-version-grid-series',
  templateUrl: './version-grid-series.component.html',
  styleUrls: ['./version-grid-series.component.scss']
})
export class VersionGridSeriesComponent implements OnInit {

  series: Serie[];
  filteredSeries: Serie[];

  subscriptionForGetAllSeries: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  isGrid: boolean = false;

  queryDate: string = "";

  statusId: number;
  
  statusSeries: StatusSeries[] = [
    {id: 1, status: 'Wait to sort'}, 
    {id: 2, status: 'Not downloaded yet'}, 
    {id: 3, status: 'Watched'}, 
    {id: 4, status: 'Downloaded but not watched yet'},
    {id: 5, status: 'To search about it'}
  ];

  modalRefSearch: any;

  queryName: string = "";

  constructor(
    private serieService: SerieService, 
    public userService: UserService,
    public authService: AuthService,
    protected modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAllSeries();
    this.getRolesUser();
    this.isGrid = true;
  }

  getAllSeries() {
    if (this.queryName) {
        this.filteredSeries = this.series.filter(serie => serie.nameSerie.toLowerCase().includes(this.queryName.toLowerCase()));
        this.modalRefSearch.close();
    } else if (this.queryDate) {
        this.filteredSeries = this.series.filter(serie => serie.date.includes(this.queryDate));
        this.modalRefSearch.close();
    } else {
      this.subscriptionForGetAllSeries = this.serieService
      .getAll()
      .subscribe(series => {
        this.filteredSeries = this.series = series;
        this.getStatusSerie();
      });
    }  
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

  delete(serieId) {
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

  clear() {
    this.queryName = "";
    this.queryDate = "";
    this.statusId = null;
    this.getAllSeries();
    this.modalRefSearch.close();
  }

  newSerie() {
    const modalRef = this.modalService.open(NewOrEditSerieComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
  }

  editSerie(serie?: Serie) {
    const modalRef = this.modalService.open(NewOrEditSerieComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
    modalRef.componentInstance.serie = serie;
  }

  getStatusSerie() {
    this.filteredSeries.forEach(element=>{

      this.statusSeries.forEach(statusSerie => {
        if (statusSerie.id == element.statusId) {
             element.status = statusSerie.status;
             element.note = element.note ? element.note : '-';
        }
      })
    })
  }

  filetrByStatus(statusId: number) {
    this.filteredSeries = (statusId)
      ? this.series.filter(serie => serie.statusId == statusId)
      : this.series;
      this.modalRefSearch.close();
  }

  openModalSearch(contentModalSearch) {
    this.modalRefSearch = this.modalService.open(contentModalSearch as Component, { size: 'lg', centered: true });
  }

  ngOnDestroy() {
    this.subscriptionForGetAllSeries.unsubscribe();
  }

}

export interface StatusSeries {
  id: number,
  status: string
}


