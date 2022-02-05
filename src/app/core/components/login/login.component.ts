import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit{

  loginForm: FormGroup;
  errorMessage: string = '';

  isMobile: boolean;

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.validateForm();
    this.isMobile = this.deviceService.isMobile();
  }

  validateForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['',Validators.required]
    });
  }

  tryFacebookLogin(){
    this.authService.doFacebookLogin()
    .then(res => {
      this.onSuccess();
    })
  }

  tryTwitterLogin(){
    this.authService.doTwitterLogin()
    .then(res => {
      this.onSuccess();
    })
  }

  tryGoogleLogin(){
    this.authService.doGoogleLogin()
    .then(res => {
      this.onSuccess();
    })
  }

  tryLogin(value){
    this.authService.doLogin(value)
    .then(res => {
      this.onSuccess();
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
    })
  }

  onSuccess(){
    this.router.navigate(['/home']);
    this.authService.isConnected.next(true);
  }
}
