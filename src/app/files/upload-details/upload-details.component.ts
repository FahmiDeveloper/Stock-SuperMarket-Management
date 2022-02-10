import { Component, Input, OnInit } from '@angular/core';
import { FileUpload } from 'src/app/shared/models/file-upload.model';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss']
})
export class UploadDetailsComponent implements OnInit {

  @Input() fileUpload!: FileUpload;

  constructor(private uploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  deleteFileUpload(fileUpload: FileUpload) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.uploadService.deleteFile(fileUpload);
        Swal.fire(
          'Movie has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

}
