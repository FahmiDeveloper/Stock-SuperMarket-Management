import { Component, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})
export class UploadListComponent implements OnInit {

  @Input() isMobile: boolean;

  fileUploads?: any[];
  filteredFiles?: any[];

  p: number = 1;

  constructor(private uploadService: FileUploadService) { }
  
  ngOnInit(): void {
    this.uploadService.getFiles().snapshotChanges().pipe(
      map(changes =>
        // store the key
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    ).subscribe(fileUploads => {
      this.fileUploads = fileUploads;
      this.filteredFiles = fileUploads;
    });
  }

  filter(query: string) {
    this.filteredFiles = (query)
       ? this.fileUploads.filter(file => file.name.toLowerCase().includes(query.toLowerCase()))
       : this.fileUploads;
 }

}
