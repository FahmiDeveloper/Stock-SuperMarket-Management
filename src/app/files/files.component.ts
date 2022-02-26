import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})

export class FilesComponent implements OnInit {

  isMobile: boolean;
  typeFile: TypesFiles;
  modalRefListFiles: any;

  typesFiles: TypesFiles[] = [
    {id: 1, type: 'PICTURE', icon: '/assets/pictures/picture-file.jpg'},
    {id: 2, type: 'PDF', icon: '/assets/pictures/pdf-file.jpg'},
    {id: 3, type: 'EXCEL', icon: '/assets/pictures/excel-file.png'}, 
    {id: 4, type: 'TXT', icon: '/assets/pictures/txt-file.PNG'},
    {id: 5, type: 'ZIP', icon: '/assets/pictures/zip-file.PNG'}
  ];

  constructor(private deviceService: DeviceDetectorService, protected modalService: NgbModal) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
  }

  openListFiles(contentDetOutDebt, typeFile: TypesFiles) {
    this.modalRefListFiles = this.modalService.open(contentDetOutDebt as Component, { size: 'lg', centered: true});
    this.typeFile = typeFile;
  }
}

export interface TypesFiles {
  id: number,
  type: string,
  icon: string
}
