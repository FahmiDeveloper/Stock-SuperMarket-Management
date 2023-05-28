import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from './shared/services/auth.service';
import { UserService } from './shared/services/user.service';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {

  isSideNavCollapsed = false;
  screenWidth = 0;
  isConnected:boolean;

  constructor(
    public authService:AuthService,
    public userService:UserService,
    router: Router
  ){
    this.authService.isConnected.subscribe(res=>{
      if(res) {
        this.userService.getCurrentUser().then(user=>{
          if(!user) return;

          this.userService.save(user);

          let returnUrl = localStorage.getItem('returnUrl');
          if(!returnUrl) return;

          localStorage.removeItem('returnUrl');
          router.navigateByUrl(returnUrl);
        });
      }
    })
  }

  ngOnInit() {
    this.checkIfUserIsConnected();
  }

  checkIfUserIsConnected() {
    this.authService.isConnected.subscribe(res=>{
      this.isConnected=res;
    })
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

}