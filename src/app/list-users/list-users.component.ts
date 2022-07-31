import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { UserService } from '../shared/services/user.service';

import { FirebaseUserModel } from '../shared/models/user.model';

@Component({
  selector: 'list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.scss']
})

export class ListUsersComponent implements OnInit, OnDestroy {

  listUsers: FirebaseUserModel[] = [];

  p: number = 1;
  queryName: string = '';

  subscriptionForGetAllUsers: Subscription;

  roles: Roles[] = [
    {id: 1, roleName: 'Movies'}, 
    {id: 2, roleName: 'Animes'}, 
    {id: 3, roleName: 'Series'}, 
    {id: 4, roleName: 'Files'},
    {id: 5, roleName: 'Debts'},
    {id: 6, roleName: 'Users'}
  ];

  constructor(public userService: UserService) {}

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

  ngOnDestroy() {
    this.subscriptionForGetAllUsers.unsubscribe();
  }
}

export interface Roles {
    id: number,
    roleName: string
}
