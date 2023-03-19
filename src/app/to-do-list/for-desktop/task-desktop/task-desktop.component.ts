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
  @Input() todayTaskList: Task[];
  @Input() tomorrowTaskList: Task[];
  @Input() thisWeekTaskList: Task[];
  @Input() nextWeekTaskList: Task[];
  @Input() laterTaskList: Task[];

  @Output() edit = new EventEmitter<Task>();

  inCorrectDate: boolean = false;
  passedTask: boolean = false;
  
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
    ////////////////////////////////////////////////////////////////////////////////////
    else if (this.currentList == 'toDoTomorrow') {
      if (this.task.date == today || composedDate.getTime() > taskDate.getTime()) {
        this.passedTask = true;      
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////
    else if (this.currentList == 'toDoThisWeek') {
      let curr = new Date 
      let thisWeekDaysList = [];

      for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() + i 
        let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
        thisWeekDaysList.push(day)
      }

      if(thisWeekDaysList.includes(moment(this.task.date).format('YYYY-MM-DD'))) {
        this.passedTask = false;      
      }
      else {
        this.passedTask = true;      
      }
    }
    ////////////////////////////////////////////////////////////////////////////////////
    else if (this.currentList == 'toDoNextWeek') {
      const dateCopy = new Date(new Date().getTime());
      const nextMonday = new Date(
        dateCopy.setDate(
          dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
        ),
      );
      let nextWeekDaysList = [];
      for (let i = 1; i <= 7; i++) {
        let nextWeekDays = nextMonday.getDate() - nextMonday.getDay() + i
        let day = moment(new Date().setDate(nextWeekDays)).format('YYYY-MM-DD').slice(0, 10)
        nextWeekDaysList.push(day)
      }  

      if(nextWeekDaysList.includes(moment(this.task.date).format('YYYY-MM-DD'))) {
        this.passedTask = false;      
      }
      else {
        this.passedTask = true;
      }     
    }
    ////////////////////////////////////////////////////////////////////////////////////
    else {
      let curr = new Date 
      let thisWeekDaysList = [];
      for (let i = 1; i <= 7; i++) {
        let first = curr.getDate() - curr.getDay() + i 
        let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
        thisWeekDaysList.push(day)
      }

      const dateCopy = new Date(new Date().getTime());
      const nextMonday = new Date(
        dateCopy.setDate(
          dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
        ),
      );
      let nextWeekDaysList = [];
      for (let j = 1; j <= 7; j++) {
        let nextWeekDays = nextMonday.getDate() - nextMonday.getDay() + j
        let day = moment(new Date().setDate(nextWeekDays)).format('YYYY-MM-DD').slice(0, 10)
        nextWeekDaysList.push(day)
      }

      if (nextWeekDaysList.includes(moment(this.task.date).format('YYYY-MM-DD')) ||
          thisWeekDaysList.includes(moment(this.task.date).format('YYYY-MM-DD')) 
      ) {
        this.passedTask = true;      
      }
    }

    //////////////////////////////////calcul dateDiff//////////////////////////////////////////////////

    var taskDateForDateDiff:any = new Date(this.task.date);
    var dateTodayForDateDiff:any = new Date();
    var dateDiff = new Date(dateTodayForDateDiff - taskDateForDateDiff);

    let dateTomorrow =  new Date();
    dateTomorrow.setDate(new Date().getDate() + 1);

    let curr = new Date 
    let thisWeekDaysList = [];

    for (let i = 1; i <= 7; i++) {
      let first = curr.getDate() - curr.getDay() + i 
      let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
      thisWeekDaysList.push(day)
    }

    const dateCopy = new Date(new Date().getTime());

    const nextMonday = new Date(
      dateCopy.setDate(
        dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
      ),
    );

    let nextWeekDaysList = [];

    for (let j = 1; j <= 7; j++) {
      let nextWeekDays = nextMonday.getDate() - nextMonday.getDay() + j
      let day = moment(new Date().setDate(nextWeekDays)).format('YYYY-MM-DD').slice(0, 10)
      nextWeekDaysList.push(day)
    }

    if (this.currentList == 'toDoLater') {
      const today = new Date()
      let tomorrow =  new Date()
      tomorrow.setDate(today.getDate() + 1);
      if (nextWeekDaysList.includes(moment(this.task.date).format('YYYY-MM-DD'))) {
      this.task.diffDate = 'Next week';
      }
      else if (thisWeekDaysList.includes(moment(this.task.date).format('YYYY-MM-DD'))) {
        if(this.task.date == moment(tomorrow).format('YYYY-MM-DD')) {
          this.task.diffDate = 'Tomorrow'  
        }
        else if (this.task.date == moment().format('YYYY-MM-DD')) {
          this.task.diffDate = 'Today'  
        }
        else if (dateDiff.getDate() - 1 == 1) this.task.diffDate = 'Yesterday';
        else this.task.diffDate = 'This week';
      }
      else {
        if(this.task.date == moment(tomorrow).format('YYYY-MM-DD')) {
          this.task.diffDate = 'Tomorrow'  
        }
        else if (this.task.date == moment().format('YYYY-MM-DD')) {
          this.task.diffDate = 'Today'  
        }
        else if (dateDiff.getDate() - 1 == 1) this.task.diffDate = 'Yesterday';
        else this.task.diffDate = (dateDiff.getDate() - 1) + "D";
      }
    }

    else if (this.currentList == 'toDoNextWeek') {
      const today = new Date()
      let tomorrow =  new Date()
      tomorrow.setDate(today.getDate() + 1);
      if (thisWeekDaysList.includes(moment(this.task.date).format('YYYY-MM-DD'))) {
        if(this.task.date == moment(tomorrow).format('YYYY-MM-DD')) {
          this.task.diffDate = 'Tomorrow'  
        }
        else if (this.task.date == moment().format('YYYY-MM-DD')) {
          this.task.diffDate = 'Today'  
        }
        else if (dateDiff.getDate() - 1 == 1) this.task.diffDate = 'Yesterday';
        else this.task.diffDate = 'This week';
      }
      else {
        if(this.task.date == moment(tomorrow).format('YYYY-MM-DD')) {
          this.task.diffDate = 'Tomorrow'  
        }
        else if (this.task.date == moment().format('YYYY-MM-DD')) {
          this.task.diffDate = 'Today'  
        }
        else if (dateDiff.getDate() - 1 == 1) this.task.diffDate = 'Yesterday';
        else this.task.diffDate = (dateDiff.getDate() - 1) + "D";
      }
    }

    else if (this.currentList == 'toDoThisWeek') {
      const today = new Date()
      let tomorrow =  new Date()
      tomorrow.setDate(today.getDate() + 1);
      if(this.task.date == moment(tomorrow).format('YYYY-MM-DD')) {
        this.task.diffDate = 'Tomorrow'  
      }
      else if (this.task.date == moment().format('YYYY-MM-DD')) {
        this.task.diffDate = 'Today'  
      }
      else if (dateDiff.getDate() - 1 == 1) this.task.diffDate = 'Yesterday';
      else this.task.diffDate = (dateDiff.getDate() - 1) + "D";
    }

    else if (this.currentList == 'toDoTomorrow') {
      if (this.task.date == moment().format('YYYY-MM-DD')) this.task.diffDate = 'Today';
      else if (dateDiff.getDate() - 1 == 1)  this.task.diffDate = 'Yesterday';
      else this.task.diffDate = (dateDiff.getDate() - 1) + "D";
    }

    else {
      if (dateDiff.getDate() - 1 == 1) this.task.diffDate = 'Yesterday';
      else this.task.diffDate = (dateDiff.getDate() - 1) + "D";
    }

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
        if (rangeSelected === 'Today') {
          if(result.task.date !== moment().format('YYYY-MM-DD')) {
            result.task.date = moment().format('YYYY-MM-DD');
            this.inCorrectDate = false;
          }
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
          let curr = new Date 
          let thisWeekDaysList = [];

          for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i 
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            thisWeekDaysList.push(day)
          }

          if(thisWeekDaysList.includes(moment(result.task.date).format('YYYY-MM-DD'))) {
            this.inCorrectDate = false;
          }
          else {
            this.inCorrectDate = true;
            result.task.date = defaultTaskDate;
          }      
        }
        else if (rangeSelected === 'Next week') {
          let today = new Date();

          const dateCopy = new Date(today.getTime());

          const nextMonday = new Date(
            dateCopy.setDate(
              dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
            ),
          );

          let nextWeekDaysList = [];

          for (let i = 1; i <= 7; i++) {
            let nextWeekDays = nextMonday.getDate() - nextMonday.getDay() + i
            let day = moment(new Date().setDate(nextWeekDays)).format('YYYY-MM-DD').slice(0, 10)
            nextWeekDaysList.push(day)
          }

          if(nextWeekDaysList.includes(moment(result.task.date).format('YYYY-MM-DD'))) {
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

          let curr = new Date 
          let thisWeekDaysList = [];
          for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i 
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            thisWeekDaysList.push(day)
          }

          const dateCopy = new Date(new Date().getTime());
          const nextMonday = new Date(
            dateCopy.setDate(
              dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
            ),
          );
          let nextWeekDaysList = [];
          for (let i = 1; i <= 7; i++) {
            let nextWeekDays = nextMonday.getDate() - nextMonday.getDay() + i
            let day = moment(new Date().setDate(nextWeekDays)).format('YYYY-MM-DD').slice(0, 10)
            nextWeekDaysList.push(day)
          }
          
          if 
          (
            result.task.date < moment().format('YYYY-MM-DD') ||
            result.task.date == moment().format('YYYY-MM-DD') || 
            result.task.date == moment(tomorrow).format('YYYY-MM-DD') || 
            (thisWeekDaysList.includes(moment(result.task.date).format('YYYY-MM-DD'))) ||
            (nextWeekDaysList.includes(moment(result.task.date).format('YYYY-MM-DD')))
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
          result.task.orderNo = this.todayTaskList.length ? this.todayTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoToday').add(result.task);
          Swal.fire(
            'New task added successfully',
            '',
            'success'
          )
        } 
        else if (result.task.taskToDoIn == 'Tomorrow') {
          let previousTaskName = result.task.title;
          this.store.collection(this.currentList).doc(task.id).delete();
          const today = new Date()
          let tomorrow =  new Date()
          tomorrow.setDate(today.getDate() + 1);
          result.task.title = previousTaskName;
          result.task.date = moment(tomorrow).format('YYYY-MM-DD');
          result.task.orderNo = this.tomorrowTaskList.length ? this.tomorrowTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoTomorrow').add(result.task);
          Swal.fire(
            'New task added successfully',
            '',
            'success'
          )
        } 
        else if (result.task.taskToDoIn == 'This week') {
          let curr = new Date 
          let thisWeekDaysList = [];

          for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i 
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            thisWeekDaysList.push(day)
          }

          if(thisWeekDaysList.includes(moment(result.task.date).format('YYYY-MM-DD'))) {
            let previousTaskName = result.task.title;
            this.store.collection(this.currentList).doc(task.id).delete();
            result.task.title = previousTaskName;
            result.task.orderNo = this.thisWeekTaskList.length ? this.thisWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
            this.store.collection('toDoThisWeek').add(result.task);
            Swal.fire(
              'New task added successfully',
              '',
              'success'
            )
          }
          else {
            result.task.taskToDoIn = firstRange;
            result.task.date = defaultTaskDate;
            Swal.fire(
              'Choose correct date',
              '',
              'warning'
            ) 
          }      
        } 
        else if (result.task.taskToDoIn == 'Next week') {
          let today = new Date();

          const dateCopy = new Date(today.getTime());

          const nextMonday = new Date(
            dateCopy.setDate(
              dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
            ),
          );

          let nextWeekDaysList = [];

          for (let i = 1; i <= 7; i++) {
            let nextWeekDays = nextMonday.getDate() - nextMonday.getDay() + i
            let day = moment(new Date().setDate(nextWeekDays)).format('YYYY-MM-DD').slice(0, 10)
            nextWeekDaysList.push(day)
          }

          if(nextWeekDaysList.includes(moment(result.task.date).format('YYYY-MM-DD'))) {
            let previousTaskName = result.task.title;
            this.store.collection(this.currentList).doc(task.id).delete();
            result.task.title = previousTaskName;
            result.task.orderNo = this.nextWeekTaskList.length ? this.nextWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
            this.store.collection('toDoNextWeek').add(result.task);
            Swal.fire(
              'New task added successfully',
              '',
              'success'
            )
          }
          else {
            result.task.taskToDoIn = firstRange;
            result.task.date = defaultTaskDate;
            Swal.fire(
              'Choose correct date',
              '',
              'warning'
            )
          }      
        } 
        else {
          const today = new Date();
          let tomorrow =  new Date();
          tomorrow.setDate(today.getDate() + 1);

          let curr = new Date 
          let thisWeekDaysList = [];
          for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i 
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            thisWeekDaysList.push(day)
          }

          const dateCopy = new Date(new Date().getTime());
          const nextMonday = new Date(
            dateCopy.setDate(
              dateCopy.getDate() + ((7 - dateCopy.getDay() + 1) % 7 || 7),
            ),
          );
          let nextWeekDaysList = [];
          for (let i = 1; i <= 7; i++) {
            let nextWeekDays = nextMonday.getDate() - nextMonday.getDay() + i
            let day = moment(new Date().setDate(nextWeekDays)).format('YYYY-MM-DD').slice(0, 10)
            nextWeekDaysList.push(day)
          }
          
          if 
          (
            result.task.date == moment().format('YYYY-MM-DD') || 
            result.task.date == moment(tomorrow).format('YYYY-MM-DD') || 
            (thisWeekDaysList.includes(moment(result.task.date).format('YYYY-MM-DD'))) ||
            (nextWeekDaysList.includes(moment(result.task.date).format('YYYY-MM-DD')))
          ) {
            result.task.taskToDoIn = firstRange;
            result.task.date = defaultTaskDate;
            Swal.fire(
              'Choose correct date',
              '',
              'warning'
            )
          } 
          else {
            let previousTaskName = result.task.title;
            this.store.collection(this.currentList).doc(task.id).delete();
            result.task.title = previousTaskName;
            result.task.orderNo = this.laterTaskList.length ? this.laterTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
            this.store.collection('toDoLater').add(result.task);
            Swal.fire(
              'New task added successfully',
              '',
              'success'
            )
          }    
        }
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