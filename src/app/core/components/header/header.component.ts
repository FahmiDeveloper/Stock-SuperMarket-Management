import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

import firebase from 'firebase';
import { Subscription } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth.service';
import { DeviceDetectorService } from 'ngx-device-detector';

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

  constructor(
    private afAuth: AngularFireAuth, 
    public authService: AuthService, 
    private router: Router,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.getUserData();
    this.checkIfUserIsConnected();
    this.isMobile = this.deviceService.isMobile();
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

  logout(){
    this.authService
      .doLogout()
      .then((res) => {
        this.router.navigate(['/login']);
        this.authService.isConnected.next(false);
      }, (error) => {
        console.log("Logout error", error);
    });
  }

  ngOnDestroy() {
    this.subscriptipn.unsubscribe();
  }
}
