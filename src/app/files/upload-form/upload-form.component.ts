import { Component, Input, OnInit } from '@angular/core';

import { FileUploadService } from 'src/app/shared/services/file-upload.service';

import { FileUpload } from 'src/app/shared/models/file-upload.model';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})

export class UploadFormComponent implements OnInit {

  @Input() typeFileId: number;
  
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  percentage = 0;

  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {}

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload();
  }
  
  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;
      if (file) {
        this.currentFileUpload = new FileUpload(file, this.typeFileId);
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
