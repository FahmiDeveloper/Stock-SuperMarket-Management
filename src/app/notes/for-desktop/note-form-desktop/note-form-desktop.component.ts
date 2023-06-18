import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { NoteService } from 'src/app/shared/services/note.service';

import { Note } from 'src/app/shared/models/note.model';

@Component({
  selector: 'note-form-desktop',
  templateUrl: './note-form-desktop.component.html',
  styleUrls: ['./note-form-desktop.scss']
})

export class NoteFormDesktopComponent implements OnInit {

  arrayNotes: Note[];

  note: Note = new Note();
  
  constructor(
    public noteService: NoteService,
    public dialogRef: MatDialogRef<NoteFormDesktopComponent>
  ) {}

  ngOnInit() {}

  
  save() {
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

  close() {
    this.dialogRef.close();
  }

}