import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';

import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit{

  registerForm: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

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
    this.registerForm = this.fb.group({
      email: ['', Validators.required ],
      password: ['',Validators.required]
    });
  }

  tryFacebookLogin(){
    this.authService.doFacebookLogin()
    .then(res =>{
    this.onSuccess();
    }, err => console.log(err)
    )
  }

  tryTwitterLogin(){
    this.authService.doTwitterLogin()
    .then(res =>{
    this.onSuccess();
    }, err => console.log(err)
    )
  }

  tryGoogleLogin(){
    this.authService.doGoogleLogin()
    .then(res =>{
    this.onSuccess();
    }, err => console.log(err)
    )
  }

  tryRegister(value){
    this.authService.doRegister(value)
    .then(res => {
      console.log(res);
      this.errorMessage = "";
      this.successMessage = "Your account has been created";
    }, err => {
      console.log(err);
      this.errorMessage = err.message;
      this.successMessage = "";
    })
  }

  onSuccess(){
    this.router.navigate(['/home']);
    this.authService.isConnected.next(true);
  }
}
