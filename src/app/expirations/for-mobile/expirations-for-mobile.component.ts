import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { ExpirationFormMobileComponent } from './expiration-form-mobile/expiration-form-mobile.component';

import { ExpirationService } from 'src/app/shared/services/expiration.service';

import { Expiration } from 'src/app/shared/models/expiration.model';

@Component({
  selector: 'expirations-for-mobile',
  templateUrl: './expirations-for-mobile.component.html',
  styleUrls: ['./expirations-for-mobile.scss']
})

export class ExpirationsForMobileComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Expiration>();
  dataSourceCopie = new MatTableDataSource<Expiration>();
  displayedColumns: string[] = ['content', 'cost', 'start','expiration', 'duration', 'rest', 'status', 'note', 'star'];

  content: string = '';

  subscriptionForGetAllExpiration: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  
  contextMenuPosition = { x: '0px', y: '0px' };

  constructor(
    public expirationService: ExpirationService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.getAllExpirations();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllExpirations() {
    this.subscriptionForGetAllExpiration = this.expirationService
    .getAll()
    .subscribe((expirations: Expiration[]) => {

      this.dataSourceCopie.data = expirations.sort((n1, n2) => n2.numRefExpiration - n1.numRefExpiration);

      if (this.content) {
        this.dataSource.data = expirations.filter(expiration => expiration.contentName.toLowerCase().includes(this.content.toLowerCase()));
        this.dataSource.data = this.dataSource.data.sort((n1, n2) => new Date(n1.dateExpiration).getTime() - new Date(n2.dateExpiration).getTime());
      }

      else {this.dataSource.data = expirations.sort((n1, n2) => new Date(n1.dateExpiration).getTime() - new Date(n2.dateExpiration).getTime());}

      this.dataSource.data.forEach(expiration => {
        this.calculateDateDiff(expiration);
        this.checkExpiredStatus(expiration);
        this.calculateRestDays(expiration);
      })
           
    });
  }

  calculateDateDiff(expiration: Expiration) {
    var dateStart:any = new Date(expiration.dateStart);
    var dateExpiration:any = new Date(expiration.dateExpiration);
    var dateDiff = new Date(dateExpiration - dateStart);

    expiration.duration = Math.abs(dateDiff.getUTCFullYear() - 1970) + "Y " + (dateDiff.getMonth()) + "M " + dateDiff.getDate() + "D";
  }

  checkExpiredStatus(expiration: Expiration) {
    let currentDate = new Date();
    let composedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    let dateExpiration = new Date(expiration.dateExpiration);

    expiration.isExpired = (composedDate.getTime() > dateExpiration.getTime()) ? true : false ;
  }

  calculateRestDays(expiration: Expiration) { 
    const now = new Date();
    const dateExpiration = (new Date(expiration.dateExpiration)).getTime();
    const nowTime = now.getTime();

    const diff = Math.abs(dateExpiration - nowTime);

    let diffEnDays  = Math.round(diff / (1000 * 60 * 60  * 24));

    var years = Math.floor(diffEnDays / 365);
    var months = Math.floor(diffEnDays % 365 / 30);
    var days = Math.floor(diffEnDays % 365 % 30);

    expiration.restdays = years + "Y " + months + "M " + days + "D";
  }

  newExpiration() {
    const dialogRef = this.dialogService.open(ExpirationFormMobileComponent, {
      width: '98vw',
      height:'68vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.arrayExpirations = this.dataSourceCopie.data;
  }

  editExpiration(expiration?: Expiration) {
    const dialogRef = this.dialogService.open(ExpirationFormMobileComponent, {
      width: '98vw',
      height:'68vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.expiration = expiration;
  }

  deleteExpiration(expirationKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this expiration!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.expirationService.delete(expirationKey);
        Swal.fire(
          'Expiration has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  ngOnDestroy() {
    this.subscriptionForGetAllExpiration.unsubscribe();
  }

}
