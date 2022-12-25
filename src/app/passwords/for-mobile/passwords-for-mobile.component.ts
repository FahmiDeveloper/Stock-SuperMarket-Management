import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { PasswordFormMobileComponent } from './password-form-mobile/password-form-mobile.component';

import { PasswordService } from 'src/app/shared/services/password.service';

import { Password } from 'src/app/shared/models/password.model';

@Component({
  selector: 'passwords-for-mobile',
  templateUrl: './passwords-for-mobile.component.html',
  styleUrls: ['./passwords-for-mobile.scss']
})

export class PasswordsForMobileComponent implements OnInit, OnDestroy {

  passwordsList: Password[] = [];
  pagedList: Password[]= [];
  passwordsListCopie: Password[] = [];

  passwordToDelete: Password = new Password();

  modalRefDeletePassword: any;
  content: string = '';
  length: number = 0;
  pageSize: number = 6;
  pageSizeOptions: number[] = [6];

  subscriptionForGetAllPassword: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    public passwordService: PasswordService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.getAllPasswords();
  }

  getAllPasswords() {
    this.subscriptionForGetAllPassword = this.passwordService
    .getAll()
    .subscribe((passwords: Password[]) => {

      this.passwordsListCopie = passwords.sort((n1, n2) => n2.numRefPassword - n1.numRefPassword);

      if (this.content) {
        this.passwordsList = passwords.filter(password => password.contentName.toLowerCase().includes(this.content.toLowerCase()));
        this.passwordsList = this.passwordsList.sort((n1, n2) => n2.numRefPassword - n1.numRefPassword);
      }  
      else {
        this.passwordsList = passwords.sort((n1, n2) => n2.numRefPassword - n1.numRefPassword);
      }

      this.pagedList = this.passwordsList.slice(0, 6);
      this.length = this.passwordsList.length;
           
    });
  }

  OnPageChange(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedList = this.passwordsList.slice(startIndex, endIndex);
  }

  newPassword() {
    const dialogRef = this.dialogService.open(PasswordFormMobileComponent, {
      width: '98vw',
      height:'71vh',
      maxWidth: '100vw', 
      data: {movie: {}}
    });
    dialogRef.componentInstance.arrayPasswords = this.passwordsListCopie;
  }

  editPassword(password?: Password) {
    const dialogRef = this.dialogService.open(PasswordFormMobileComponent, {
      width: '98vw',
      height:'70vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.password = password;
  }

  openDeletePasswordModal(password: Password, contentDeletePassword) {
    this.passwordToDelete = password;
    this.modalRefDeletePassword =  this.dialogService.open(contentDeletePassword, {
      width: '98vw',
      height:'50vh',
      maxWidth: '100vw'
    }); 
  }

  confirmDelete() {
    this.passwordService.delete(this.passwordToDelete.key);
  }

  close() {
    this.modalRefDeletePassword.close();
  }

  copyCoordinate(coordinate: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = coordinate;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  ngOnDestroy() {
    this.subscriptionForGetAllPassword.unsubscribe();
  }
  
}