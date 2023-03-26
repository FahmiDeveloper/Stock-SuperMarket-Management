import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { ExpirationFormDesktopComponent } from './expiration-form-desktop/expiration-form-desktop.component';

import { ExpirationService } from 'src/app/shared/services/expiration.service';

import { Expiration } from 'src/app/shared/models/expiration.model';

@Component({
  selector: 'expirations-for-desktop',
  templateUrl: './expirations-for-desktop.component.html',
  styleUrls: ['./expirations-for-desktop.scss']
})

export class ExpirationsForDesktopComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Expiration>();
  dataSourceCopie = new MatTableDataSource<Expiration>();
  displayedColumns: string[] = ['content', 'cost', 'date', 'diffdays', 'note', 'expiredPicture', 'star'];

  expirationsList: Expiration[] = [];
  pagedList: Expiration[]= [];
  length: number = 0;

  isDesktop: boolean;
  isTablet: boolean;
  content: string = '';

  subscriptionForGetAllExpirations: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
    
  constructor(
    public expirationService: ExpirationService,
    public dialogService: MatDialog,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();
    if (this.isDesktop) {this.getAllExpirationsForDesktop();}
    else {this.getAllExpirationsForTablet();}
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllExpirationsForDesktop() {
    this.subscriptionForGetAllExpirations = this.expirationService
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

  getAllExpirationsForTablet() {
    this.subscriptionForGetAllExpirations = this.expirationService
    .getAll()
    .subscribe((expirations: Expiration[]) => {

      this.dataSourceCopie.data = expirations.sort((n1, n2) => n2.numRefExpiration - n1.numRefExpiration);

      if (this.content) {
        this.expirationsList = expirations.filter(expiration => expiration.contentName.toLowerCase().includes(this.content.toLowerCase()));
        this.expirationsList = this.expirationsList.sort((n1, n2) => new Date(n1.dateExpiration).getTime() - new Date(n2.dateExpiration).getTime());
      }

      else {this.expirationsList = expirations.sort((n1, n2) => new Date(n1.dateExpiration).getTime() - new Date(n2.dateExpiration).getTime());}

      this.pagedList = this.expirationsList.slice(0, 6);
      this.length = this.expirationsList.length;

      this.expirationsList.forEach(expiration => {
        this.calculateDateDiff(expiration);
        this.checkExpiredStatus(expiration);
        this.calculateRestDays(expiration);
      })
           
    });
  }

  OnPageChange(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedList = this.expirationsList.slice(startIndex, endIndex);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
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
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(ExpirationFormDesktopComponent, config);

    dialogRef.componentInstance.arrayExpirations = this.dataSourceCopie.data;
  }

  editExpiration(expiration?: Expiration) {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(ExpirationFormDesktopComponent, config);
    
    dialogRef.componentInstance.expiration = expiration;
    dialogRef.componentInstance.pagedList = this.pagedList;

    dialogRef.afterClosed().subscribe(res => {
      this.pagedList = res;
    });
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

  viewNote(expirationNote: string) {
    Swal.fire({
      text: expirationNote,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Close'
    });
  }

  ngOnDestroy() {
    this.subscriptionForGetAllExpirations.unsubscribe();
  }

}