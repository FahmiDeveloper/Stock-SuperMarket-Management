import { Component, Input, OnChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';

import { from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { NgNavigatorShareService } from 'ng-navigator-share';
import * as fileSaver from 'file-saver';
import * as JSZip from 'jszip/dist/jszip';
import { utils, write as XlsxWrite, read as XlsxRead } from 'ts-xlsx';
import { renderAsync } from 'docx-preview';

import { FileUpload, ZipFile } from 'src/app/shared/models/file-upload.model';

@Component({
    selector: 'list-files-by-type',
    templateUrl: './list-files-by-type.component.html',
    styleUrls: ['./list-files-by-type.scss']
})

export class ListFilesByTypeComponent implements OnChanges {

    @Input() listFiles: any[];
    @Input() fileByType: number;
    @Input() isMobile: boolean;

    dataSource = new MatTableDataSource<any>();
    displayedColumns: string[] = ['name', 'star'];

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

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
    modalRefDeleteFile: any;
  
    constructor(
      protected ngNavigatorShareService: NgNavigatorShareService,
      private sanitizer : DomSanitizer,
      public dialogService: MatDialog
    ) {}

    ngOnChanges(changes: import("@angular/core").SimpleChanges) {

        if (this.fileByType == 1) {
            this.dataSource.data = this.listFiles.filter(file => file.typeFileId == 1);
        } else if (this.fileByType == 2) {
            this.dataSource.data = this.listFiles.filter(file => file.typeFileId == 2);
        } else if (this.fileByType == 3) {
            this.dataSource.data = this.listFiles.filter(file => file.typeFileId == 3);
        } else if (this.fileByType == 4) {
            this.dataSource.data = this.listFiles.filter(file => file.typeFileId == 4);
        } else if (this.fileByType == 5) {
            this.dataSource.data = this.listFiles.filter(file => file.typeFileId == 5);
        } else {
            this.dataSource.data = this.listFiles.filter(file => file.typeFileId == 7);
        }
        this.dataSource.data.forEach(element => {
            element.fileNameWithoutType = element.name.substring(0, element.name.lastIndexOf("."));
        })
        this.dataSource.paginator = this.paginator;

    }

    viewOtherFileUpload(fileUpload: FileUpload, showFile) {
        this.urlFile = fileUpload.url;
        this.FileName = fileUpload.name;
    
        if (this.isMobile) {
           this.dialogService.open(showFile, {
            width: '98vw',
            height:'81vh',
            maxWidth: '100vw'
          });
        } else {
          this.dialogService.open(showFile, {
            width: '60vw',
            height:'95vh',
            maxWidth: '100vw'
          });
        }
    }

    viewFilePictureUpload(fileUpload: FileUpload, showPicture) {
        this.pictureFile = fileUpload.url;
        this.FileName = fileUpload.name;

        if (this.isMobile) {
            this.dialogService.open(showPicture, {
            width: '98vw',
            height:'81vh',
            maxWidth: '100vw'
            });
        } else {
            this.dialogService.open(showPicture, {
            width: '40vw',
            height:'85vh',
            maxWidth: '100vw'
            });
        }
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
            if (this.isMobile) {
            this.dialogService.open(viewZipFile, {
                width: '98vw',
                height:'81vh',
                maxWidth: '100vw'
            });
            } else {
            this.dialogService.open(viewZipFile, {
            width: '45vw',
            height:'85vh',
            maxWidth: '100vw'
            });
            }
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

                if (this.isTxt(file.fileName) || this.isPdf(file.fileName) ||this.isWord(file.fileName) || this.isExcel(file.fileName)) {
                if (this.isMobile) {
                    this.dialogService.open(showContentFilesFromZip, {
                    width: '98vw',
                    height:'81vh',
                    maxWidth: '100vw'
                    });
                } else {
                    this.dialogService.open(showContentFilesFromZip, {
                    width: '60vw',
                    height:'95vh',
                    maxWidth: '100vw'
                    });
                }
                } else {
                if (this.isMobile) {
                    this.dialogService.open(showContentFilesFromZip, {
                    width: '98vw',
                    height:'81vh',
                    maxWidth: '100vw'
                    });
                } else {
                    this.dialogService.open(showContentFilesFromZip, {
                    width: '40vw',
                    height:'85vh',
                    maxWidth: '100vw'
                    });
                }
                }      
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