import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../shared/services/user.service';

import { FirebaseUserModel } from '../shared/models/user.model';

@Component({
  selector: 'list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.scss']
})

export class ListUsersComponent implements OnInit, OnDestroy {

  listUsers: FirebaseUserModel[] = [];
  currentUser: FirebaseUserModel;

  p: number = 1;
  queryName: string = '';
  modalRefPrivileges: any;

  subscriptionForGetAllUsers: Subscription;

  roles: Roles[] = [
    {id: 1, roleName: 'Movies'}, 
    {id: 2, roleName: 'Animes'}, 
    {id: 3, roleName: 'Series'}, 
    {id: 4, roleName: 'Files'},
    {id: 5, roleName: 'Debts'},
    {id: 6, roleName: 'Users'}
  ];

  constructor(public userService: UserService, protected modalService: NgbModal) {}

  ngOnInit() {
    this.getAllUsers();
  }

  getAllUsers() {
    this.subscriptionForGetAllUsers = this.userService
    .getAll()
    .subscribe((users: FirebaseUserModel[]) => { 
        if (this.queryName) this.listUsers = users.filter(user => user.email.toLowerCase().includes(this.queryName.toLowerCase()));
        else this.listUsers = users;
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
    this.userService.update(user.key, user);
  }

  deleteUser(userId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.userService.delete(userId);
        Swal.fire(
          'User has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  openModalPrivileges(contentModalPrivileges, user: FirebaseUserModel) {
    this.currentUser = user;
    this.modalRefPrivileges = this.modalService.open(contentModalPrivileges as Component, { windowClass : "PrivilegesModalClass", centered: true});
  }

  changePrivliegeStatus(currentUser: FirebaseUserModel) {
    this.userService.update(currentUser.key, currentUser);
  }

  ngOnDestroy() {
    this.subscriptionForGetAllUsers.unsubscribe();
  }
}

export interface Roles {
    id: number,
    roleName: string
}
