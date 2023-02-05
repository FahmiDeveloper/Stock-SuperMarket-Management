import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as fileSaver from 'file-saver';

import { NoteFormDesktopComponent } from './note-form-desktop/note-form-desktop.component';

import { NoteService } from 'src/app/shared/services/note.service';

import { Note, SubjectList } from 'src/app/shared/models/note.model';

@Component({
  selector: 'notes-for-desktop',
  templateUrl: './notes-for-desktop.component.html',
  styleUrls: ['./notes-for-desktop.scss']
})

export class NotesForDesktopComponent implements OnInit, OnDestroy {

  notesList: Note[] = [];
  pagedList: Note[]= [];
  notesListCopieForNewNote: Note[] = [];

  length: number = 0;

  isDesktop: boolean;
  isTablet: boolean;
  subjectSelectedId: number;
  pictureFile: string;
  FileName: string;
  urlFile: string;

  subscriptionForGetAllNotes: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  
  subjectList: SubjectList[] = [
    {id: 1, subjectName: 'Test in master'},
    {id: 2, subjectName: 'Test in ERP'},
    {id: 3, subjectName: 'Notes to do'},
    {id: 4, subjectName: 'Notifications'}  
  ];
  
  constructor(
    public noteService: NoteService,
    public dialogService: MatDialog,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();

    this.getAllNotes();
  }

  getAllNotes() {
    this.subscriptionForGetAllNotes = this.noteService
    .getAll()
    .subscribe((notes: Note[]) => {

      this.notesListCopieForNewNote = notes.sort((n1, n2) => n2.numRefNote - n1.numRefNote);

      if (this.subjectSelectedId == 1) {
        this.notesList = notes.filter(note => note.testWorkInMaster == true).sort((n1, n2) => n1.numRefNote - n2.numRefNote);
      }
      else if (this.subjectSelectedId == 2) {
        this.notesList = notes.filter(note => note.testWorkInERP == true).sort((n1, n2) => n1.numRefNote - n2.numRefNote);
      }
      else if (this.subjectSelectedId == 3) {
        this.notesList = notes.filter(note => note.noteToDo == true).sort((n1, n2) => n2.numRefNote - n1.numRefNote);
      }
      else if (this.subjectSelectedId == 4) {
        this.notesList = notes.filter(note => note.noteForNotif == true).sort((n1, n2) => n2.numRefNote - n1.numRefNote);
      }
      else {
        this.notesList = notes.sort((n1, n2) => n2.numRefNote - n1.numRefNote)
      }

      this.pagedList = this.notesList.slice(0, 8);
      this.length = this.notesList.length;

    });
  }

  OnPageChange(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedList = this.notesList.slice(startIndex, endIndex);
  }

  newNote() {
    const dialogRef = this.dialogService.open(NoteFormDesktopComponent, {width: '500px', data: {movie: {}}});
    dialogRef.componentInstance.arrayNotes = this.notesListCopieForNewNote;
  }

  editNote(note?: Note) {
    const dialogRef = this.dialogService.open(NoteFormDesktopComponent, {width: '500px'});
    dialogRef.componentInstance.note = note;
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

    if (this.isTablet) {
      this.dialogService.open(showPicture, {
        height: '80%',
        width: '100%'
      });
    } else {
      this.dialogService.open(showPicture, {
        width: '40vw',
        height:'85vh',
        maxWidth: '100vw'
      });
    }   
  }

  viewOtherFile(note: Note, showOtherFile) {
    this.urlFile = note.urlFile;
    this.FileName = note.fileName.substring(0, note.fileName.lastIndexOf("."));

    if (this.isTablet) {
      this.dialogService.open(showOtherFile, {
        height: '80%',
        width: '100%'
      });
    } else {
      this.dialogService.open(showOtherFile, {
        width: '40vw',
        height:'85vh',
        maxWidth: '100vw'
      });
    }   
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
  }

}
