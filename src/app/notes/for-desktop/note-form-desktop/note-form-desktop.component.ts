import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

import { NoteService } from 'src/app/shared/services/note.service';
import { SubjectNotesService } from 'src/app/shared/services/subject-note.service';

import { Note } from 'src/app/shared/models/note.model';
import { SubjectNotes } from 'src/app/shared/models/subject-note.model';

@Component({
  selector: 'note-form-desktop',
  templateUrl: './note-form-desktop.component.html',
  styleUrls: ['./note-form-desktop.scss']
})

export class NoteFormDesktopComponent implements OnInit {

  arrayNotes: Note[];
  arraySubjectNotes: SubjectNotes[];
  arraySubjectNotesForNewSubject: SubjectNotes[];

  note: Note = new Note();
  subjectNotesSelected: SubjectNotes = new SubjectNotes();

  subjectHaveNotes: boolean;
  subjectDeleted: boolean = false;

  basePath = '/FilesNotes';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;
  
  formControl = new FormControl('', [Validators.required]);

  constructor(
    public noteService: NoteService,
    public subjectNotesService: SubjectNotesService,
    private fireStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<NoteFormDesktopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Note
  ) {}

  ngOnInit() {
    if (this.note.key) {
      this.subjectNotesSelected = this.arraySubjectNotes.find(subjectNotes => subjectNotes.id == this.note.subjectNotesId);
      this.subjectHaveNotes = (this.arrayNotes.filter(note => note.subjectNotesId == this.subjectNotesSelected.id).length) ? true : false;
    }
  }

  save() {
    this.note.subjectNotesId = this.subjectNotesSelected.id;

    if (this.note.key) {
      this.noteService.update(this.note.key, this.note);

      Swal.fire(
        'Note data has been updated successfully',
        '',
        'success'
      )

    } else {
      if (this.arrayNotes[0] && this.arrayNotes[0].numRefNote) this.note.numRefNote = this.arrayNotes[0].numRefNote + 1;
      else this.note.numRefNote = 1;

      this.noteService.create(this.note);

      Swal.fire(
      'New note added successfully',
      '',
      'success'
      )

    }
    this.close();
  }

  async onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.note.urlFile = url;
        this.note.fileName = file.name;
        Swal.fire(
          'File has been uploaded successfully',
          '',
          'success'
        )
      });  // <<< url is found here

    } else {  
      alert('No file selected');
      this.note.urlFile = '';
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :'';
  }

  close() {
    this.dialogRef.close();
  }

  newSubjectNotes() {
    Swal.fire({
      title: 'New subject notes',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        let subjectNotes: SubjectNotes = new SubjectNotes();
        subjectNotes.id = (this.arraySubjectNotesForNewSubject[this.arraySubjectNotesForNewSubject.length-1] 
        && this.arraySubjectNotesForNewSubject[this.arraySubjectNotesForNewSubject.length-1].id) ? this.arraySubjectNotesForNewSubject[this.arraySubjectNotesForNewSubject.length-1].id + 1 : 1;
        subjectNotes.subjectNotesName = result.value;

        this.arraySubjectNotes.push(subjectNotes);

        this.subjectNotesSelected = subjectNotes;

        this.subjectNotesService.create(subjectNotes);

        Swal.fire(
          'New subject notes added successfully',
          '',
          'success'
        )
      }
    })
  }

  editSubjectNotes(subjectNotesSelected: SubjectNotes) {
    Swal.fire({
      title: 'Edit subject notes',
      input: 'text',
      inputValue: subjectNotesSelected.subjectNotesName,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        subjectNotesSelected.subjectNotesName = result.value;

        this.subjectNotesService.update(subjectNotesSelected.key, subjectNotesSelected);
        
        Swal.fire(
          'Subject notes data has been updated successfully',
          '',
          'success'
        )
      }
    })
  }

  deleteSubjectNotes(subjectNotesKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this subject notes!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.subjectNotesService.delete(subjectNotesKey);
        this.arraySubjectNotes.forEach((subjectNotes, index) => {
          if(subjectNotes.key === subjectNotesKey) this.arraySubjectNotes.splice(index,1);
        });
        this.subjectDeleted = true;
        Swal.fire(
          'Subject notes has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  checkIfSubjectHaveNotes() {
    this.subjectHaveNotes = (this.arrayNotes.filter(note => note.subjectNotesId == this.subjectNotesSelected.id).length) ? true : false;
  }

}
