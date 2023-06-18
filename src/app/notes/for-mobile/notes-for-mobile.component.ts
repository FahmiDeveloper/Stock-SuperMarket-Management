import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { NoteFormMobileComponent } from './note-form-mobile/note-form-mobile.component';

import { NoteService } from 'src/app/shared/services/note.service';

import { Note } from 'src/app/shared/models/note.model';
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


  subjectNotesSelectedId: number = 1;
  allowDragTask: boolean = false;

  subscriptionForGetAllSubjectNotes: Subscription;
  
  constructor(
    public noteService: NoteService,
    public dialogService: MatDialog,
    private store: AngularFirestore
  ) {}

  ngOnInit() {
    this.getAllNotes();
  }

  getAllNotes() {
  
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


    dialogRef.afterClosed().subscribe((result: NoteDialogResult|undefined) => {
      if (!result) {
        return;
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
