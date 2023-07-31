import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { NoteFormMobileComponent } from './note-form-mobile/note-form-mobile.component';

import { NoteService } from 'src/app/shared/services/note.service';

import { Note } from 'src/app/shared/models/note.model';

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
  keywordSelected: string;
  keywordsList: string[] = [];

  menuTopLeftPosition =  {x: '0', y: '0'} 

  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger; 

  subscriptionForGetAllNotes: Subscription;
  subscriptionForGetAllNotesForAdd: Subscription;
  subscriptionForGetAllKeywordsNotes: Subscription;
  
  constructor(
    public noteService: NoteService,
    public dialogService: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getAllKeywordsNotes();
    this.getAllNotes();
    this.getAllNotesForAdd();
  }

  getAllKeywordsNotes() {
    this.subscriptionForGetAllKeywordsNotes = this.noteService
    .getAll()
    .subscribe((notes: Note[]) => {

      this.keywordsList = [];
         
      notes.forEach(note => {
        if (!this.keywordsList.includes(note.keyword)) {
          this.keywordsList.push(note.keyword);
        }
      })
    });
  }

  getAllNotes() {
    this.subscriptionForGetAllNotes = this.noteService
    .getAll()
    .subscribe((notes: Note[]) => {

      if (this.content) {
        this.notesList = notes.filter(note => note.keyword.toLowerCase().includes(this.content.toLowerCase()));
        this.notesList = this.notesList.sort((n1, n2) => n1.numRefNote - n2.numRefNote);
      }
      
      else if (this.keywordSelected) {
        this.notesList = notes.filter(note => note.keyword == this.keywordSelected);
        this.notesList = this.notesList.sort((n1, n2) => n1.numRefNote - n2.numRefNote);
      }

      else {
        this.notesList = notes.sort((n1, n2) => n2.numRefNote - n1.numRefNote);
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

  OnPageChange(elem: HTMLElement){
    elem.scrollIntoView();
  }

  newNote() {
    const dialogRef = this.dialogService.open(NoteFormMobileComponent, {
      width: '98vw',
      height:'55vh',
      maxWidth: '100vw', 
      data: {note: {}}
    });
    dialogRef.componentInstance.arrayNotes = this.notesListCopie;
  }

  editNote(note?: Note) {
    const dialogRef = this.dialogService.open(NoteFormMobileComponent, {
      width: '98vw',
      height:'55vh',
      maxWidth: '100vw'
    });
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

  openMenuTrigger(event: MouseEvent, note: Note) { 
    // preventDefault avoids to show the visualization of the right-click menu of the browser 
    event.preventDefault(); 

    // we record the mouse position in our object 
    this.menuTopLeftPosition.x = event.clientX + 'px'; 
    this.menuTopLeftPosition.y = event.clientY + 'px'; 

    // we open the menu 
    // we pass to the menu the information about our object 
    this.matMenuTrigger.menuData = {note: note};

    // we open the menu 
    this.matMenuTrigger.openMenu(); 
  }

  ngOnDestroy() {
    this.subscriptionForGetAllNotes.unsubscribe();
    this.subscriptionForGetAllNotesForAdd.unsubscribe();
    this.subscriptionForGetAllKeywordsNotes.unsubscribe();
  }

}