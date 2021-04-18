import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFireAuth } from '@angular/fire/auth';

import firebase from 'firebase';
import { BehaviorSubject } from "rxjs";
import { UserService } from "./user.service";
import { ActivatedRoute } from "@angular/router";

@Injectable({ providedIn: 'root' })

export class AuthService {

  isConnected:BehaviorSubject<boolean>= new BehaviorSubject(false);

  constructor(
   public afAuth: AngularFireAuth,
   public userService:UserService,
   private route: ActivatedRoute
 ){
    this.userService.isAuthentificated().then(res=>this.isConnected.next(res));
 }

  doFacebookLogin(){
    return new Promise<any>((resolve, reject) => {
      let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
      localStorage.setItem('returnUrl',returnUrl);
      let provider = new firebase.auth.FacebookAuthProvider();
      this.afAuth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doTwitterLogin(){
    return new Promise<any>((resolve, reject) => {
      let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
      localStorage.setItem('returnUrl',returnUrl);
      let provider = new firebase.auth.TwitterAuthProvider();
      this.afAuth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doGoogleLogin(){
    return new Promise<any>((resolve, reject) => {
      let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
      localStorage.setItem('returnUrl',returnUrl);
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.afAuth
      .signInWithPopup(provider)
      .then(res => {
        resolve(res);
      }, err => {
        console.log(err);
        reject(err);
      })
    })
  }

  doRegister(value){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogin(value){
    return new Promise<any>((resolve, reject) => {
      let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
      localStorage.setItem('returnUrl',returnUrl);
      firebase.auth().signInWithEmailAndPassword(value.email, value.password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  doLogout(){
    return new Promise<void>((resolve, reject) => {
      if(firebase.auth().currentUser){
        this.afAuth.signOut();
        resolve();
      }
      else{
        reject();
      }
    });
  }
}