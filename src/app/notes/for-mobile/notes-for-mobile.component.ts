import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { NoteFormMobileComponent } from './note-form-mobile/note-form-mobile.component';

import { NoteService } from 'src/app/shared/services/note.service';

import { Note } from 'src/app/shared/models/note.model';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'notes-for-mobile',
  templateUrl: './notes-for-mobile.component.html',
  styleUrls: ['./notes-for-mobile.scss']
})

export class NotesForMobileComponent implements OnInit, OnDestroy {

  notesList: Note[] = [];
  notesListCopie: Note[] = [];

  p: number = 1;
  content: string = '';

  subscriptionForGetAllNotes: Subscription;
  subscriptionForGetAllNotesForAdd: Subscription;
  
  constructor(
    public noteService: NoteService,
    public dialogService: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllNotes();
    this.getAllNotesForAdd();
  }

  getAllNotes() {
    this.subscriptionForGetAllNotes = this.noteService
    .getAll()
    .subscribe((notes: Note[]) => {

      if (this.content) {
        this.notesList = notes.filter(note => note.contentNote.toLowerCase().includes(this.content.toLowerCase()));
        this.notesList = this.notesList.sort((n1, n2) => n1.numRefNote - n2.numRefNote);
      }  
      else {
        this.notesList = notes.sort((n1, n2) => n1.numRefNote - n2.numRefNote);
      }    
           
    });
  }

  getAllNotesForAdd() {
    this.subscriptionForGetAllNotesForAdd = this.noteService
    .getAll()
    .subscribe((notesForAdd: Note[]) => {

      this.notesListCopie = notesForAdd.sort((n1, n2) => n2.numRefNote - n1.numRefNote); 
           
    });
  }

  OnPageChange(event: PageEvent){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  newNote() {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(NoteFormMobileComponent, config);

    dialogRef.componentInstance.arrayNotes = this.notesListCopie;
  }

  editNote(note?: Note) {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(NoteFormMobileComponent, config);
    
    dialogRef.componentInstance.note = note;
  }

  deleteNote(noteKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this content note!',
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

  viewPath(path: string) {
    window.open(path);
  }

  ngOnDestroy() {
    this.subscriptionForGetAllNotes.unsubscribe();
    this.subscriptionForGetAllNotesForAdd.unsubscribe()
  }

}