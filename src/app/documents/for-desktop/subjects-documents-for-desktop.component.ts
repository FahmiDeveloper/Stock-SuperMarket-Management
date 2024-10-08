import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { SubjectDocumentsFormDesktopComponent } from './subject-documents-form-desktop/subject-documents-form-desktop.component';
import { DocumentsListForDesktopComponent } from './documents-list-desktop/documents-list-desktop.component';

import { SubjectDocumentsService } from 'src/app/shared/services/subject-documents.service';
import { DocumentService } from 'src/app/shared/services/document.service';

import { SubjectDocuments } from 'src/app/shared/models/subject-document.model';
import { Document } from 'src/app/shared/models/document.model';

@Component({
  selector: 'subjects-documents-for-desktop',
  templateUrl: './subjects-documents-for-desktop.component.html',
  styleUrls: ['./subjects-documents-for-desktop.scss']
})

export class SubjectDocumentsForDesktopComponent implements OnInit, OnDestroy {

  subjectdocumentsList: SubjectDocuments[] = [];
  subjectDocumentsListForSelect: SubjectDocuments[] = [];
  arraysubjectDocuments: SubjectDocuments[] = [];

  p = 1;

  subjectDocumentSelectedKey = '';
  innerWidth: number;
  itemsPerPage: number;

  subscriptionForGetAllSubjectDocuments: Subscription;
  subscriptionForGetAllDocuments: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
    
  constructor(
    public subjectDocumentsService: SubjectDocumentsService,
    public documentService: DocumentService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.itemsPerPage = window.innerWidth <= 1366 ? 6 : 12;
    this.getAllSubjectsDocuments();
  }

  getAllSubjectsDocuments() {
    this.subscriptionForGetAllSubjectDocuments = this.subjectDocumentsService
    .getAll()
    .subscribe((subjectDocuments: SubjectDocuments[]) => {

      this.arraysubjectDocuments = subjectDocuments.sort((n1, n2) => n2.numRefSubjectDocument - n1.numRefSubjectDocument);
      this.subjectDocumentsListForSelect = this.arraysubjectDocuments;

      if (this.subjectDocumentSelectedKey) {
        this.subjectdocumentsList = subjectDocuments
        .filter(subject => subject.key == this.subjectDocumentSelectedKey)
        .sort((n1, n2) => n2.numRefSubjectDocument - n1.numRefSubjectDocument);
      }
      else {
        this.subjectdocumentsList = subjectDocuments.sort((n1, n2) => n2.numRefSubjectDocument - n1.numRefSubjectDocument);
      }

      this.subjectdocumentsList.forEach(subject => {
        this.getDocumentsForeachSubject(subject);
      })
           
    });
  }

  getDocumentsForeachSubject(subject: SubjectDocuments) {
    this.subscriptionForGetAllDocuments = this.documentService
    .getAll()
    .subscribe((documents: Document[]) => {

      subject.haveDocuments = documents.filter(document => document.subjectDocumentsKey == subject.key).length ? true : false;

    });
  }

  OnPageChange(event: PageEvent){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  newSubjectDocuments() {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(SubjectDocumentsFormDesktopComponent, config);

    dialogRef.componentInstance.arraysubjectDocuments = this.arraysubjectDocuments;
  }

  editSubjectDocuments(subjectDocuments?: SubjectDocuments) {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(SubjectDocumentsFormDesktopComponent, config); 
       
    dialogRef.componentInstance.subjectDocuments = subjectDocuments;
  }

  extractDocument(subjectDocuments: SubjectDocuments) {
    const dialogRef = this.dialogService.open(DocumentsListForDesktopComponent, {width: '800px'});
    dialogRef.componentInstance.subjectDocuments = subjectDocuments;
    dialogRef.componentInstance.documentRef = 1;
  }

  renewalDocument(subjectDocuments: SubjectDocuments) {
    const dialogRef = this.dialogService.open(DocumentsListForDesktopComponent, {width: '800px'});
    dialogRef.componentInstance.subjectDocuments = subjectDocuments;
    dialogRef.componentInstance.documentRef = 2;
  }

  deleteSubjectDocuments(subjectDocumentKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this Subject!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.subjectDocumentsService.delete(subjectDocumentKey);
        Swal.fire(
          'Subject has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  ngOnDestroy() {
    this.subscriptionForGetAllSubjectDocuments.unsubscribe();
    this.subscriptionForGetAllDocuments.unsubscribe();
  }

}