import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

import { Task } from 'src/app/shared/models/task.model';

@Component({
    selector: 'task',
    templateUrl: './task.component.html',
    styleUrls: ['./task.scss']
})

export class TaskComponent {

  @Input() task: Task | null = null;
  @Input() currentList: string | null = null;

  @Output() edit = new EventEmitter<Task>();

  constructor(private store: AngularFirestore) {}

  deleteTask(event) {
    event.stopPropagation();
    this.store.collection(this.currentList).doc(this.task.id).delete();
  }

}