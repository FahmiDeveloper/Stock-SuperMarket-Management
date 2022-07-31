import { Injectable } from "@angular/core";
import 'rxjs/add/operator/toPromise';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { FirebaseUserModel } from "../models/user.model";
import { map } from "rxjs/operators";


@Injectable({ providedIn: 'root' })

export class UserService {

  aflistUsers: AngularFireList<any>;
  userName: string;

  constructor(
   public db: AngularFirestore,
   public afAuth: AngularFireAuth,
   private dataBase: AngularFireDatabase
  ) {}


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
    if(user.displayName) {
      this.dataBase.object('/users/' + user.uid).update({
        name: user.displayName,
        email: user.email
      });
    } else {
      this.userName = user.email.substring(0, user.email.lastIndexOf("@"));
      this.dataBase.object('/users/' + user.uid).update({
        name: this.userName,
        email: user.email
      });
    }  
  }

  get(uid: string): AngularFireObject<FirebaseUserModel> {
    return this.dataBase.object('/users/' + uid);
  }

  getAll() {
    this.aflistUsers = this.dataBase.list('/users', debt => debt.orderByChild('key'));
    return this.aflistUsers
    .snapshotChanges()
    .pipe(map(changes => changes
    .map(c => ({ key: c.payload.key, ...c.payload.val() }))));
  }

  update(userId, user) {
    return this.dataBase.object('/users/' + userId).update(user);
  }

  delete(userId) {
    return this.dataBase.object('/users/' + userId).remove();
  }
}