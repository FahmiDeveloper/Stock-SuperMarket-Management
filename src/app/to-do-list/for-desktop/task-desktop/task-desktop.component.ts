import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { Task } from 'src/app/shared/models/task.model';

@Component({
    selector: 'task-desktop',
    templateUrl: './task-desktop.component.html',
    styleUrls: ['./task-desktop.scss']
})

export class TaskDesktopComponent {

  @Input() task: Task | null = null;
  @Input() currentList: string | null = null;

  @Output() edit = new EventEmitter<Task>();
  
  constructor(private store: AngularFirestore, public dialogService: MatDialog) {}

  deleteTask(taskId, event) {
    event.stopPropagation();
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this task!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.store.collection(this.currentList).doc(taskId).delete();
        Swal.fire(
          'Task has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

}