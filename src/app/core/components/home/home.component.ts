import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isPortrait: boolean;

  constructor(
    private deviceService: DeviceDetectorService,
    private bpObserable: BreakpointObserver
  ) {}

  ngOnInit() {
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();
    this.isMobile = this.deviceService.isMobile();

    this.bpObserable
    .observe([
      '(orientation: portrait)',
    ])
    .subscribe(result => {
      if(result.matches){
        this.isPortrait = true;
      }
    });
    this.bpObserable
    .observe([
      '(orientation: landscape)',
    ])
    .subscribe(result => {
      if(result.matches){
        this.isPortrait = false;
      }
    });  
  }
  
}