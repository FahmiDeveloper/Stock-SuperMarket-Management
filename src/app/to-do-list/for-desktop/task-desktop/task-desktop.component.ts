import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
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

export class TaskDesktopComponent implements OnChanges {

  @Input() task: Task | null = null;
  @Input() currentList: string | null = null;
  @Input() currentTaskList: Task[];

  @Output() edit = new EventEmitter<Task>();

  passedTask: boolean = false;
  inCorrectDate: boolean = false;
  
  constructor(private store: AngularFirestore, public dialogService: MatDialog) {}

  ngOnChanges(changes: import("@angular/core").SimpleChanges) {
    let composedDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    let today = moment().format('YYYY-MM-DD');
    let taskDate = new Date(this.task.date);

    if (this.currentList == 'toDoToday') {  
     if (composedDate.getTime() > taskDate.getTime()) {
        this.passedTask = true;      
      }
    }
    else if (this.currentList == 'toDoTomorrow') {
      if (this.task.date == today || composedDate.getTime() > taskDate.getTime()) {
        this.passedTask = true;      
      }
    }
    else if (this.currentList == 'toDoThisWeek') {
      let tomorrow =  new Date();
      tomorrow.setDate(new Date().getDate() + 1);

      if (this.task.date == moment(tomorrow).format('YYYY-MM-DD') || this.task.date == today || composedDate.getTime() > taskDate.getTime()) {
        this.passedTask = true;      
      }
    }
    else if (this.currentList == 'toDoNextWeek') {
      var curr = new Date; // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      var last = first + 6; // last day is the first day + 6
      
      var firstday = new Date(curr.setDate(first));
      var lastday = new Date(curr.setDate(last));

      let tomorrow =  new Date();
      tomorrow.setDate(new Date().getDate() + 1);

      if (
        new Date(this.task.date).getTime() <= lastday.getTime() && new Date(this.task.date).getTime() >= firstday.getTime() ||
        this.task.date == moment(tomorrow).format('YYYY-MM-DD') || 
        this.task.date == today || composedDate.getTime() > taskDate.getTime()
      ) {
        this.passedTask = true;      
      }
    }
    else {
      var curr = new Date; // get current date
      var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
      var last = first + 6; // last day is the first day + 6
      
      var firstday = new Date(curr.setDate(first));
      var lastday = new Date(curr.setDate(last));


      var firstNextWeek = first + 7; // last day is the first day + 6
      var lastNextWeek = firstNextWeek + 6;
      
      var firstNextWeekday = new Date(curr.setDate(firstNextWeek));
      var lastNextWeekday = new Date(curr.setDate(lastNextWeek));

      let tomorrow =  new Date();
      tomorrow.setDate(new Date().getDate() + 1);

      if (
        (new Date(this.task.date).getTime() <= lastNextWeekday.getTime() && new Date(this.task.date).getTime() >= firstNextWeekday.getTime()) ||
        (new Date(this.task.date).getTime() <= lastday.getTime() && new Date(this.task.date).getTime() >= firstday.getTime()) ||
        (this.task.date == moment(tomorrow).format('YYYY-MM-DD')) || 
        (this.task.date == today || composedDate.getTime() > taskDate.getTime())
      ) {
        this.passedTask = true;      
      }
    }

    var taskDateForDateDiff:any = new Date(this.task.date);
    var dateTodayForDateDiff:any = new Date();
    var dateDiff = new Date(dateTodayForDateDiff - taskDateForDateDiff);

    let dateTomorrow =  new Date();
    dateTomorrow.setDate(new Date().getDate() + 1);

    var curr = new Date; // get current date
    var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
    var last = first + 6; // last day is the first day + 6
    
    var firstday = new Date(curr.setDate(first));
    var lastday = new Date(curr.setDate(last));

    var firstNextWeek = first + 7; // last day is the first day + 6
    var lastNextWeek = firstNextWeek + 6;
    
    var firstNextWeekday = new Date(curr.setDate(firstNextWeek));
    var lastNextWeekday = new Date(curr.setDate(lastNextWeek));

    this.task.diffDate =
    this.currentList == 'toDoLater' && 
    (new Date(this.task.date).getTime() <= lastNextWeekday.getTime() && new Date(this.task.date).getTime() >= firstNextWeekday.getTime()) && 
    (moment(taskDateForDateDiff).format('YYYY-MM-DD') !== moment(dateTomorrow).format('YYYY-MM-DD')) && 
    (dateDiff.getDate() - 1 !== 0) ? 'Next week'

    : this.currentList == 'toDoLater' &&
    (new Date(this.task.date).getTime() <= lastday.getTime() && new Date(this.task.date).getTime() >= firstday.getTime()) && 
    (moment(taskDateForDateDiff).format('YYYY-MM-DD') !== moment(dateTomorrow).format('YYYY-MM-DD')) && 
    (dateDiff.getDate() - 1 !== 0) ? 'This week'
    
    : this.currentList == 'toDoNextWeek' && 
    new Date(this.task.date).getTime() <= lastday.getTime() && 
    new Date(this.task.date).getTime() >= firstday.getTime() && 
    (moment(taskDateForDateDiff).format('YYYY-MM-DD') !== moment(dateTomorrow).format('YYYY-MM-DD')) && 
    (dateDiff.getDate() - 1 !== 0) ? 'This week'

    : (moment(taskDateForDateDiff).format('YYYY-MM-DD') == moment(dateTomorrow).format('YYYY-MM-DD')) ? 'Tomorrow' 

    : (dateDiff.getDate() - 1 == 0) ? 'Today'

    : (dateDiff.getDate() - 1) + "D" ;
  }

  editTask(task: Task){
    let firstRange = task.taskToDoIn;
    let defaultTaskDate = task.date;

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
        if (rangeSelected === 'Today' && result.task.date !== moment().format('YYYY-MM-DD')) {
          result.task.date = moment().format('YYYY-MM-DD');
        } 
        else if (rangeSelected === 'Tomorrow') {
          const today = new Date()
          let tomorrow =  new Date()
          tomorrow.setDate(today.getDate() + 1);
          if (result.task.date !== moment(tomorrow).format('YYYY-MM-DD')) {
            result.task.date = moment(tomorrow).format('YYYY-MM-DD');
          }
        }
        else if (rangeSelected === 'This week') {
          var curr = new Date; // get current date
          var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
          var last = first + 6; // last day is the first day + 6
          
          var firstday = new Date(curr.setDate(first));
          var lastday = new Date(curr.setDate(last));

          if((new Date(result.task.date).getTime() <= lastday.getTime() && new Date(result.task.date).getTime() >= firstday.getTime())) {
            this.inCorrectDate = false;
          }
          else {
            this.inCorrectDate = true;
            result.task.date = defaultTaskDate;
          }      
        }
        else if (rangeSelected === 'Next week') {
          var curr = new Date; // get current date
          var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
          var firstNextWeek = first + 7; // last day is the first day + 6
          var lastNextWeek = firstNextWeek + 6;
          
          var firstNextWeekday = new Date(curr.setDate(firstNextWeek));
          var lastNextWeekday = new Date(curr.setDate(lastNextWeek));


          if((new Date(result.task.date).getTime() <= lastNextWeekday.getTime() && new Date(result.task.date).getTime() >= firstNextWeekday.getTime())) {
            this.inCorrectDate = false;
          }
          else {
            this.inCorrectDate = true;
            result.task.date = defaultTaskDate;
          }      
        } 
        else {
          const today = new Date();
          let tomorrow =  new Date();
          tomorrow.setDate(today.getDate() + 1);

          var curr = new Date; // get current date
          var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
          var last = first + 6; // last day is the first day + 6
          
          var firstday = new Date(curr.setDate(first));
          var lastday = new Date(curr.setDate(last));

          var firstNextWeek = first + 7; // last day is the first day + 6
          var lastNextWeek = firstNextWeek + 6;
          
          var firstNextWeekday = new Date(curr.setDate(firstNextWeek));
          var lastNextWeekday = new Date(curr.setDate(lastNextWeek));

          if (
            result.task.date == moment().format('YYYY-MM-DD') || 
            result.task.date == moment(tomorrow).format('YYYY-MM-DD') || 
            (new Date(result.task.date).getTime() <= lastday.getTime() && new Date(result.task.date).getTime() >= firstday.getTime()) ||
            (new Date(result.task.date).getTime() <= lastNextWeekday.getTime() && new Date(result.task.date).getTime() >= firstNextWeekday.getTime())
          ) {
            this.inCorrectDate = true;
            result.task.date = defaultTaskDate;
          } 
          else {
            this.inCorrectDate = false;
          }
        }

        if (this.inCorrectDate) {
          Swal.fire(
            'Choose correct date',
            '',
            'warning'
          )         
        }
        else {
          this.store.collection(this.currentList).doc(task.id).update(task);
          Swal.fire(
            'Task data has been updated successfully',
            '',
            'success'
          ) 
        }  
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