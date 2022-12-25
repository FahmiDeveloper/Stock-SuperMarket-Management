import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';

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
  
  modalRefDeleteTask: any;

  constructor(private store: AngularFirestore, public dialogService: MatDialog) {}

  openDeleteTaskModal(contentDeleteTask, event) {
    event.stopPropagation();
    this.modalRefDeleteTask =  this.dialogService.open(contentDeleteTask, {
      width: '30vw',
      height:'36vh',
      maxWidth: '100vw'
    }); 
  }

  confirmDelete() {
    this.store.collection(this.currentList).doc(this.task.id).delete();
  }

  close() {
    this.modalRefDeleteTask.close();
  }

}