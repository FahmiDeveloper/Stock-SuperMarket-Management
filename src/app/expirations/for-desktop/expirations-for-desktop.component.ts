import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as moment from 'moment';

import { ExpirationFormForDesktopComponent } from './expiration-form-for-desktop/expiration-form-for-desktop.component';

import { ExpirationService } from 'src/app/shared/services/expiration.service';

import { Expiration } from 'src/app/shared/models/expiration.model';

@Component({
  selector: 'expirations-for-desktop',
  templateUrl: './expirations-for-desktop.component.html',
  styleUrls: ['./expirations-for-desktop.scss']
})

export class ExpirationsForDesktopComponent implements OnInit, OnDestroy {

  expirationsList: Expiration[] = [];
  expirationsListCopie: Expiration[] = [];

  p: number = 1;

  content: string = '';
  innerWidth: any;

  menuTopLeftPosition =  {x: '0', y: '0'} 

  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger; 

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
    const now = new Date();
    const dateExpiration = (new Date(expiration.dateExpiration)).getTime();
    const nowTime = now.getTime();

    const diff = Math.abs(dateExpiration - nowTime);

    let diffEnDays  = Math.round(diff / (1000 * 60 * 60  * 24));

    var years = Math.floor(diffEnDays / 365);
    var months = Math.floor(diffEnDays % 365 / 30);
    var days = Math.floor(diffEnDays % 365 % 30);

    expiration.restdays = years + "Y " + months + "M " + days + "D";

    expiration.isExpired = nowTime > dateExpiration || expiration.restdays == 0 + "Y " + 0 + "M " + 0 + "D"  ? true : false ;
    if (expiration.isExpired == false)
    {
      this.checkSoonToExpire(expiration);
    }
  }

  checkSoonToExpire(expiration: Expiration) {
    var dateNow = moment(new Date(),'yyyy-MM-DD');
    var dateExp = moment(expiration.dateExpiration);

    expiration.soonToExpire = dateExp.diff(dateNow, 'days') >= 1 && dateExp.diff(dateNow, 'days') <= 7  ? true : false ; 
  }

  newExpiration() {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(ExpirationFormForDesktopComponent, config);

    dialogRef.componentInstance.arrayExpirations = this.expirationsListCopie;
  }

  editExpiration(expiration?: Expiration) {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(ExpirationFormForDesktopComponent, config);
    
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

  onRightClick(event: MouseEvent, expiration: Expiration) { 
    // preventDefault avoids to show the visualization of the right-click menu of the browser 
    event.preventDefault(); 

    // we record the mouse position in our object 
    this.menuTopLeftPosition.x = event.clientX + 'px'; 
    this.menuTopLeftPosition.y = event.clientY + 'px'; 

    // we open the menu 
    // we pass to the menu the information about our object 
    this.matMenuTrigger.menuData = {expiration: expiration};

    // we open the menu 
    this.matMenuTrigger.openMenu(); 
  }

  ngOnDestroy() {
    this.subscriptionForGetAllExpirations.unsubscribe();
  }

}