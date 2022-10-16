import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { Subscription } from 'rxjs';

import firebase from 'firebase';

import { DeviceDetectorService } from 'ngx-device-detector';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UsersListService } from 'src/app/shared/services/list-users.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  isConnected:boolean;
  user: firebase.User;
  userName: string;
  subscriptipn: Subscription;
  isMobile: boolean;
  allUsers: FirebaseUserModel[] = [];


  constructor(
    private afAuth: AngularFireAuth, 
    public authService: AuthService, 
    private router: Router,
    private deviceService: DeviceDetectorService,
    public usersListService: UsersListService

  ) {}

  ngOnInit() {
    this.getUserData();
    this.checkIfUserIsConnected();
    this.isMobile = this.deviceService.isMobile();
    this.getAllUsers();
  }

  getUserData() {
    this.subscriptipn = this.afAuth
      .authState
      .subscribe(user => {
        this.user = user;
        if(this.user && !this.user.displayName) {
          this.getNameFromEmail(this.user.email);
        }
    })
  }

  getNameFromEmail(email) {
    this.userName = email.substring(0, email.lastIndexOf("@"));
  }

  checkIfUserIsConnected() {
    this.authService.isConnected.subscribe(res=>{
      this.isConnected=res;
    })
  }

  getAllUsers() {
    this.usersListService
    .getAll()
    .subscribe((users: FirebaseUserModel[]) => {
      this.allUsers = users;
    });
  }

  logout(){
    this.authService
      .doLogout()
      .then((res) => {
        this.router.navigate(['/login']);
        this.authService.isConnected.next(false);
        this.putCurrentUserConnected(this.user.email);
      }, (error) => {
        console.log("Logout error", error);
    });
  }
  

  putCurrentUserConnected(email: string) {
    let connectedUserFromList: FirebaseUserModel;
    connectedUserFromList = this.allUsers.find(user => user.email == email);
    connectedUserFromList.isConnected = false;
    this.usersListService.update(connectedUserFromList.key, connectedUserFromList);
  }

  ngOnDestroy() {
    this.subscriptipn.unsubscribe();
  }
  
}
