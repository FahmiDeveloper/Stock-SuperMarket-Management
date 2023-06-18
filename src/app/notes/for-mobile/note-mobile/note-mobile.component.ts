import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';

import Swal from 'sweetalert2';
import * as fileSaver from 'file-saver';

import { NoteFormMobileComponent } from '../note-form-mobile/note-form-mobile.component';

import { NoteService } from 'src/app/shared/services/note.service';

import { Note } from 'src/app/shared/models/note.model';
import { NoteDialogResult } from 'src/app/shared/models/note-dialog-result';

@Component({
  selector: 'note-mobile',
  templateUrl: './note-mobile.component.html',
  styleUrls: ['./note-mobile.scss']
})

export class NoteMobileComponent {

  @Input() note: Note | null = null;
  @Input() currentList: string | null = null;
  @Input() notesToDoInErpList: Note[];
  @Input() notesToDoInPersAppList: Note[];
  @Input() notesToTestInMasterList: Note[];
  @Input() notesToTestInErpList: Note[];
  @Input() notesToTestInPersAppAfterBuildList: Note[];  
  @Input() notesToFixAfterTestInMasterList: Note[];
  @Input() notesToFixAfterTestInErpList: Note[];  
  @Input() notesToFixAfterTestInPersAppAfterBuildList: Note[];  
  @Input() notificationsList: Note[];  

  @Output() allowDrag = new EventEmitter<boolean>();

  pictureFile: string;
  FileName: string;
  urlFile: string;
  
  constructor(
    public noteService: NoteService,
    public dialogService: MatDialog,
    private store: AngularFirestore
  ) {}

  deleteNote(noteId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this note!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.store.collection(this.currentList).doc(noteId).delete();
        Swal.fire(
          'Task has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

}