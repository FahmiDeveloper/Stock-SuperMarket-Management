import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'StockSuperMarketManagement';

  name: any;
  isLogin: boolean;
  currentRoute: string;
  isAuth: boolean;

  constructor(private router: Router) {
    
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      
      if (event.constructor.name === "NavigationEnd") {
        this.name = (<any>event).url.split("/").slice(-1)[0];
        if (this.name ==="login" || this.name ==="register" || this.name ==="") {
          this.isAuth = false;
        } else {
          this.isAuth = true;
        }   
      }
    })
  }
}
