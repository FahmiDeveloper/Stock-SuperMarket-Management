import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { Subscription } from 'rxjs';

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

  constructor(private afAuth: AngularFireAuth, public authService: AuthService, private router: Router) {
    this.subscriptipn = afAuth.authState.subscribe(user => {
      this.user = user;
      if(this.user && !this.user.displayName) {
        this.getNameFromEmail(this.user.email);
      }
    })
  }

  ngOnInit() {
    this.authService.isConnected.subscribe(res=>{
      this.isConnected=res;
    })
  }

  logout(){
    this.authService.doLogout()
    .then((res) => {
      this.router.navigate(['/login']);
      this.authService.isConnected.next(false);
    }, (error) => {
      console.log("Logout error", error);
    });
  }

  getNameFromEmail(email) {
    this.userName = email.substring(0, email.lastIndexOf("@"));
  }

  ngOnDestroy() {
    this.subscriptipn.unsubscribe();
  }

}
