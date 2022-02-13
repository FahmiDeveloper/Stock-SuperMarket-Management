import { Component, Input, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/shared/services/file-upload.service';

import { FileUpload } from 'src/app/shared/models/file-upload.model';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss']
})

export class UploadDetailsComponent implements OnInit {

  @Input() fileUpload!: FileUpload;
  @Input() isMobile: boolean;

  urlFile: string;
  modalRefPictureFile: any;
  modalRefOtherFile: any;
  pictureFile: string;
  FileName: string;

  constructor(
    private uploadService: FileUploadService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {}

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
          'File has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  viewOtherFileUpload(fileUpload: FileUpload, showFile) {
    if (this.isMobile) {
      this.modalRefOtherFile = this.modalService.open(showFile as Component, { windowClass: 'my-class-mobile', centered: true });
    } else {
      this.modalRefOtherFile = this.modalService.open(showFile as Component, { windowClass: 'my-class', centered: true });
    }
    if (fileUpload) {
      this.urlFile = fileUpload.url;
      this.FileName = fileUpload.name;
    }
  }

  viewFilePictureUpload(fileUpload: FileUpload, showPicture) {
     this.modalRefPictureFile = this.modalService.open(showPicture, { size: 'lg', centered: true });
    if (fileUpload) {
      this.pictureFile = fileUpload.url;
      this.FileName = fileUpload.name;
    }
  }

  checkIsImage(path) {
    let imageExtentions = ['JPEG', 'JPG', 'PNG', 'GIF', 'TIFF']; // Array of image extention
    let n = path.lastIndexOf('.');
    let extention: string = path.toLocaleUpperCase().substring(n + 1);

    return imageExtentions.indexOf(extention) != -1;
  }
}
