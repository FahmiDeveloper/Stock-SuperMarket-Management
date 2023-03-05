import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';
import Swal from 'sweetalert2';

import { TaskFormDesktopComponent } from './task-form-desktop/task-form-desktop.component';

import { Task } from '../../shared/models/task.model';
import { RangeDays } from '../../shared/models/range-day';
import { TaskDialogResult } from '../../shared/models/task-dialog-result';

const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject<Task[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'to-do-list-desktop',
  templateUrl: './to-do-list-desktop.component.html',
  styleUrls: ['./to-do-list-desktop.scss']
})

export class ToDoListForDesktopComponent implements OnInit {

  toDoToday = getObservable(this.store.collection('toDoToday')) as Observable<Task[]>;
  toDoTomorrow = getObservable(this.store.collection('toDoTomorrow')) as Observable<Task[]>;
  toDoThisWeek = getObservable(this.store.collection('toDoThisWeek')) as Observable<Task[]>;
  toDoNextWeek = getObservable(this.store.collection('toDoNextWeek')) as Observable<Task[]>;
  toDoLater = getObservable(this.store.collection('toDoLater')) as Observable<Task[]>;

  todayTaskList: Task[] = [];
  todayTaskListCopie: Task[] = [];
  todayTaskName: string = '';

  tomorrowTaskList: Task[] = [];
  tomorrowTaskListCopie: Task[] = [];
  tomorrowTaskName: string = '';

  thisWeekTaskList: Task[] = [];
  thisWeekTaskListCopie: Task[] = [];
  thisWeekTaskName: string = '';

  nextWeekTaskList: Task[] = [];
  nextWeekTaskListCopie: Task[] = [];
  nextWeekTaskName: string = '';

  laterTaskList: Task[] = [];
  laterTaskListCopie: Task[] = [];
  laterTaskName: string = '';

  rangeId: number = 0;

  rangeDays: RangeDays[] = [
    {id: 0, range: 'Today'},
    {id: 1, range: 'Tomorrow'},
    {id: 2, range: 'This week'},
    {id: 3, range: 'Next week'},
    {id: 4, range: 'Later'}
  ];

  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore
  ){}

  ngOnInit() {
    this.loadTaskList();
  }

  loadTaskList() {
    this.toDoToday.subscribe(res => {
      this.todayTaskList = res;
      this.todayTaskListCopie = res;
      this.todayTaskList = this.todayTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })

    this.toDoTomorrow.subscribe(res => {
      this.tomorrowTaskList = res;
      this.tomorrowTaskListCopie = res;
      this.tomorrowTaskList = this.tomorrowTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })

    this.toDoThisWeek.subscribe(res => {
      this.thisWeekTaskList = res;
      this.thisWeekTaskListCopie = res;
      this.thisWeekTaskList = this.thisWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })

    this.toDoNextWeek.subscribe(res => {
      this.nextWeekTaskList = res;
      this.nextWeekTaskListCopie = res;
      this.nextWeekTaskList = this.nextWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })

    this.toDoLater.subscribe(res => {
      this.laterTaskList = res;
      this.laterTaskListCopie = res;
      this.laterTaskList = this.laterTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo);
    })
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
         // from bas to haut
        for (var i = event.currentIndex + 1; i <= event.previousIndex; i++) {
          currentTask.orderNo -= 1;
          previousTask.orderNo += 1;

          this.store.collection(event.container.id).doc(currentTask.id).update(currentTask);
          this.store.collection(event.container.id).doc(previousTask.id).update(previousTask);
        }
    }

      if (event.currentIndex > event.previousIndex) {
        // from haut to bas
        for (var i = event.previousIndex; i < event.currentIndex; i++) {
          currentTask.orderNo += 1;
          previousTask.orderNo -= 1;

          this.store.collection(event.container.id).doc(currentTask.id).update(currentTask);
          this.store.collection(event.container.id).doc(previousTask.id).update(previousTask);
        }
      }
     
    } 

  }

  newTask(): void {

    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      data: {
        task: {},
      }
    }
    const dialogRef = this.dialog.open(TaskFormDesktopComponent, config);

    dialogRef
      .afterClosed()
      .subscribe((result: TaskDialogResult|undefined) => {
        if (!result) {
          return;
        }

        if (result.task.taskToDoIn == 'Today') {
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
          const today = new Date();
          let tomorrow =  new Date();
          tomorrow.setDate(today.getDate() + 1);
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
          let thisWeekDays = [];

          for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i 
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            thisWeekDays.push(day)
          }

          if(thisWeekDays.includes(moment(result.task.date).format('YYYY-MM-DD'))) {
            result.task.orderNo = this.thisWeekTaskList.length ? this.thisWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
            this.store.collection('toDoThisWeek').add(result.task);
            Swal.fire(
              'New task added successfully',
              '',
              'success'
            )
          }
          else {
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
            result.task.orderNo = this.nextWeekTaskList.length ? this.nextWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
            this.store.collection('toDoNextWeek').add(result.task);
            Swal.fire(
              'New task added successfully',
              '',
              'success'
            )
          }
          else {
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
          let thisWeekDays = [];
          for (let i = 1; i <= 7; i++) {
            let first = curr.getDate() - curr.getDay() + i 
            let day = new Date(curr.setDate(first)).toISOString().slice(0, 10)
            thisWeekDays.push(day)
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
          
          if (
            result.task.date == moment().format('YYYY-MM-DD') || 
            result.task.date == moment(tomorrow).format('YYYY-MM-DD') || 
            (thisWeekDays.includes(moment(result.task.date).format('YYYY-MM-DD'))) ||
            (nextWeekDaysList.includes(moment(result.task.date).format('YYYY-MM-DD')))
          ) {
            Swal.fire(
              'Choose correct date',
              '',
              'warning'
            )
          } else {
            result.task.orderNo = this.laterTaskList.length ? this.laterTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
            this.store.collection('toDoLater').add(result.task);
            Swal.fire(
              'New task added successfully',
              '',
              'success'
            )
          }     
        }      
    });
  }

  searchByTask() {

    this.todayTaskList = [];
    this.tomorrowTaskList = [];
    this.thisWeekTaskList = [];
    this.nextWeekTaskList = [];
    this.laterTaskList = [];

    this.todayTaskList = this.todayTaskName ? this.todayTaskListCopie
    .filter(task => task.title.toLowerCase().includes(this.todayTaskName.toLowerCase())) : this.todayTaskListCopie;

    this.tomorrowTaskList = this.tomorrowTaskName ? this.tomorrowTaskListCopie
    .filter(task => task.title.toLowerCase().includes(this.tomorrowTaskName.toLowerCase())) : this.tomorrowTaskListCopie;

    this.thisWeekTaskList = this.thisWeekTaskName ? this.thisWeekTaskListCopie
    .filter(task => task.title.toLowerCase().includes(this.thisWeekTaskName.toLowerCase())) : this.thisWeekTaskListCopie;

    this.nextWeekTaskList = this.nextWeekTaskName ? this.nextWeekTaskListCopie
    .filter(task => task.title.toLowerCase().includes(this.nextWeekTaskName.toLowerCase())) : this.nextWeekTaskListCopie;

    this.laterTaskList = this.laterTaskName ? this.laterTaskListCopie
    .filter(task => task.title.toLowerCase().includes(this.laterTaskName.toLowerCase())) : this.laterTaskListCopie;

  }

}