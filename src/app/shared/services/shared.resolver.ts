import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";

import { UserService } from './user.service';

import { FirebaseUserModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })

export class SharedResolver implements Resolve<FirebaseUserModel> {

  constructor(public userService: UserService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Promise<FirebaseUserModel> {

    let user = new FirebaseUserModel();

    return new Promise((resolve, reject) => {
      this.userService.getCurrentUser()
      .then(res => {
        if(res.providerData[0].providerId == 'password'){
          user.image = 'https://via.placeholder.com/400x300';
          user.name = res.displayName;
          user.provider = res.providerData[0].providerId;
          return resolve(user);
        }
        else{
          user.image = res.photoURL;
          user.name = res.displayName;
          user.provider = res.providerData[0].providerId;
          return resolve(user);
        }
      }, err => {
        this.router.navigate(['/login'], {queryParams: { returnUrl: state.url}});
        return reject(err);
      })
    })
  }
  
}