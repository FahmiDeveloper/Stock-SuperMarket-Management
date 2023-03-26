import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AngularFirestore } from '@angular/fire/firestore';

import Swal from 'sweetalert2';
import * as fileSaver from 'file-saver';

import { NoteFormMobileComponent } from '../note-form-mobile/note-form-mobile.component';

import { NoteService } from 'src/app/shared/services/note.service';

import { Note } from 'src/app/shared/models/note.model';
import { SubjectNotes } from 'src/app/shared/models/subject-note.model';
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
  @Input() subjectNotesList: SubjectNotes[];
  @Input() arraySubjectNotesForNewSubject: SubjectNotes[];

  @Output() allowDrag = new EventEmitter<boolean>();

  pictureFile: string;
  FileName: string;
  urlFile: string;
  
  constructor(
    public noteService: NoteService,
    public dialogService: MatDialog,
    private store: AngularFirestore
  ) {}

  editNote(note: Note) {
    let firstSubjectNoteId = note.subjectNotesId;

    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      width: '98vw',
      maxWidth: '100vw',
      data: {
        note,
        enableDelete: true,
      }
    }
    const dialogRef = this.dialogService.open(NoteFormMobileComponent, config);

    dialogRef.componentInstance.arraySubjectNotes = this.subjectNotesList;
    dialogRef.componentInstance.arraySubjectNotesForNewSubject = this.arraySubjectNotesForNewSubject;

    dialogRef.afterClosed().subscribe((result: NoteDialogResult|undefined) => {
      if (!result) {
        return;
      }

      if (result.note.subjectNotesId == firstSubjectNoteId) {
        this.store.collection(this.currentList).doc(note.id).update(note);
        Swal.fire(
          'Task data has been updated successfully',
          '',
          'success'
        ) 
      }
      else {
        let previousContentNote = result.note.contentNote;
        let previousRemarkNote = result.note.remark ? result.note.remark : '';
        this.store.collection(this.currentList).doc(note.id).delete();
        result.note.contentNote = previousContentNote;
        result.note.remark = previousRemarkNote;

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
          'Task subject has been updated successfully',
          '',
          'success'
        )
      }   
    });
  }

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

  viewPictureFile(note: Note, showPicture) {
    this.pictureFile = note.urlFile;
    this.FileName = note.fileName.substring(0, note.fileName.lastIndexOf("."));

    this.dialogService.open(showPicture, {
      width: '98vw',
      height:'75vh',
      maxWidth: '100vw'
    });
  }

  viewOtherFile(note: Note, showOtherFile) {
    this.urlFile = note.urlFile;
    this.FileName = note.fileName.substring(0, note.fileName.lastIndexOf("."));

    this.dialogService.open(showOtherFile, {
      width: '98vw',
      height:'75vh',
      maxWidth: '100vw'
    });
  }

  downloadFile(note: Note) {
    fetch(note.urlFile)
    .then(res => res.blob()) // Gets the response and returns it as a blob
    .then(blob => {
      fileSaver.saveAs(blob, note.fileName.substring(0, note.fileName.lastIndexOf(".")));
    });
  }

  checkIsImage(urlFile: string): boolean {
    let imageExtentions = ['.jpeg', '.jpg', '.png', '.gif']; // Array of image extention
    if (urlFile.includes(imageExtentions[0]) || urlFile.includes(imageExtentions[1]) || urlFile.includes(imageExtentions[2]) || urlFile.includes(imageExtentions[3]))
    return true;
    else return false;
  }

  checkIsPdf(urlFile: string): boolean {
    if (urlFile.includes('.pdf'))
    return true;
    else return false;
  }

  checkIsExcel(urlFile: string): boolean {
    if (urlFile.includes('.xlsx'))
    return true;
    else return false;
  }

  checkIsTxt(urlFile: string): boolean {
    if (urlFile.includes('.txt'))
    return true;
    else return false;
  }

  checkIsWord(urlFile: string): boolean {
    if (urlFile.includes('.docx'))
    return true;
    else return false;
  }

  viewNoteOrRemark(contentNoteOrRemark: string) {
    Swal.fire({
      text: contentNoteOrRemark,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Close'
    });
  }

  allowDragTask() {
    this.allowDrag.emit(true);
  }

}