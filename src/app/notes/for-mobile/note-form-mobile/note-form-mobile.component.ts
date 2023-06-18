import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

import { NoteService } from 'src/app/shared/services/note.service';

import { NoteDialogData } from 'src/app/shared/models/note-dialog-data';

@Component({
  selector: 'note-form-mobile',
  templateUrl: './note-form-mobile.component.html',
  styleUrls: ['./note-form-mobile.scss']
})

export class NoteFormMobileComponent implements OnInit {


  defaultSubjectNotesId: number;

  basePath = '/FilesNotes';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;
  
  formControl = new FormControl('', [Validators.required]);

  constructor(
    public noteService: NoteService,
    private fireStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<NoteFormMobileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: NoteDialogData
  ) {}

  ngOnInit() {
  }

  

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :'';
  }

  close() {
    this.dialogRef.close();
  }



}