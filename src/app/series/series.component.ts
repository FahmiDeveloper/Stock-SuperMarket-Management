import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SerieFormComponent } from './serie-form/serie-form.component';

import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { SerieService } from '../shared/services/serie.service';

import { FirebaseUserModel } from '../shared/models/user.model';
import { Serie } from '../shared/models/serie.model';

@Component({
  selector: 'app-series',
  templateUrl: './series.component.html',
  styleUrls: ['./series.component.scss']
})

export class SeriesComponent implements OnInit, OnDestroy {

  filteredSeries: Serie[];
  p: number = 1;
  // queryDate: string = "";
  queryName: string = "";
  queryNote: string = "";
  statusId: number;

  user: FirebaseUserModel = new FirebaseUserModel();

  subscriptionForGetAllSeries: Subscription;
  subscriptionForUser: Subscription;

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
    protected modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAllSeries();
    this.getRolesUser();
  }

  getAllSeries() {
    this.subscriptionForGetAllSeries = this.serieService
    .getAll()
    .subscribe(series => {
      if (this.queryName) 
      this.filteredSeries = series.filter(serie => serie.nameSerie.toLowerCase().includes(this.queryName.toLowerCase()));
      
      else if (this.queryNote) 
      this.filteredSeries = series.filter(serie => serie.note.toLowerCase().includes(this.queryNote.toLowerCase()));
      
      // else if (this.queryDate) 
      // this.filteredSeries = series.filter(serie => serie.date.includes(this.queryDate));
      
      else if (this.statusId) 
      this.filteredSeries = series.filter(serie => serie.statusId == this.statusId);   
      
      else this.filteredSeries = series;

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
    // this.queryDate = "";
    this.queryName = "";
    this.statusId = null;
    this.getAllSeries();
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

  newSerie() {
    const modalRef = this.modalService.open(SerieFormComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
  }

  editSerie(serie?: Serie) {
    const modalRef = this.modalService.open(SerieFormComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
    modalRef.componentInstance.serie = serie;
  }

  ngOnDestroy() {
    this.subscriptionForGetAllSeries.unsubscribe();
    this.subscriptionForUser.unsubscribe();
  }
}

export interface StatusSeries {
  id: number,
  status: string
}

