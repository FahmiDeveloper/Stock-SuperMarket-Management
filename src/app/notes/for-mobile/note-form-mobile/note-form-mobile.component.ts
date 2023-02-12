import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

import { NoteService } from 'src/app/shared/services/note.service';

import { Note, SubjectList } from 'src/app/shared/models/note.model';

@Component({
  selector: 'note-form-mobile',
  templateUrl: './note-form-mobile.component.html',
  styleUrls: ['./note-form-mobile.scss']
})

export class NoteFormMobileComponent implements OnInit {

  arrayNotes: Note[];
  pagedList: Note[];

  note: Note = new Note();

  selectedSubjectId: number;

  basePath = '/FilesNotes';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;
  
  formControl = new FormControl('', [Validators.required]);

  subjectList: SubjectList[] = [
    {id: 1, subjectName: 'Notes to do'},
    {id: 2, subjectName: 'Test in master'},
    {id: 3, subjectName: 'Test in ERP'},
    {id: 4, subjectName: 'Notifications'},
    {id: 5, subjectName: 'To fix after test'}  
  ];

  constructor(
    public noteService: NoteService,
    private fireStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<NoteFormMobileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Note[]
  ) {}

  ngOnInit() {
    this.data = this.pagedList;

    if (this.note.key) {
      if (this.note.noteToDo == true) this.selectedSubjectId = 1;
      else if (this.note.testWorkInMaster == true) this.selectedSubjectId = 2;
      else if (this.note.testWorkInERP == true) this.selectedSubjectId = 3;
      else if (this.note.noteForNotif == true) this.selectedSubjectId = 4;
      else if (this.note.toFixAfterTest == true) this.selectedSubjectId = 5;
    }
  }

  save() { 
    if (this.selectedSubjectId == 1) {
      this.note.noteToDo = true;
      this.note.testWorkInMaster = false;
      this.note.testWorkInERP = false;
      this.note.noteForNotif = false;
      this.note.toFixAfterTest = false;
    }
    if (this.selectedSubjectId == 2) {
      this.note.noteToDo = false;
      this.note.testWorkInMaster = true;
      this.note.testWorkInERP = false;
      this.note.noteForNotif = false;
      this.note.toFixAfterTest = false;
    }
    if (this.selectedSubjectId == 3) {
      this.note.noteToDo = false;
      this.note.testWorkInMaster = false;
      this.note.testWorkInERP = true;
      this.note.noteForNotif = false;
      this.note.toFixAfterTest = false;
    }
    if (this.selectedSubjectId == 4) {
      this.note.noteToDo = false;
      this.note.testWorkInMaster = false;
      this.note.testWorkInERP = false;
      this.note.noteForNotif = true;
      this.note.toFixAfterTest = false;
    }
    if (this.selectedSubjectId == 5) {
      this.note.noteToDo = false;
      this.note.testWorkInMaster = false;
      this.note.testWorkInERP = false;
      this.note.noteForNotif = false;
      this.note.toFixAfterTest = true;
    }
       
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
    this.dialogRef.close(this.data);
  }

}
