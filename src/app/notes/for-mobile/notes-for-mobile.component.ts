import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as fileSaver from 'file-saver';

import { NoteFormMobileComponent } from './note-form-mobile/note-form-mobile.component';

import { NoteService } from 'src/app/shared/services/note.service';
import { SubjectNotesService } from 'src/app/shared/services/subject-note.service';

import { Note } from 'src/app/shared/models/note.model';
import { SubjectNotes } from 'src/app/shared/models/subject-note.model';

@Component({
  selector: 'notes-for-mobile',
  templateUrl: './notes-for-mobile.component.html',
  styleUrls: ['./notes-for-mobile.scss']
})

export class NotesForMobileComponent implements OnInit, OnDestroy {

  notesList: Note[] = [];
  notesListCopieForNewNote: Note[] = [];
  subjectNotesList: SubjectNotes[] = [];
  arraySubjectNotesForNewSubject: SubjectNotes[] = [];

  subjectNotesSelectedId: number = 1;
  pictureFile: string;
  FileName: string;
  urlFile: string;

  subscriptionForGetAllNotes: Subscription;
  subscriptionForGetAllSubjectNotes: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  
  constructor(
    public noteService: NoteService,
    public subjectNotesService: SubjectNotesService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.getAllNotes();
    this.getAllSubjectNotes();
  }

  getAllNotes() {
    this.subscriptionForGetAllNotes = this.noteService
    .getAll()
    .subscribe((notes: Note[]) => {

      this.notesListCopieForNewNote = notes.sort((n1, n2) => n2.numRefNote - n1.numRefNote);

      if (this.subjectNotesSelectedId) {
        if (this.subjectNotesSelectedId == 1 || this.subjectNotesSelectedId == 9) {
          this.notesList = notes
          .filter(note => note.subjectNotesId == this.subjectNotesSelectedId)
          .sort((n1, n2) => n2.numRefNote - n1.numRefNote);
        }
        else {
          this.notesList = notes
          .filter(note => note.subjectNotesId == this.subjectNotesSelectedId)
          .sort((n1, n2) => n1.numRefNote - n2.numRefNote);
        }   
      }
      else {
        this.notesList = notes.sort((n1, n2) => n2.numRefNote - n1.numRefNote)
      }

    });
  }

  getAllSubjectNotes() {
    this.subscriptionForGetAllSubjectNotes = this.subjectNotesService
    .getAll()
    .subscribe((subjectNotes: SubjectNotes[]) => {
      this.subjectNotesList = subjectNotes.sort((n1, n2) => n1.id - n2.id);
      this.arraySubjectNotesForNewSubject = subjectNotes;
    });
  }

  newNote() {
    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      width: '98vw',
      maxWidth: '100vw'
    }
    const dialogRef = this.dialogService.open(NoteFormMobileComponent, config);

    dialogRef.componentInstance.arrayNotes = this.notesListCopieForNewNote;
    dialogRef.componentInstance.arraySubjectNotes = this.subjectNotesList;
    dialogRef.componentInstance.arraySubjectNotesForNewSubject = this.arraySubjectNotesForNewSubject;
  }

  editNote(note?: Note) {
    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      width: '98vw',
      maxWidth: '100vw'
    }
    const dialogRef = this.dialogService.open(NoteFormMobileComponent, config);
    
    dialogRef.componentInstance.note = note;
    dialogRef.componentInstance.arrayNotes = this.notesListCopieForNewNote;
    dialogRef.componentInstance.arraySubjectNotes = this.subjectNotesList;
  }

  deleteNote(noteKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this note!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.noteService.delete(noteKey);
        Swal.fire(
          'Note has been deleted successfully',
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
  }

  ngOnDestroy() {
    this.subscriptionForGetAllNotes.unsubscribe();
    this.subscriptionForGetAllSubjectNotes.unsubscribe()
  }

}
