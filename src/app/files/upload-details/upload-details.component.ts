import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as fileSaver from 'file-saver';
import * as JSZip from 'jszip/dist/jszip';
import { utils, write as XlsxWrite, read as XlsxRead } from 'ts-xlsx';
import { DomSanitizer } from '@angular/platform-browser';
import { renderAsync } from 'docx-preview';
import { NgNavigatorShareService } from 'ng-navigator-share';

import { FileUploadService } from 'src/app/shared/services/file-upload.service';

import { FileUpload, ZipFile } from 'src/app/shared/models/file-upload.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-upload-details',
  templateUrl: './upload-details.component.html',
  styleUrls: ['./upload-details.component.scss']
})

export class UploadDetailsComponent implements OnChanges {

  @Input() filteredFiles: any[];
  @Input() isMobile: boolean;
  @Input() userRoles: FirebaseUserModel;

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['name', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  urlFile: string;
  pictureFile: string;
  FileName: string;

  $zipFiles: Observable<ZipFile[]>;
  isLoading: boolean;
  blobForDownload: Blob;

  srcExtractedImage: any;
  fileExtractedName: string = '';
  contentTxtFile: string = '';
  contentPdfFile: any;
  excelFile: File;
  data: any;
  headData: any;
  arrayBuffer: any;
  wordFile: File;

  constructor(
    private uploadService: FileUploadService,
    protected ngNavigatorShareService: NgNavigatorShareService,
    private sanitizer : DomSanitizer,
    protected modalService: NgbModal
  ) {}

  ngOnChanges(changes: import("@angular/core").SimpleChanges) {
    console.log(this.paginator)

    if (this.filteredFiles) {
      this.dataSource.data = this.filteredFiles;
       this.dataSource.data.forEach(element => {
        element.fileNameWithoutType = element.name.substring(0, element.name.lastIndexOf("."));
      })
    }
    this.dataSource.paginator = this.paginator;  
  }

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
    setTimeout(() => this.isLoading = false, 5000); 
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

  viewFileFromZip(file: ZipFile, showContentFilesFromZip) {
    this.fileExtractedName = file.fileName;

    var zip = new JSZip();
    zip.loadAsync(this.blobForDownload).then((zip) => {
      Object.keys(zip.files).forEach((filename) => {
        if (file.name == filename) {
          zip.files[file.name].async('uint8array').then((fileData) => {
          const blob = new Blob([fileData]);
          const reader = new FileReader();

          if (this.checkIsImage(file.fileName))
          this.srcExtractedImage = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(blob));

          else if (this.isTxt(file.fileName)){
            reader.onloadend = () => {
              this.contentTxtFile = reader.result as string;
            };
            reader.readAsText(blob);
          } 
          
          else if (this.isPdf(file.fileName)){
            reader.readAsDataURL(blob);
            reader.addEventListener(
                'load',
                () => {
                    this.contentPdfFile = reader.result;
                },
                false
            );
          }

          else if (this.isExcel(file.fileName)){
            this.excelFile = new File([blob], file.fileName);

            reader.onload = (e: any) => {

              this.arrayBuffer = reader.result;
              const data = new Uint8Array(this.arrayBuffer);
              const arr = new Array();
        
              for (let i = 0; i !== data.length; i++) {
                arr[i] = String.fromCharCode(data[i]);
              }
        
              const bstr = arr.join('');
              const workbook = XlsxRead(bstr, { type: 'binary', cellDates: true });
        
              const wsname: string = workbook.SheetNames[0];
              const ws = workbook.Sheets[wsname];
        
              this.data = utils.sheet_to_json(ws, {header: 1, raw: false});
        
              this.headData = this.data[0];

              this.data = this.data.slice(1);

              const ws2 = workbook.Sheets[workbook.SheetNames[1]];
              this.readDataSheet(ws2, 10);
            };
            reader.readAsArrayBuffer(this.excelFile);
          }

          else if (this.isWord(file.fileName)){
            this.wordFile = new File([blob], file.fileName);

            reader.onloadend = () => {
              var arrayBuffer = reader.result;
  
              if (this.isMobile) {
                renderAsync(arrayBuffer, document.getElementById("contentWord"), null, {
                inWrapper: false
                })
                .then(x => console.log("docx: finished"));
              } else {
                renderAsync(arrayBuffer, document.getElementById("contentWord"))
                .then(x => console.log("docx: finished"));
              }
              };
              reader.readAsArrayBuffer(this.wordFile);
          };

          if (this.checkIsImage(file.fileName) || this.isMobile) this.modalService.open(showContentFilesFromZip as Component, { size: 'lg', centered: true });
          else if (this.isTxt(file.fileName) || this.isPdf(file.fileName)) 
          this.modalService.open(showContentFilesFromZip as Component, { windowClass: 'class-md', centered: true });
          else this.modalService.open(showContentFilesFromZip as Component, { windowClass: 'class-lg', centered: true });
        });
        }   
      });
    });  
  }

  private readDataSheet(ws: any, startRow: number) {
    let datas = utils.sheet_to_json(ws, {header: 1, raw: false, range: startRow});
    let headDatas = datas[0];
    datas = datas.slice(1);

    for (let i = 0; i < this.data.length; i++) {
      this.data[i][this.headData.length] = datas.filter(x => x[12] == this.data[i][0])
    }
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

  shareFile(fileUpload: FileUpload) {
    fetch(fileUpload.url)
    .then(res => res.blob())
    .then(blob => {
      if (!this.ngNavigatorShareService.canShare()) {
        alert(`This service/api is not supported in your Browser`);
        return;
      }

      if (this.isTxt(fileUpload.name)) {
        this.ngNavigatorShareService.share({
          title: fileUpload.name,
          text: fileUpload.name,
          files: [
            new File([blob], fileUpload.name, {type: 'text/plain'}),
          ]
        }).then( (response) => {
          console.log(response);
        })
        .catch( (error) => {
          console.log(error);
        });
      } else if (this.isPdf(fileUpload.name)) {
        this.ngNavigatorShareService.share({
          title: fileUpload.name,
          text: fileUpload.name,
          files: [
            new File([blob], fileUpload.name, {type: 'application/pdf'}),
          ]
        }).then( (response) => {
          console.log(response);
        })
        .catch( (error) => {
          console.log(error);
        });
      } else {
        this.ngNavigatorShareService.share({
          title: fileUpload.name,
          text: fileUpload.name,
          files: [
            new File([blob], fileUpload.name, {
              type: blob.type,
            }),
          ]
        }).then( (response) => {
          console.log(response);
        })
        .catch( (error) => {
          console.log(error);
        });
      }    
    });  
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

  isTxt(path) {
    let extentionvideo = ['txt']; // Array of video extention
    let n = path.lastIndexOf('.');
    let extention: string = path.substring(n + 1);
    return extentionvideo.indexOf(extention) != -1;
  }

  isPdf(path) {
    let extentionvideo = ['pdf']; // Array of pdf extention
    let n = path.lastIndexOf('.');
    let extention: string = path.substring(n + 1);
    return extentionvideo.indexOf(extention.toLocaleLowerCase()) != -1;
  }

  isExcel(path) {
    let extentionvideo = ['xlsx']; // Array of pdf extention
    let n = path.lastIndexOf('.');
    let extention: string = path.substring(n + 1);
    return extentionvideo.indexOf(extention.toLocaleLowerCase()) != -1;
  }

  isWord(path) {
    let extentionvideo = ['docx']; // Array of pdf extention
    let n = path.lastIndexOf('.');
    let extention: string = path.substring(n + 1);
    return extentionvideo.indexOf(extention.toLocaleLowerCase()) != -1;
  }
  
}
