import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { DocumentFormMobileComponent } from './document-form-mobile/document-form-mobile.component';

import { DocumentService } from 'src/app/shared/services/document.service';

import { Document } from 'src/app/shared/models/document.model';
import { SubjectDocuments } from 'src/app/shared/models/subject-document.model';

@Component({
  selector: 'documents-list-mobile',
  templateUrl: './documents-list-mobile.component.html',
  styleUrls: ['./documents-list-mobile.scss']
})

export class DocumentsListForMobileComponent implements OnInit, OnDestroy {

  documentsList: Document[] = [];
  pagedList: Document[]= [];
  documentsListCopieForNewDocument: Document[] = [];

  length: number = 0;

  subjectDocuments: SubjectDocuments = new SubjectDocuments();

  documentRef: number;

  subscriptionForGetAllDocuments: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  constructor(
    public documentService: DocumentService,
    public dialogService: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllDocuments();
  }

  getAllDocuments() {
    this.subscriptionForGetAllDocuments = this.documentService
    .getAll()
    .subscribe((documents: Document[]) => {

      this.documentsListCopieForNewDocument = documents.sort((n1, n2) => n2.numRefDocument - n1.numRefDocument);
 
      this.documentsList = documents
      .filter(document => (document.subjectDocumentsKey == this.subjectDocuments.key) && (document.documentRef == this.documentRef))
      .sort((n1, n2) => n2.numRefDocument - n1.numRefDocument);

      this.pagedList = this.documentsList.slice(0, 6);
      this.length = this.documentsList.length;

    });
  }

  OnPageChange(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedList = this.documentsList.slice(startIndex, endIndex);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  newDocument() {
    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      width: '98vw',
      maxWidth: '100vw'
    }
    const dialogRef = this.dialogService.open(DocumentFormMobileComponent, config);

    dialogRef.componentInstance.arrayDocuments = this.documentsListCopieForNewDocument;
    dialogRef.componentInstance.subjectDocumentsKey = this.subjectDocuments.key;
    dialogRef.componentInstance.documentRef = this.documentRef;
  }

  editDocument(document?: Document) {
    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      width: '98vw',
      maxWidth: '100vw'
    }
    const dialogRef = this.dialogService.open(DocumentFormMobileComponent, config);
    
    dialogRef.componentInstance.document = document;
    dialogRef.componentInstance.documentRef = this.documentRef;
  }

  deleteDocument(documentKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this document!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.documentService.delete(documentKey);
        Swal.fire(
          'Document has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  copyText(text: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.showSnackbarTopPosition();
  }

  showSnackbarTopPosition() {
    this.snackBar.open('Text copied', 'Done', {
      duration: 2000,
      verticalPosition: "bottom", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

  viewDocumentContent(contentDocumentContent: string) {
    Swal.fire({
      text: contentDocumentContent,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Close'
    });
  }

  ngOnDestroy() {
    this.subscriptionForGetAllDocuments.unsubscribe();
  }

}