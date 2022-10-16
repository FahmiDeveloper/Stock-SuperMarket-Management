import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import * as moment from 'moment';

import { TaskDialogData } from 'src/app/shared/models/task-dialog-data';
import { Task } from 'src/app/shared/models/task.model';

@Component({
    selector: 'task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.scss']
})

export class TaskFormComponent implements OnInit{

  rangeDays: string[] = [
    'Today', 
    'Tomorrow', 
    'This week', 
    'Next week', 
    'Later'
  ];

  private backupTask: Partial<Task> = { ...this.data.task };

  formControl = new FormControl('', [Validators.required]);

  constructor(
    public dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {}

  ngOnInit(): void {
    if (!this.data.task.id) this.data.task.date = moment().format('YYYY-MM-DD');
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :'';
  }
}