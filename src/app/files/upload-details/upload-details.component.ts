import { Component, Input, OnInit } from '@angular/core';

import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as fileSaver from 'file-saver';
import * as JSZip from 'jszip/dist/jszip';

import { FileUploadService } from 'src/app/shared/services/file-upload.service';

import { FileUpload } from 'src/app/shared/models/file-upload.model';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss']
})

export class UploadDetailsComponent implements OnInit {

  @Input() filteredFiles: any[];
  @Input() isMobile: boolean;

  urlFile: string;
  pictureFile: string;
  FileName: string;

  $zipFiles: Observable<ZipFile[]>;
  isLoading: boolean;
  p: number = 1;
  blobForDownload: Blob;

  constructor(
    private uploadService: FileUploadService,
    protected modalService: NgbModal
  ) {}

  ngOnInit(): void {}

  viewOtherFileUpload(fileUpload: FileUpload, showFile) {
    this.urlFile = fileUpload.url;
    this.FileName = fileUpload.name;

    if (this.isMobile) {
       this.modalService.open(showFile as Component, { windowClass: 'my-class-mobile', centered: true });
    } else {
       this.modalService.open(showFile as Component, { windowClass: 'my-class', centered: true });
    }
  }

  viewFilePictureUpload(fileUpload: FileUpload, showPicture) {
    this.pictureFile = fileUpload.url;
    this.FileName = fileUpload.name;

    this.modalService.open(showPicture as Component, { size: 'lg', centered: true });
  }

  showZipFile(fileUpload: FileUpload, viewZipFile) {
    this.FileName = fileUpload.name;
    this.isLoading = true;

    fetch(fileUpload.url)
    .then(res => res.blob()) // Gets the response and returns it as a blob
    .then(blob => {
      this.blobForDownload =blob;
      const zipLoaded = new JSZip.default();

      this.$zipFiles = from(zipLoaded.loadAsync(blob)).pipe(
        switchMap((zip: any):Observable<ZipFile[]> => {
          return of(Object.keys(zip.files).map((key)=>zip.files[key]))
        })
      )

      this.$zipFiles.forEach(zipFiles => {
        zipFiles.forEach(element => {
          let n = element.name.lastIndexOf('/');
          element.fileName = element.name.substring(n + 1);
        })        
      })
      this.modalService.open(viewZipFile as Component, { size: 'lg', centered: true });     
    });
    setTimeout(() => this.isLoading = false, 3000); 
  }

  downloadFile(fileUpload: FileUpload) {
    fetch(fileUpload.url)
    .then(res => res.blob()) // Gets the response and returns it as a blob
    .then(blob => {
      fileSaver.saveAs(blob, fileUpload.name);
    });
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
          'File has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  saveFileFromZip(file: ZipFile) {
    var zip = new JSZip();
    zip.loadAsync(this.blobForDownload).then(function (zip) {
      Object.keys(zip.files).forEach(function (filename) {
        if (file.name == filename) {
        zip.files[file.name].async('uint8array').then(function (fileData) {
           if (fileData) {          
              const blob = new Blob([fileData]);
              fileSaver.saveAs(blob, file.fileName);
            }
          })
        }    
      })
    })
  }

  checkIsImage(path) {
    let imageExtentions = ['JPEG', 'JPG', 'PNG', 'GIF', 'TIFF']; // Array of image extention
    let n = path.lastIndexOf('.');
    let extention: string = path.toLocaleUpperCase().substring(n + 1);
    return imageExtentions.indexOf(extention) != -1;
  }

  isZip(path) {
    let extentionvideo = ['zip']; // Array of video extention
    let n = path.lastIndexOf('.');
    let extention: string = path.substring(n + 1);
    return extentionvideo.indexOf(extention) != -1;
  }
}

export interface ZipFile {
  readonly name: string;
  readonly dir: boolean;
  readonly date: Date;
  readonly data: any;
  fileName: string;
}
