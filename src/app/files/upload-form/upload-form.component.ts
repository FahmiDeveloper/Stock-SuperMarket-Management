import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

import { FileUploadService } from 'src/app/shared/services/file-upload.service';

import { FileUpload } from 'src/app/shared/models/file-upload.model';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})

export class UploadFormComponent implements OnChanges, OnInit {

  @Input() typeFileId: number;
  @Input() defaultArrayFiles: FileUpload[];

  @Output() refContextFile = new EventEmitter<number>();
  
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;
  angularContext: boolean = false;
  otherContext: boolean = false;
  contextFile: number;
  lastNumRefFile: number;

  constructor(private uploadService: FileUploadService) {}

  ngOnChanges(changes: import("@angular/core").SimpleChanges) {
    if (this.defaultArrayFiles[0]) this.lastNumRefFile = this.defaultArrayFiles[0].numRefFile;
  }

  ngOnInit() {}

  checkAngularContext() {
    if (this.angularContext == true) this.otherContext = false;
    this.refContextFile.emit(1);
  }

  checkotherContext() {
    if (this.otherContext == true) this.angularContext = false;
    this.refContextFile.emit(2);
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    if (this.angularContext == true) this.contextFile = 1;
    else if(this.otherContext == true) this.contextFile = 2;
    this.upload();
  }
  
  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;
      if (file) {
        this.currentFileUpload = new FileUpload(file, this.typeFileId, this.contextFile, this.lastNumRefFile + 1);
        this.uploadService.pushFileToStorage(this.currentFileUpload).subscribe(
          percentage => {
            this.percentage = Math.round(percentage ? percentage : 0);
          },
          error => {
            console.log(error);
          }
        );
      }
    }
  }
}
