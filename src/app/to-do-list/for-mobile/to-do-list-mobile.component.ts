import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

import { BehaviorSubject, Observable } from 'rxjs';
import * as moment from 'moment';

import { TaskFormMobileComponent } from './task-form-mobile/task-form-mobile.component';

import { Task } from '../../shared/models/task.model';
import { RangeDays } from '../../shared/models/range-day';
import { TaskDialogResult } from 'src/app/shared/models/task-dialog-result';


const getObservable = (collection: AngularFirestoreCollection<Task>) => {
    const subject = new BehaviorSubject<Task[]>([]);
    collection.valueChanges({ idField: 'id' }).subscribe((val: Task[]) => {
      subject.next(val);
    });
    return subject;
};

@Component({
    selector: 'to-do-list-mobile',
    templateUrl: './to-do-list-mobile.component.html',
    styleUrls: ['./to-do-list-mobile.scss']
})

export class ToDoListForMobileComponent implements OnInit {

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

  rangeDays: RangeDays[] = [
    {id: 0, range: 'Today'},
    {id: 1, range: 'Tomorrow'},
    {id: 2, range: 'This week'},
    {id: 3, range: 'Next week'},
    {id: 4, range: 'Later'}
  ];
  
  rangeId: number = 0;

  constructor(
    private dialog: MatDialog,
    private store: AngularFirestore
  ){}

  ngOnInit(): void {
    this.loadTaskList();
  }

  loadTaskList() {
    this.toDoToday.subscribe(res => {
      this.todayTaskList = res;
      this.todayTaskListCopie = res;
      this.todayTaskList = this.todayTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo);
      this.todayTaskList.forEach((task, index) => {
          task.indexNo = index + 1;
      })
    })

    this.toDoTomorrow.subscribe(res => {
      this.tomorrowTaskList = res;
      this.tomorrowTaskListCopie = res;
      this.tomorrowTaskList = this.tomorrowTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo);
      this.tomorrowTaskList.forEach((task, index) => {
          task.indexNo = index + 1;
      })
    })

    this.toDoThisWeek.subscribe(res => {
      this.thisWeekTaskList = res;
      this.thisWeekTaskListCopie = res;
      this.thisWeekTaskList = this.thisWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo);
      this.thisWeekTaskList.forEach((task, index) => {
          task.indexNo = index + 1;
      })
    })

    this.toDoNextWeek.subscribe(res => {
      this.nextWeekTaskList = res;
      this.nextWeekTaskListCopie = res;
      this.nextWeekTaskList = this.nextWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo);
      this.nextWeekTaskList.forEach((task, index) => {
          task.indexNo = index + 1;
      })
    })

    this.toDoLater.subscribe(res => {
      this.laterTaskList = res;
      this.laterTaskListCopie = res;
      this.laterTaskList = this.laterTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo);
      this.laterTaskList.forEach((task, index) => {
          task.indexNo = index + 1;
      })
    })
  }

  editTask(list: 'toDoLater' | 'toDoNextWeek' | 'toDoThisWeek' | 'toDoToday' | 'toDoTomorrow', task: Task): void {
    let firstRange = task.taskToDoIn;
    
    const dialogRef = this.dialog.open(TaskFormMobileComponent, {
      width: '98vw',
      height:'60vh',
      maxWidth: '100vw',
      data: {
        task,
        enableDelete: true,
      },
    });

    dialogRef.afterClosed().subscribe((result: TaskDialogResult|undefined) => {
      if (!result) {
        return;
      }
      let rangeSelected = task.taskToDoIn;

      if (firstRange === rangeSelected) this.store.collection(list).doc(task.id).update(task);
      else {
        if (result.task.taskToDoIn == 'Today') {
          let previousTaskName = result.task.title;
          this.store.collection(list).doc(task.id).delete();
          result.task.title = previousTaskName;
          result.task.date = moment().format('YYYY-MM-DD');
          result.task.orderNo = this.todayTaskList.length ? this.todayTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoToday').add(result.task);
        } 
        else if (result.task.taskToDoIn == 'Tomorrow') {
          let previousTaskName = result.task.title;
          this.store.collection(list).doc(task.id).delete();
          const today = new Date()
          let tomorrow =  new Date()
          tomorrow.setDate(today.getDate() + 1);
          result.task.title = previousTaskName;
          result.task.date = moment(tomorrow).format('YYYY-MM-DD');
          result.task.orderNo = this.tomorrowTaskList.length ? this.tomorrowTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoTomorrow').add(result.task);
        } 
        else if (result.task.taskToDoIn == 'This week') {
          let previousTaskName = result.task.title;
          this.store.collection(list).doc(task.id).delete();
          result.task.title = previousTaskName;
          result.task.orderNo = this.thisWeekTaskList.length ? this.thisWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
        this.store.collection('toDoThisWeek').add(result.task);
        } else if (result.task.taskToDoIn == 'Next week') {
          let previousTaskName = result.task.title;
          this.store.collection(list).doc(task.id).delete();
          result.task.title = previousTaskName;
          result.task.orderNo = this.nextWeekTaskList.length ? this.nextWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoNextWeek').add(result.task);
        } else {
          let previousTaskName = result.task.title;
          this.store.collection(list).doc(task.id).delete();
          result.task.title = previousTaskName;
          result.task.orderNo = this.laterTaskList.length ? this.laterTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoLater').add(result.task);
        }
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
    
    // else {
    //   const item = event.previousContainer.data[event.previousIndex];

    //   this.store.firestore.runTransaction(() => {
    //     if (event.container.id == 'toDoToday') {
    //       item.date = moment().format('YYYY-MM-DD');
    //       item.taskToDoIn = 'Today';
    //       item.orderNo = this.todayTaskList.length ? this.todayTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
    //     } 
    //     else if (event.container.id == 'toDoTomorrow') {
    //       const today = new Date()
    //       let tomorrow =  new Date()
    //       tomorrow.setDate(today.getDate() + 1);
    //       item.date = moment(tomorrow).format('YYYY-MM-DD');
    //       item.taskToDoIn = 'Tomorrow';
    //       item.orderNo = this.tomorrowTaskList.length ? this.tomorrowTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
    //     }
    //     else if (event.container.id == 'toDoThisWeek') {
    //       item.taskToDoIn = 'This week';
    //       item.orderNo = this.thisWeekTaskList.length ? this.thisWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
    //     }
    //     else {
    //       item.taskToDoIn = 'Next week';
    //       item.orderNo = this.nextWeekTaskList.length ? this.nextWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
    //     }
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

    const dialogRef = this.dialog.open(TaskFormMobileComponent, {
      width: '98vw',
      height:'60vh',
      maxWidth: '100vw',
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

        if (result.task.taskToDoIn == 'Today') {
          result.task.date = moment().format('YYYY-MM-DD');
          result.task.orderNo = this.todayTaskList.length ? this.todayTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoToday').add(result.task);
        }
        else if (result.task.taskToDoIn == 'Tomorrow') {
          const today = new Date()
          let tomorrow =  new Date()
          tomorrow.setDate(today.getDate() + 1);
          result.task.date = moment(tomorrow).format('YYYY-MM-DD');
          result.task.orderNo = this.tomorrowTaskList.length ? this.tomorrowTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoTomorrow').add(result.task);
        } 
        else if (result.task.taskToDoIn == 'This week') {
          result.task.orderNo = this.thisWeekTaskList.length ? this.thisWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoThisWeek').add(result.task);
        } 
        else if (result.task.taskToDoIn == 'Next week') {
          result.task.orderNo = this.nextWeekTaskList.length ? this.nextWeekTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoNextWeek').add(result.task);
        }
        else {
          result.task.orderNo = this.laterTaskList.length ? this.laterTaskList.sort((n1, n2) => n2.orderNo - n1.orderNo)[0].orderNo + 1 : 1;
          this.store.collection('toDoLater').add(result.task);
        }
    });

  }

  searchByTask() {

    this.todayTaskList = [];
    this.tomorrowTaskList = [];
    this.thisWeekTaskList = [];
    this.nextWeekTaskList = [];
    this.laterTaskList = [];

    this.todayTaskList = this.todayTaskName ? this.todayTaskListCopie.filter(task => task.title.toLowerCase().includes(this.todayTaskName.toLowerCase())) : this.todayTaskListCopie;

    this.tomorrowTaskList = this.tomorrowTaskName ? this.tomorrowTaskListCopie.filter(task => task.title.toLowerCase().includes(this.tomorrowTaskName.toLowerCase())) : this.tomorrowTaskListCopie;

    this.thisWeekTaskList = this.thisWeekTaskName ? this.thisWeekTaskListCopie.filter(task => task.title.toLowerCase().includes(this.thisWeekTaskName.toLowerCase())) : this.thisWeekTaskListCopie;

    this.nextWeekTaskList = this.nextWeekTaskName ? this.nextWeekTaskListCopie.filter(task => task.title.toLowerCase().includes(this.nextWeekTaskName.toLowerCase())) : this.nextWeekTaskListCopie;

    this.laterTaskList = this.laterTaskName ? this.laterTaskListCopie.filter(task => task.title.toLowerCase().includes(this.laterTaskName.toLowerCase())) : this.laterTaskListCopie;

  }

}