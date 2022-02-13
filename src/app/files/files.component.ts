import { Component, OnInit } from '@angular/core';

import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})

export class FilesComponent implements OnInit {

  isMobile: boolean;

  constructor(private deviceService: DeviceDetectorService) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
  }
}
