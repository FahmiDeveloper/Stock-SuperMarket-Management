import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { ClockingFormMobileComponent } from './clocking-form-mobile/clocking-form-mobile.component';

import { ClockingService } from 'src/app/shared/services/clocking.service';

import { Clocking, MonthsList, SubjectList } from 'src/app/shared/models/clocking.model';

@Component({
  selector: 'clockings-for-mobile',
  templateUrl: './clockings-for-mobile.component.html',
  styleUrls: ['./clockings-for-mobile.component.scss']
})

export class ClockingsForMobileComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Clocking>();
  dataSourceCopieForNewClocking = new MatTableDataSource<Clocking>();
  dataSourceCopieForCalculTotalClockingLate = new MatTableDataSource<Clocking>();
  displayedColumns: string[] = ['date', 'day', 'time', 'clockingNbr', 'note', 'star'];

  allClockings: Clocking[]= [];

  currentMonthAndYear: string;
  totalClockingLate: number = 0;
  minutePartList: number[] = [];
  sumClockingLate: number;
  totalClockingLateByHoursMinute: string = '';
  vacationLimitDays: number = 0;
  monthSelected: string = '';
  currentMonth: string = '';
  currentYear: number;
  currentMonthAndYearForVacation: string = '';
  subjectSelectedId: number;
  showVacationLimitDays: boolean = false;
  isLoading: boolean;
  showDeleteAllClockingsButtton: boolean;

  modalRefLodaing: any

  subscriptionForGetAllClockings: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  
  monthsList: MonthsList[] = [
    { monthNbr: '06', monthName: 'June'},
    { monthNbr: '07', monthName: 'July'},
    { monthNbr: '08', monthName: 'August'},
    { monthNbr: '09', monthName: 'September'},
    { monthNbr: '10', monthName: 'October'},
    { monthNbr: '11', monthName: 'November'},
    { monthNbr: '12', monthName: 'December'},
    { monthNbr: '01', monthName: 'January'},
    { monthNbr: '02', monthName: 'February'},
    { monthNbr: '03', monthName: 'March'},
    { monthNbr: '04', monthName: 'April'},
    { monthNbr: '05', monthName: 'May'}
  ];

  subjectList: SubjectList[] = [
    {id: 1, subjectName: 'Work on sunday'},
    {id: 2, subjectName: 'Take vacation'},
    {id: 3, subjectName: 'Take one hour'},
    {id: 4, subjectName: 'Work half day'} ,
    {id: 5, subjectName: 'Days Clocking late'}  
  ];

  constructor(
    public clockingService: ClockingService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    const d = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    this.currentMonthAndYearForVacation = months[d.getMonth()] + ' ' + d.getFullYear();
    if ((months[d.getMonth()] == 'October') || (months[d.getMonth()] == 'November') || (months[d.getMonth()] == 'December')) {this.monthSelected = String(d.getMonth()+ 1);}
    else {this.monthSelected = '0' + String(d.getMonth()+ 1);}
    this.getAllClockings();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllClockings() {
    this.subscriptionForGetAllClockings = this.clockingService
    .getAll()
    .subscribe((clockings: Clocking[]) => {

      this.allClockings = clockings;

      this.dataSourceCopieForNewClocking.data = clockings.sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);

      this.dataSourceCopieForCalculTotalClockingLate.data = clockings
      .filter(clocking => clocking.dateClocking.split('-')[1] == this.monthSelected)
      .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);

      this.currentMonth = this.monthsList.find(month => month.monthNbr == this.monthSelected).monthName;

      if (this.subjectSelectedId == 1) {
        this.dataSource.data = clockings
        .filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected) && (clocking.workOnSunday == true))
        .sort((n1, n2) => n1.numRefClocking - n2.numRefClocking);
      }
      else if (this.subjectSelectedId == 2) {
        this.dataSource.data = clockings
        .filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected) && (clocking.takeVacation == true))
        .sort((n1, n2) => n1.numRefClocking - n2.numRefClocking);
      }
      else if (this.subjectSelectedId == 3) {
        this.dataSource.data = clockings
        .filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected) && (clocking.takeOneHour == true))
        .sort((n1, n2) => n1.numRefClocking - n2.numRefClocking);
      }
      else if (this.subjectSelectedId == 4) {
        this.dataSource.data = clockings
        .filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected) && (clocking.workHalfDay == true))
        .sort((n1, n2) => n1.numRefClocking - n2.numRefClocking);
      }
      else if (this.subjectSelectedId == 5) {
        this.dataSource.data = clockings
        .filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected && clocking.timeClocking && clocking.timeClocking > '08:00' ))
        .sort((n1, n2) => n1.numRefClocking - n2.numRefClocking);
      }
      else {
        this.dataSource.data = 
        clockings.filter(clocking => clocking.dateClocking.split('-')[1] == this.monthSelected)
        .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      }

      if (this.monthSelected == '05' && new Date(this.dataSource.data[0].dateClocking).getDate() == 31) {
        this.showDeleteAllClockingsButtton = true;
      }
      else {
        this.showDeleteAllClockingsButtton = false;
      }

      if ((this.monthSelected == String(new Date().getMonth()+ 1)) || (this.monthSelected == '0' + String(new Date().getMonth()+ 1))) {
        this.showVacationLimitDays = true;
        let lastClockingByCurrentMonth = clockings
        .filter(clocking => clocking.dateClocking.split('-')[1] == this.monthSelected)
        .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking)[0];
        if (lastClockingByCurrentMonth) this.vacationLimitDays = lastClockingByCurrentMonth.restVacationDays;
      } 
      else {this.showVacationLimitDays = false;}
   
      this.minutePartList = [];
      if (this.dataSourceCopieForCalculTotalClockingLate.data.length > 0) {
        this.dataSourceCopieForCalculTotalClockingLate.data.forEach(clocking => {
            this.calculTotalClockingLate(clocking.timeClocking);
        })
      } else {
        this.totalClockingLate = 0;
        this.totalClockingLateByHoursMinute = '0 Min';
      }
      
      if (this.dataSource.data.length > 0) {
        this.dataSource.data.forEach(clocking => {
          this.getDayFromDateClocking(clocking);
        })
      }

    });
  }

  OnPageChange(event: PageEvent){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  calculTotalClockingLate(timeClocking: string) {
    let composedFinancialDebt: string[] = [];
    if (timeClocking && timeClocking > '08:00') {
      composedFinancialDebt = timeClocking.split(':');
    } else {
      composedFinancialDebt[1] = '0';
    }  
    this.minutePartList.push(Number(composedFinancialDebt[1]))
    this.sumClockingLate = this.minutePartList.reduce((accumulator, current) => {return accumulator + current;}, 0);
    if (this.sumClockingLate < 60) {this.totalClockingLate = this.sumClockingLate;}
    else {
      let hours = Math.floor(this.sumClockingLate / 60);
      let minutes = this.sumClockingLate - (hours * 60);
      this.totalClockingLateByHoursMinute = hours +"H "+ minutes +"Min";
    }
  }

  getDayFromDateClocking(clocking: Clocking) {
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

    const d = new Date(clocking.dateClocking);
    clocking.day = weekday[d.getDay()];
    this.currentYear = d.getFullYear();
  }

  newClocking() {
    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      width: '98vw',
      maxWidth: '100vw'
    }
    const dialogRef = this.dialogService.open(ClockingFormMobileComponent, config);

    dialogRef.componentInstance.arrayClockings = this.dataSourceCopieForNewClocking.data;
    dialogRef.componentInstance.vacationLimitDays = this.vacationLimitDays;
    dialogRef.componentInstance.currentMonthAndYearForVacation = this.currentMonthAndYearForVacation;
    dialogRef.componentInstance.monthSelected = this.monthSelected
  }

  editClocking(clocking?: Clocking) {
    let config: MatDialogConfig = {
      panelClass: "dialog-responsive",
      width: '98vw',
      maxWidth: '100vw'
    }
    const dialogRef = this.dialogService.open(ClockingFormMobileComponent, config);

    dialogRef.componentInstance.clocking = clocking;
    dialogRef.componentInstance.vacationLimitDays = this.vacationLimitDays;
    dialogRef.componentInstance.currentMonthAndYearForVacation = this.currentMonthAndYearForVacation;
    dialogRef.componentInstance.monthSelected = this.monthSelected;
    dialogRef.componentInstance.dataSource = this.dataSource.data;

    dialogRef.afterClosed().subscribe(res => {
      this.dataSource.data = res;
    });
  }

  deleteClocking(clockingKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this clocking!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.clockingService.delete(clockingKey);
        Swal.fire(
          'Clocking has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  deleteAllClockings(contentLoading) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete all clockings!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.modalRefLodaing = this.dialogService.open(contentLoading, {
          width: '20vw',
          height:'20vw',
          maxWidth: '100vw'
        });
        this.isLoading = true;

        this.allClockings.forEach(clocking => {
          this.clockingService.delete(clocking.key);
        });

        setTimeout(() => {
          this.isLoading = false;
          this.modalRefLodaing.close();

          Swal.fire(
            'Clockings has been deleted successfully',
            '',
            'success'
          ).then((res) => {})
        }, 20000);
      }
    })
  }

  ngOnDestroy() {
    this.subscriptionForGetAllClockings.unsubscribe();
  }

}