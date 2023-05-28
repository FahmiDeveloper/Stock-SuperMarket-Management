import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import { Subscription } from 'rxjs';

import firebase from 'firebase';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UsersListService } from 'src/app/shared/services/list-users.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { languages, notifications, userItems } from './header-dummy-data';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit, OnDestroy {

  @Input() collapsed = false;
  @Input() screenWidth = 0;

  isConnected:boolean;
  user: firebase.User;
  userName: string;
  subscriptipn: Subscription;
  allUsers: FirebaseUserModel[] = [];

  canShowSearchAsOverlay = false;
  isOpenOverlaySearch = false;
  isOpenOverlayFlags = false;
  isOpenOverlayNotifs = false;
  isOpenOverlayUser = false;
  selectedLanguage: any;

  languages = languages;
  notifications = notifications;
  userItems = userItems;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  constructor(
    private afAuth: AngularFireAuth, 
    public authService: AuthService, 
    private router: Router,
    public usersListService: UsersListService
  ) {}

  ngOnInit() {
    this.getUserData();
    this.getAllUsers();
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    this.selectedLanguage = this.languages[0];
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

  getHeadClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  checkCanShowSearchAsOverlay(innerWidth: number): void {
    if (innerWidth < 845) {
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }

  ngOnDestroy() {
    this.subscriptipn.unsubscribe();
  }
  
}