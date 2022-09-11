import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Task } from 'src/app/shared/models/task.model';

@Component({
    selector: 'task-mobile',
    templateUrl: './task-mobile.component.html',
    styleUrls: ['./task-mobile.scss']
})

export class TaskMobileComponent {

  @Input() task: Task | null = null;
  @Input() currentList: string | null = null;

  @Output() edit = new EventEmitter<Task>();

  constructor(private store: AngularFirestore) {}

  deleteTask(event) {
    event.stopPropagation();
    this.store.collection(this.currentList).doc(this.task.id).delete();
  }

}