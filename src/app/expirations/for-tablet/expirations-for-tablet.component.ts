import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { ExpirationFormForTabletComponent } from './expiration-form-for-tablet/expiration-form-for-tablet.component';

import { ExpirationService } from 'src/app/shared/services/expiration.service';

import { Expiration } from 'src/app/shared/models/expiration.model';
import * as moment from 'moment';

@Component({
  selector: 'expirations-for-tablet',
  templateUrl: './expirations-for-tablet.component.html',
  styleUrls: ['./expirations-for-tablet.scss']
})

export class ExpirationsForTabletComponent implements OnInit, OnDestroy {

  expirationsList: Expiration[] = [];
  expirationsListCopie: Expiration[] = [];

  p = 1;

  content = '';
  innerWidth: any;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  subscriptionForGetAllExpirations: Subscription;
    
  constructor(
    public expirationService: ExpirationService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.getAllExpirations();
  }

  getAllExpirations() {
    this.subscriptionForGetAllExpirations = this.expirationService
    .getAll()
    .subscribe((expirations: Expiration[]) => {

      this.expirationsListCopie = expirations.sort((n1, n2) => n2.numRefExpiration - n1.numRefExpiration);

      if (this.content) {
        this.expirationsList = expirations.filter(expiration => expiration.contentName.toLowerCase().includes(this.content.toLowerCase()));
        this.expirationsList = this.expirationsList.sort((n1, n2) => new Date(n1.dateExpiration).getTime() - new Date(n2.dateExpiration).getTime());
      }

      else {
        this.expirationsList = expirations.sort((n1, n2) => new Date(n1.dateExpiration).getTime() - new Date(n2.dateExpiration).getTime());
      }

      this.expirationsList.forEach(expiration => {
        this.calculateDateDiff(expiration);
        this.calculateRestDays(expiration);
      })
           
    });
  }

  OnPageChange(event: PageEvent){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  calculateDateDiff(expiration: Expiration) {
    var dateStart:any = new Date(expiration.dateStart);
    var dateExpiration:any = new Date(expiration.dateExpiration);
    var dateDiff = new Date(dateExpiration - dateStart);

    expiration.duration = Math.abs(dateDiff.getUTCFullYear() - 1970) + "Y " + (dateDiff.getMonth()) + "M " + dateDiff.getDate() + "D";
  }

  calculateRestDays(expiration: Expiration) {
    const nowTime = new Date();
    const dateExpiration = new Date(expiration.dateExpiration);

    const diff = Math.abs(dateExpiration.getTime() - nowTime.getTime());

    let diffInDays  = Math.round(diff / (1000 * 60 * 60  * 24));

    var years = Math.floor(diffInDays / 365);
    var months = Math.floor(diffInDays % 365 / 30);
    var days = Math.floor(diffInDays % 365 % 30);

    expiration.restdays = years + "Y " + months + "M " + days + "D";

    if (years == 0 && months == 0) {
      if (nowTime == dateExpiration || nowTime > dateExpiration) {  
        expiration.isExpired = true;
      }else {
        expiration.isExpired = false;
        expiration.soonToExpire = days >= 1 && days <= 7  ? true : false ;      
      }
    } else if (years !== 0 || months !== 0) {
      expiration.isExpired = false;
      expiration.soonToExpire = false ;      
    }   
  }

  newExpiration() {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(ExpirationFormForTabletComponent, config);

    dialogRef.componentInstance.arrayExpirations = this.expirationsListCopie;
  }

  editExpiration(expiration?: Expiration) {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(ExpirationFormForTabletComponent, config);
    
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