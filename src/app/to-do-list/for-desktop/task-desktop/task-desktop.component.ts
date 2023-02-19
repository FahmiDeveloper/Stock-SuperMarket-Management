import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import * as moment from 'moment';

import { TaskFormDesktopComponent } from '../task-form-desktop/task-form-desktop.component';

import { Task } from 'src/app/shared/models/task.model';
import { TaskDialogResult } from 'src/app/shared/models/task-dialog-result';

@Component({
    selector: 'task-desktop',
    templateUrl: './task-desktop.component.html',
    styleUrls: ['./task-desktop.scss']
})

export class TaskDesktopComponent {

  @Input() task: Task | null = null;
  @Input() currentList: string | null = null;
  @Input() currentTaskList: Task[];

  @Output() edit = new EventEmitter<Task>();
  
  constructor(private store: AngularFirestore, public dialogService: MatDialog) {}

  editTask(task: Task){
    let firstRange = task.taskToDoIn;

    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      data: {
        task,
        enableDelete: true,
      }
    }
    const dialogRef = this.dialogService.open(TaskFormDesktopComponent, config);

    dialogRef.afterClosed().subscribe((result: TaskDialogResult|undefined) => {
      if (!result) {
        return;
      }
      let rangeSelected = task.taskToDoIn;

      if (firstRange === rangeSelected) {
        this.store.collection(this.currentList).doc(task.id).update(task);
        Swal.fire(
          'Task data has been updated successfully',
          '',
          'success'
        )
      }
      else {
        if (result.task.taskToDoIn == 'Today') {
          let previousTaskName = result.task.title;
          this.store.collection(this.currentList).doc(task.id).delete();
          result.task.title = previousTaskName;
          result.task.date = moment().format('YYYY-MM-DD');
          result.task.orderNo = this.currentTaskList.length ? this.currentTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoToday').add(result.task);
        } 
        else if (result.task.taskToDoIn == 'Tomorrow') {
          let previousTaskName = result.task.title;
          this.store.collection(this.currentList).doc(task.id).delete();
          const today = new Date()
          let tomorrow =  new Date()
          tomorrow.setDate(today.getDate() + 1);
          result.task.title = previousTaskName;
          result.task.date = moment(tomorrow).format('YYYY-MM-DD');
          result.task.orderNo = this.currentTaskList.length ? this.currentTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoTomorrow').add(result.task);
        } 
        else if (result.task.taskToDoIn == 'This week') {
          let previousTaskName = result.task.title;
          this.store.collection(this.currentList).doc(task.id).delete();
          result.task.title = previousTaskName;
          result.task.orderNo = this.currentTaskList.length ? this.currentTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
        this.store.collection('toDoThisWeek').add(result.task);
        } else if (result.task.taskToDoIn == 'Next week') {
          let previousTaskName = result.task.title;
          this.store.collection(this.currentList).doc(task.id).delete();
          result.task.title = previousTaskName;
          result.task.orderNo = this.currentTaskList.length ? this.currentTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoNextWeek').add(result.task);
        } else {
          let previousTaskName = result.task.title;
          this.store.collection(this.currentList).doc(task.id).delete();
          result.task.title = previousTaskName;
          result.task.orderNo = this.currentTaskList.length ? this.currentTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoLater').add(result.task);
        }
        Swal.fire(
          'New task added successfully',
          '',
          'success'
        )
      }
    });
  }

  deleteTask(taskId) {
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