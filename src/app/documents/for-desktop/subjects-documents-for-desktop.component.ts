import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { DeviceDetectorService } from 'ngx-device-detector';

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
  pagedListSubjectDocuments: SubjectDocuments[] = [];
  arraysubjectDocuments: SubjectDocuments[] = [];

  length: number = 0;

  subjectDocumentSelectedKey: string = '';
  isDesktop: boolean;

  subscriptionForGetAllSubjectDocuments: Subscription;
  subscriptionForGetAllDocuments: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
    
  constructor(
    public subjectDocumentsService: SubjectDocumentsService,
    public documentService: DocumentService,
    public dialogService: MatDialog,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.isDesktop = this.deviceService.isDesktop();
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

      this.pagedListSubjectDocuments = this.isDesktop ? this.subjectdocumentsList.slice(0, 9) : this.subjectdocumentsList.slice(0, 8);
      this.length = this.subjectdocumentsList.length;
           
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
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedListSubjectDocuments = this.subjectdocumentsList.slice(startIndex, endIndex);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  newSubjectDocuments() {
    const dialogRef = this.dialogService.open(SubjectDocumentsFormDesktopComponent, {width: '500px', data: {movie: {}}});
    dialogRef.componentInstance.arraysubjectDocuments = this.arraysubjectDocuments;
  }

  editSubjectDocuments(subjectDocuments?: SubjectDocuments) {
    const dialogRef = this.dialogService.open(SubjectDocumentsFormDesktopComponent, {width: '500px'});
    dialogRef.componentInstance.subjectDocuments = subjectDocuments;
    dialogRef.componentInstance.pagedListSubjectDocuments = this.pagedListSubjectDocuments;

    dialogRef.afterClosed().subscribe(res => {
      this.pagedListSubjectDocuments = res;
    });
  }

  extractDocument(subjectDocuments: SubjectDocuments) {
    const dialogRef = this.dialogService.open(DocumentsListForDesktopComponent, {width: '500px'});
    dialogRef.componentInstance.subjectDocuments = subjectDocuments;
    dialogRef.componentInstance.documentRef = 1;
  }

  renewalDocument(subjectDocuments: SubjectDocuments) {
    const dialogRef = this.dialogService.open(DocumentsListForDesktopComponent, {width: '500px'});
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
