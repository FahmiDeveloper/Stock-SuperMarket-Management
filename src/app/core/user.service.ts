import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';
import { FirebaseUserModel } from "./user.model";


@Injectable({ providedIn: 'root' })

export class UserService {


  constructor(
   public db: AngularFirestore,
   public afAuth: AngularFireAuth,
   private dataBase: AngularFireDatabase
 ){
 }


  getCurrentUser(){
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().onAuthStateChanged(function(user){
        if (user) {
          resolve(user);
        } else {
          reject('No user logged in');
        }
      })
    })
  }

  updateCurrentUser(value){
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().currentUser;
      user.updateProfile({
        displayName: value.name,
        photoURL: user.photoURL
      }).then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  isAuthentificated() {
    return new Promise<any>((resolve, reject) => {
      var user = firebase.auth().onAuthStateChanged(function(user){
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
    })
  }

  save(user:firebase.User) {
    this.dataBase.object('/users/' + user.uid).update({
      name: user.displayName,
      email: user.email
    });
 }

 get(uid: string): AngularFireObject<FirebaseUserModel> {
  return this.dataBase.object('/users/' + uid);
}
}