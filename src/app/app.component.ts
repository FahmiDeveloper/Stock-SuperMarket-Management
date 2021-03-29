import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './shared/services/auth.service';
import { UserService } from './shared/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
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
}
