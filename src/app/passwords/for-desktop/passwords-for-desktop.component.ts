import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';
import Swal from 'sweetalert2';

import { PasswordFormDesktopComponent } from './password-form-desktop/password-form-desktop.component';

import { PasswordService } from 'src/app/shared/services/password.service';

import { Password } from 'src/app/shared/models/password.model';

@Component({
  selector: 'passwords-for-desktop',
  templateUrl: './passwords-for-desktop.component.html',
  styleUrls: ['./passwords-for-desktop.scss']
})

export class PasswordsForDesktopComponent implements OnInit, OnDestroy {

  passwordsList: Password[] = [];
  pagedList: Password[]= [];
  passwordsListCopie: Password[] = [];

  content: string = '';
  isDesktop: boolean;

  length: number = 0;
  pageSize: number = 6;
  pageSizeOptions: number[] = [6];

  subscriptionForGetAllPassword: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    public passwordService: PasswordService,
    public dialogService: MatDialog,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.isDesktop = this.deviceService.isDesktop();
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
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  newPassword() {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(PasswordFormDesktopComponent, config);

    dialogRef.componentInstance.arrayPasswords = this.passwordsListCopie;
  }

  editPassword(password?: Password) {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(PasswordFormDesktopComponent, config);
    
    dialogRef.componentInstance.password = password;
    dialogRef.componentInstance.pagedList = this.pagedList;

    dialogRef.afterClosed().subscribe(res => {
      this.pagedList = res;
    });
  }

  deletePassword(passwordKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this password!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.passwordService.delete(passwordKey);
        Swal.fire(
          'Password has been deleted successfully',
          '',
          'success'
        )
      }
    })
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

  followLink(path: string) {
    window.open(path);
  }

  ngOnDestroy() {
    this.subscriptionForGetAllPassword.unsubscribe();
  }

}