import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { ModalPrivilegeMobileComponent } from './modal-privilege-mobile/modal-privilege-mobile.component';

import { UsersListService } from 'src/app/shared/services/list-users.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
  selector: 'list-users-mobile',
  templateUrl: './list-users-mobile.component.html',
  styleUrls: ['./list-users-mobile.scss']
})

export class ListUsersMobileComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<FirebaseUserModel>();
  displayedColumns: string[] = ['picture', 'name', 'email', 'password', 'connected' , 'star'];

  userToDelete: FirebaseUserModel = new FirebaseUserModel();

  modalRefDeleteUser: any;

  queryEmail: string = '';

  subscriptionForGetAllUsers: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public usersListService: UsersListService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.getAllUsers();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllUsers() {
    this.subscriptionForGetAllUsers = this.usersListService
    .getAll()
    .subscribe((users: FirebaseUserModel[]) => { 
      if (this.queryEmail) this.dataSource.data = users.filter(user => user.email.toLowerCase().includes(this.queryEmail.toLowerCase())).sort((n1, n2) => n2.numRefUser - n1.numRefUser);
      else this.dataSource.data = users.sort((n1, n2) => n2.numRefUser - n1.numRefUser);
    });
  }

  changeRoleStatus(user: FirebaseUserModel) {
    if (user.roleMovies == false) {
      if (user.roleAddMovie == true) user.roleAddMovie = false;
      if (user.roleUpdateMovie == true) user.roleUpdateMovie = false;
      if (user.roleDeleteMovie == true) user.roleDeleteMovie = false;
    }
    if (user.roleAnimes == false) {
      if (user.roleAddAnime == true) user.roleAddAnime = false;
      if (user.roleUpdateAnime == true) user.roleUpdateAnime = false;
      if (user.roleDeleteAnime == true) user.roleDeleteAnime = false;
    }
    if (user.roleSeries == false) {
      if (user.roleAddSerie == true) user.roleAddSerie = false;
      if (user.roleUpdateSerie == true) user.roleUpdateSerie = false;
      if (user.roleDeleteSerie == true) user.roleDeleteSerie = false;
    }
    if (user.roleFiles == false) {
      if (user.roleAddFile == true) user.roleAddFile = false;
      if (user.roleUpdateFile == true) user.roleUpdateFile = false;
      if (user.roleDeleteFile == true) user.roleDeleteFile = false;
    }
    if (user.roleDebts == false) {
      if (user.roleAddDebt == true) user.roleAddDebt = false;
      if (user.roleUpdateDebt == true) user.roleUpdateDebt = false;
      if (user.roleDeleteDebt == true) user.roleDeleteDebt = false;
    }
    this.usersListService.update(user.key, user);
  }

  openModalPrivileges(user: FirebaseUserModel) {
    const dialogRef = this.dialogService.open(ModalPrivilegeMobileComponent, {
      width: '98vw',
      height:'73vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.currentUser = user;
    dialogRef.componentInstance.dialogRef = dialogRef;
  }

  openDeleteUserModal(user: FirebaseUserModel, contentDeleteUser) {
    this.userToDelete = user;
    this.modalRefDeleteUser =  this.dialogService.open(contentDeleteUser, {
      width: '98vw',
      height:'50vh',
      maxWidth: '100vw'
    }); 
  }

  confirmDelete() {
    this.usersListService.delete(this.userToDelete.key);
  }

  close() {
    this.modalRefDeleteUser.close();
  }

  ngOnDestroy() {
    this.subscriptionForGetAllUsers.unsubscribe();
  }
  
}
