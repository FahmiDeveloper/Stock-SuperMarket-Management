import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import * as moment from 'moment';

import { Task } from 'src/app/shared/models/task.model';

@Component({
    selector: 'task-form',
    templateUrl: './task-form.component.html',
    styleUrls: ['./task-form.scss']
})

export class TaskFormComponent implements OnInit{

    private backupTask: Partial<Task> = { ...this.data.task };

    constructor(
      public dialogRef: MatDialogRef<TaskFormComponent>,
      @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
    ) {}

    ngOnInit(): void {
      if (!this.data.task.id) this.data.task.date = moment().format('YYYY-MM-DD');
    }
  
    cancel(): void {
      // this.data.task.title = this.backupTask.title;
      // this.data.task.date = this.backupTask.date;
      // this.data.task.description = this.backupTask.description;
      this.dialogRef.close();
    }
}
  
export interface TaskDialogData {
    task: Partial<Task>;
    enableDelete: boolean;
}

export interface TaskDialogResult {
    task: Task;
    delete?: boolean;
}