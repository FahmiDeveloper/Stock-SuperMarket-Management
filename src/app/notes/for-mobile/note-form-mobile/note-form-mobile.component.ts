import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { NoteService } from 'src/app/shared/services/note.service';

import { Note } from 'src/app/shared/models/note.model';

@Component({
  selector: 'note-form-mobile',
  templateUrl: './note-form-mobile.component.html',
  styleUrls: ['./note-form-mobile.scss']
})

export class NoteFormMobileComponent implements OnInit {

  arrayNotes: Note[];

  note: Note = new Note();
  
  constructor(
    public noteService: NoteService,
    public dialogRef: MatDialogRef<NoteFormMobileComponent>
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