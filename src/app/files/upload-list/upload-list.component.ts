import { Component, Input, OnChanges } from '@angular/core';

import { map } from 'rxjs/operators';

import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})

export class UploadListComponent implements OnChanges {

  @Input() isMobile: boolean;
  @Input() typeFileId: number;
  @Input() numContextFile: number;

  fileUploads?: any[];
  filteredFiles?: any[];

  constructor(private uploadService: FileUploadService) {}
  
  ngOnChanges(changes: import("@angular/core").SimpleChanges) {
    this.uploadService.getFiles().snapshotChanges().pipe(
      map(changes =>
        // store the key
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(fileUploads => {
      if (this.numContextFile) this.filteredFiles = fileUploads.filter(element => (element.typeFileId == this.typeFileId) && (element.contextFile == this.numContextFile));
      else this.filteredFiles = fileUploads.filter(element => element.typeFileId == this.typeFileId);
      this.fileUploads = fileUploads;
    });
  }
  
  ngOnInit(): void {}

  filter(query: string) {
    this.filteredFiles = (this.numContextFile)
    ? this.fileUploads.filter(file => (file.typeFileId == this.typeFileId) && (file.contextFile == this.numContextFile) && (file.name.toLowerCase().includes(query.toLowerCase())))
    : this.fileUploads.filter(file => (file.typeFileId == this.typeFileId) && (file.name.toLowerCase().includes(query.toLowerCase())));
  }
}
