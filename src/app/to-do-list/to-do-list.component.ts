import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { BehaviorSubject, Observable } from 'rxjs';

import { TaskDialogResult, TaskFormComponent } from './task-form/task-form.component';

import { Task } from '../shared/models/task.model';

const getObservable = (collection: AngularFirestoreCollection<Task>) => {
    const subject = new BehaviorSubject<Task[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: Task[]) => {
      subject.next(val);
    });
    return subject;
};

@Component({
    selector: 'to-do-list',
    templateUrl: './to-do-list.component.html',
    styleUrls: ['./to-do-list.scss']
})

export class ToDoListComponent implements OnInit {

  todo = getObservable(this.store.collection('todo')) as Observable<Task[]>;
  inProgress = getObservable(this.store.collection('inProgress')) as Observable<Task[]>;
  done = getObservable(this.store.collection('done')) as Observable<Task[]>;

  taskList: Task[] = [];
  taskListCopie: Task[] = [];
  taskName: string = '';

  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore
  ){}

  ngOnInit(): void {
    this.loadTaskList();
  }

  loadTaskList() {
    this.todo.subscribe(res => {
      this.taskList = res;
      this.taskListCopie = res;
      this.taskList = this.taskList.sort((n1, n2) => n2.orderNo - n1.orderNo);
      this.taskList.forEach((task, index) => {
          task.indexNo = index + 1;
      })
    })
  }

  editTask(list: 'done' | 'todo' | 'inProgress', task: Task): void {
    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '270px',
      data: {
        task,
        enableDelete: true,
      },
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult|undefined) => {
      if (!result) {
        return;
      }
      if (result.delete) {
        this.store.collection(list).doc(task.id).delete();
      } else {
        this.store.collection(list).doc(task.id).update(task);
      }
    });
  }

  drop(event: CdkDragDrop<Task[]>): void {
    
    if (event.previousContainer === event.container) {

      const previousTask = event.previousContainer.data[event.previousIndex];
      const currentTask = event.container.data[event.currentIndex];

      moveItemInArray(
        event.container.data, 
        event.previousIndex, 
        event.currentIndex
      );

      if (event.currentIndex < event.previousIndex) {

        for (var i = event.currentIndex + 1; i <= event.previousIndex; i++) {
          currentTask.orderNo -= 1;
          previousTask.orderNo += 1;

          this.store.collection(event.container.id).doc(currentTask.id).update(currentTask);
          this.store.collection(event.container.id).doc(previousTask.id).update(previousTask);

        }
    }

      if (event.currentIndex > event.previousIndex) {

        for (var i = event.previousIndex; i < event.currentIndex; i++) {
          currentTask.orderNo += 1;
          previousTask.orderNo -= 1;

          this.store.collection(event.container.id).doc(currentTask.id).update(currentTask);
          this.store.collection(event.container.id).doc(previousTask.id).update(previousTask);

        }

      }
     
    } 
    
    // else {

    //   const item = event.previousContainer.data[event.previousIndex];

    //   this.store.firestore.runTransaction(() => {
    //     const promise = Promise.all([
    //     this.store.collection(event.previousContainer.id).doc(item.id).delete(),
    //       this.store.collection(event.container.id).add(item),
    //     ]);
    //     return promise;
    //   });

    //   transferArrayItem(
    //     event.previousContainer.data,
    //     event.container.data,
    //     event.previousIndex,
    //     event.currentIndex
    //   );

    // }

  }

  newTask(): void {

    const dialogRef = this.dialog.open(TaskFormComponent, {
      width: '270px',
      data: {
        task: {},
      },
    });
    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult|undefined) => {
        if (!result) {
          return;
        }
        result.task.orderNo = this.taskList.length ? this.taskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
        this.store.collection('todo').add(result.task);
    });

  }

  searchByTask() {
    this.taskList = [];
    if (this.taskName) {
      this.taskList = this.taskListCopie.filter(task => task.title.toLowerCase().includes(this.taskName.toLowerCase()));
    } else {
      this.taskList = this.taskListCopie;
    }
  }

}