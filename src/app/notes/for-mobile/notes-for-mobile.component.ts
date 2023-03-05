import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { NoteFormMobileComponent } from './note-form-mobile/note-form-mobile.component';

import { NoteService } from 'src/app/shared/services/note.service';
import { SubjectNotesService } from 'src/app/shared/services/subject-note.service';

import { Note } from 'src/app/shared/models/note.model';
import { SubjectNotes } from 'src/app/shared/models/subject-note.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { NoteDialogResult } from 'src/app/shared/models/note-dialog-result';

const getObservable = (collection: AngularFirestoreCollection<Note>) => {
  const subject = new BehaviorSubject<Note[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Note[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'notes-for-mobile',
  templateUrl: './notes-for-mobile.component.html',
  styleUrls: ['./notes-for-mobile.scss']
})

export class NotesForMobileComponent implements OnInit, OnDestroy {

  toDoInErp = getObservable(this.store.collection('toDoInErp')) as Observable<Note[]>;
  toDoInPersApp = getObservable(this.store.collection('toDoInPersApp')) as Observable<Note[]>;
  toTestInMaster = getObservable(this.store.collection('toTestInMaster')) as Observable<Note[]>;
  toTestInErp = getObservable(this.store.collection('toTestInErp')) as Observable<Note[]>;
  toTestInPersAppAfterBuild = getObservable(this.store.collection('toTestInPersAppAfterBuild')) as Observable<Note[]>;
  toFixAfterTestInMaster = getObservable(this.store.collection('toFixAfterTestInMaster')) as Observable<Note[]>;
  toFixAfterTestInErp = getObservable(this.store.collection('toFixAfterTestInErp')) as Observable<Note[]>;
  toFixAfterTestInPersAppAfterBuild = getObservable(this.store.collection('toFixAfterTestInPersAppAfterBuild')) as Observable<Note[]>;
  notifications = getObservable(this.store.collection('notifications')) as Observable<Note[]>;

  notesToDoInErpList: Note[] = [];
  notesToDoInPersAppList: Note[] = [];
  notesToTestInMasterList: Note[] = [];
  notesToTestInErpList: Note[] = [];
  notesToTestInPersAppAfterBuildList: Note[] = [];
  notesToFixAfterTestInMasterList: Note[] = [];
  notesToFixAfterTestInErpList: Note[] = [];
  notesToFixAfterTestInPersAppAfterBuildList: Note[] = [];
  notificationsList: Note[] = [];

  subjectNotesList: SubjectNotes[] = [];
  arraySubjectNotesForNewSubject: SubjectNotes[] = [];

  subjectNotesSelectedId: number = 1;
  allowDragTask: boolean = false;

  subscriptionForGetAllSubjectNotes: Subscription;
  
  constructor(
    public noteService: NoteService,
    public subjectNotesService: SubjectNotesService,
    public dialogService: MatDialog,
    private store: AngularFirestore
  ) {}

  ngOnInit() {
    this.getAllNotes();
    this.getAllSubjectNotes();
  }

  getAllNotes() {
    this.toDoInErp.subscribe(resToDoInErp => {
      this.notesToDoInErpList = resToDoInErp;
      this.notesToDoInErpList = this.notesToDoInErpList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })

    this.toDoInPersApp.subscribe(resToDoInPersApp => {
      this.notesToDoInPersAppList = resToDoInPersApp;
      this.notesToDoInPersAppList = this.notesToDoInPersAppList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })

    this.toTestInMaster.subscribe(resToTestInMaster => {
      this.notesToTestInMasterList = resToTestInMaster;
      this.notesToTestInMasterList = this.notesToTestInMasterList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })

    this.toTestInErp.subscribe(resToTestInErp => {
      this.notesToTestInErpList = resToTestInErp;
      this.notesToTestInErpList = this.notesToTestInErpList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })

    this.toTestInPersAppAfterBuild.subscribe(resToTestInPersAppAfterBuild => {
      this.notesToTestInPersAppAfterBuildList = resToTestInPersAppAfterBuild;
      this.notesToTestInPersAppAfterBuildList = this.notesToTestInPersAppAfterBuildList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })

    this.toFixAfterTestInMaster.subscribe(resToFixAfterTestInMaster => {
      this.notesToFixAfterTestInMasterList = resToFixAfterTestInMaster;
      this.notesToFixAfterTestInMasterList = this.notesToFixAfterTestInMasterList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })

    this.toFixAfterTestInErp.subscribe(resToFixAfterTestInErp => {
      this.notesToFixAfterTestInErpList = resToFixAfterTestInErp;
      this.notesToFixAfterTestInErpList = this.notesToFixAfterTestInErpList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })

    this.toFixAfterTestInPersAppAfterBuild.subscribe(resToFixAfterTestInPersAppAfterBuild => {
      this.notesToFixAfterTestInPersAppAfterBuildList = resToFixAfterTestInPersAppAfterBuild;
      this.notesToFixAfterTestInPersAppAfterBuildList = this.notesToFixAfterTestInPersAppAfterBuildList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })

    this.notifications.subscribe(resNotifications => {
      this.notificationsList = resNotifications;
      this.notificationsList = this.notificationsList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })
  }

  getAllSubjectNotes() {
    this.subscriptionForGetAllSubjectNotes = this.subjectNotesService
    .getAll()
    .subscribe((subjectNotes: SubjectNotes[]) => {
      this.subjectNotesList = subjectNotes.sort((n1, n2) => n1.id - n2.id);
      this.arraySubjectNotesForNewSubject = subjectNotes;
    });
  }

  drop(event: CdkDragDrop<Note[]>): void {
    
    if (event.previousContainer === event.container) {

      const previousTask = event.previousContainer.data[event.previousIndex];
      const currentTask = event.container.data[event.currentIndex];

      moveItemInArray(
        event.container.data, 
        event.previousIndex, 
        event.currentIndex
      );

      if (event.currentIndex < event.previousIndex) {
         // from bas to haut
        for (var i = event.currentIndex + 1; i <= event.previousIndex; i++) {
          currentTask.orderNo -= 1;
          previousTask.orderNo += 1;

          this.store.collection(event.container.id).doc(currentTask.id).update(currentTask);
          this.store.collection(event.container.id).doc(previousTask.id).update(previousTask);
        }
      }

      if (event.currentIndex > event.previousIndex) {
        // from haut to bas
        for (var i = event.previousIndex; i < event.currentIndex; i++) {
          currentTask.orderNo += 1;
          previousTask.orderNo -= 1;

          this.store.collection(event.container.id).doc(currentTask.id).update(currentTask);
          this.store.collection(event.container.id).doc(previousTask.id).update(previousTask);
        }
      }

      this.allowDragTask = false;
     
    } 

  }

  newNote() {
    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      width: '98vw',
      maxWidth: '100vw',
      data: {
        note: {},
      }
    }
    const dialogRef = this.dialogService.open(NoteFormMobileComponent, config);

    dialogRef.componentInstance.arraySubjectNotes = this.subjectNotesList;
    dialogRef.componentInstance.arraySubjectNotesForNewSubject = this.arraySubjectNotesForNewSubject;

    dialogRef.afterClosed().subscribe((result: NoteDialogResult|undefined) => {
      if (!result) {
        return;
      }

      if (result.note.subjectNotesId == 1) {
        result.note.orderNo = this.notesToDoInErpList.length ? this.notesToDoInErpList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
        this.store.collection('toDoInErp').add(result.note);
      }
      else if (result.note.subjectNotesId == 2) {
        result.note.orderNo = this.notesToDoInPersAppList.length ? this.notesToDoInPersAppList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
        this.store.collection('toDoInPersApp').add(result.note);
      }
      else if (result.note.subjectNotesId == 3) {
        result.note.orderNo = this.notesToTestInMasterList.length ? this.notesToTestInMasterList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
        this.store.collection('toTestInMaster').add(result.note);        
      }
      else if (result.note.subjectNotesId == 4) {
        result.note.orderNo = this.notesToTestInErpList.length ? this.notesToTestInErpList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
        this.store.collection('toTestInErp').add(result.note);
      }
      else if (result.note.subjectNotesId == 5) {
        result.note.orderNo = this.notesToTestInPersAppAfterBuildList.length ? this.notesToTestInPersAppAfterBuildList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
        this.store.collection('toTestInPersAppAfterBuild').add(result.note);
      }
      else if (result.note.subjectNotesId == 6) {
        result.note.orderNo = this.notesToFixAfterTestInMasterList.length ? this.notesToFixAfterTestInMasterList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
        this.store.collection('toFixAfterTestInMaster').add(result.note);
      }
      else if (result.note.subjectNotesId == 7) {
        result.note.orderNo = this.notesToFixAfterTestInErpList.length ? this.notesToFixAfterTestInErpList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
        this.store.collection('toFixAfterTestInErp').add(result.note);
      }
      else if (result.note.subjectNotesId == 8) {
        result.note.orderNo = this.notesToFixAfterTestInPersAppAfterBuildList.length ? this.notesToFixAfterTestInPersAppAfterBuildList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
        this.store.collection('toFixAfterTestInPersAppAfterBuild').add(result.note);
      }
      else {
        result.note.orderNo = this.notificationsList.length ? this.notificationsList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
        this.store.collection('notifications').add(result.note);
      }
      Swal.fire(
        'New note added successfully',
        '',
        'success'
      )   
    });
  }

  @HostListener("window:scroll", ["$event"])
  onWindowScroll() {
    //In chrome and some browser scroll is given to body tag
    let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
    let max = document.documentElement.scrollHeight;
    // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
    if(pos < max ) {
      this.allowDragTask = false;
    }
  }

  allowDrag(allowDragTask: boolean) {
    this.allowDragTask = allowDragTask;
  }

  ngOnDestroy() {
    this.subscriptionForGetAllSubjectNotes.unsubscribe()
  }

}
