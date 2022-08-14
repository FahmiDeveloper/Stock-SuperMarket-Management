import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { DeviceDetectorService } from 'ngx-device-detector';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  user: FirebaseUserModel = new FirebaseUserModel();

  subscripton: Subscription;

  isMobile: boolean;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.getRolesUser();
    this.isMobile = this.deviceService.isMobile();
  }
  
  getRolesUser() {
    this.subscripton = this.authService
      .isConnected
      .subscribe(res=>{
        if(res) {
          this.userService
            .getCurrentUser()
            .then(user=>{
              if(user) {
                this.userService
                  .get(user.uid)
                  .valueChanges()
                  .subscribe(dataUser=>{
                    this.user = dataUser;
                });
              }
          });   
        }
    })
  }

  ngOnDestroy() {
    this.subscripton.unsubscribe();
  }
  
}