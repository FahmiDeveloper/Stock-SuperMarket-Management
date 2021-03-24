import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  user: FirebaseUserModel = new FirebaseUserModel();
  event: any;
  subscripton: Subscription;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getRolesUser();
    this.loadEvent();
  }
  getRolesUser() {
    this.subscripton = this.authService.isConnected.subscribe(res=>{
      if(res) {
        this.userService.getCurrentUser().then(user=>{
          if(user) {
            this.userService.get(user.uid).valueChanges().subscribe(dataUser=>{
              this.user = dataUser;
            });
          }
        });   
      }
    })
  }

  enterInterfaceEmployees() {
    if(this.user.isAdmin) this.router.navigate(['/user']);
  }

  loadEvent() {
    this.event = {
        id: 1,
        name: 'Angular Connect',
        date: new Date('9/26/2036'),
        time: '10:00 am',
        price: 599.99,
        imageUrl: '/assets/images/angularconnect-shield.png',
        location: {
          address: '1057 DT',
          city: 'London',
          country: 'England'
        }   
    }
  }

  ngOnDestroy() {
    this.subscripton.unsubscribe();
  }
}
