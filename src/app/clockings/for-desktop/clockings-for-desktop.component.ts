import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { ClockingFormDesktopComponent } from './clocking-form-desktop/clocking-form-desktop.component';

import { ClockingService } from 'src/app/shared/services/clocking.service';

import { Clocking, MonthsList, SubjectList } from 'src/app/shared/models/clocking.model';

@Component({
  selector: 'clockings-for-desktop',
  templateUrl: './clockings-for-desktop.component.html',
  styleUrls: ['./clockings-for-desktop.scss']
})

export class ClockingsForDesktopComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Clocking>();
  dataSourceCopieForNewClocking = new MatTableDataSource<Clocking>();
  dataSourceCopieForCalculTotalClockingLate = new MatTableDataSource<Clocking>();
  displayedColumns: string[] = ['date', 'day','time', 'clockingNbr', 'note', 'star'];

  clockingsList: Clocking[] = [];
  pagedList: Clocking[]= [];
  length: number = 0;

  isDesktop: boolean;
  isTablet: boolean;
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
  showVacationLimitDays: boolean;

  subscriptionForGetAllClockings: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;
  
  contextMenuPosition = { x: '0px', y: '0px' };

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
    {id: 4, subjectName: 'Work half day'}   
  ];
  
  constructor(
    public clockingService: ClockingService,
    public dialogService: MatDialog,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();
    const d = new Date();
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    this.currentMonthAndYearForVacation = months[d.getMonth()] + ' ' + d.getFullYear();
    if ((months[d.getMonth()] == 'October') || (months[d.getMonth()] == 'November') || (months[d.getMonth()] == 'December')) {this.monthSelected = String(d.getMonth()+ 1);}
    else {this.monthSelected = '0' + String(d.getMonth()+ 1);}

    if (this.isDesktop) {this.getAllClockingsForDesktop();}
    else {this.getAllClockingsForTablet();} 
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllClockingsForDesktop() {
    this.subscriptionForGetAllClockings = this.clockingService
    .getAll()
    .subscribe((clockings: Clocking[]) => {

      this.dataSourceCopieForNewClocking.data = clockings.sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);

      this.dataSourceCopieForCalculTotalClockingLate.data = clockings.filter(clocking => clocking.dateClocking.split('-')[1] == this.monthSelected).sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      this.currentMonth = this.monthsList.find(month => month.monthNbr == this.monthSelected).monthName;


      if (this.subjectSelectedId == 1) {
        this.dataSource.data = 
        clockings.filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected) && (clocking.workOnSunday == true))
        .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      }
      else if (this.subjectSelectedId == 2) {
        this.dataSource.data = 
        clockings.filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected) && (clocking.takeVacation == true))
        .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      }
      else if (this.subjectSelectedId == 3) {
        this.dataSource.data = 
        clockings.filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected) && (clocking.takeOneHour == true))
        .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      }
      else if (this.subjectSelectedId == 4) {
        this.dataSource.data = 
        clockings.filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected) && (clocking.workHalfDay == true))
        .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      }
      else {
        this.dataSource.data = 
        clockings.filter(clocking => clocking.dateClocking.split('-')[1] == this.monthSelected)
        .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      }

      if ((this.monthSelected == String(new Date().getMonth()+ 1)) || (this.monthSelected == '0' + String(new Date().getMonth()+ 1))) {
        this.showVacationLimitDays = true;
        let lastClockingByCurrentMonth = clockings.filter(clocking => clocking.dateClocking.split('-')[1] == this.monthSelected).sort((n1, n2) => n2.numRefClocking - n1.numRefClocking)[0];
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

  getAllClockingsForTablet() {
    this.subscriptionForGetAllClockings = this.clockingService
    .getAll()
    .subscribe((clockings: Clocking[]) => {

      this.dataSourceCopieForNewClocking.data = clockings.sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);

      this.dataSourceCopieForCalculTotalClockingLate.data = clockings.filter(clocking => clocking.dateClocking.split('-')[1] == this.monthSelected).sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      this.currentMonth = this.monthsList.find(month => month.monthNbr == this.monthSelected).monthName;


      if (this.subjectSelectedId == 1) {
        this.clockingsList = 
        clockings.filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected) && (clocking.workOnSunday == true))
        .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      }
      else if (this.subjectSelectedId == 2) {
        this.clockingsList = 
        clockings.filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected) && (clocking.takeVacation == true))
        .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      }
      else if (this.subjectSelectedId == 3) {
        this.clockingsList = 
        clockings.filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected) && (clocking.takeOneHour == true))
        .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      }
      else if (this.subjectSelectedId == 4) {
        this.clockingsList = 
        clockings.filter(clocking => (clocking.dateClocking.split('-')[1] == this.monthSelected) && (clocking.workHalfDay == true))
        .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      }
      else {
        this.clockingsList = 
        clockings.filter(clocking => clocking.dateClocking.split('-')[1] == this.monthSelected)
        .sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
      }

      this.pagedList = this.clockingsList.slice(0, 6);
      this.length = this.clockingsList.length;

      if ((this.monthSelected == String(new Date().getMonth()+ 1)) || (this.monthSelected == '0' + String(new Date().getMonth()+ 1))) {
        this.showVacationLimitDays = true;
        let lastClockingByCurrentMonth = clockings.filter(clocking => clocking.dateClocking.split('-')[1] == this.monthSelected).sort((n1, n2) => n2.numRefClocking - n1.numRefClocking)[0];
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
      
      if (this.clockingsList.length > 0) {
        this.clockingsList.forEach(clocking => {
          this.getDayFromDateClocking(clocking);
        })
      }

    });
  }

  OnPageChange(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedList = this.clockingsList.slice(startIndex, endIndex);
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

  onContextMenu(event: MouseEvent, clocking: Clocking) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'clocking': clocking };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }

  newClocking() {
    const dialogRef = this.dialogService.open(ClockingFormDesktopComponent, {width: '500px', data: {movie: {}}});
    dialogRef.componentInstance.arrayClockings = this.dataSourceCopieForNewClocking.data;
    dialogRef.componentInstance.vacationLimitDays = this.vacationLimitDays;
    dialogRef.componentInstance.currentMonthAndYearForVacation = this.currentMonthAndYearForVacation;
    dialogRef.componentInstance.monthSelected = this.monthSelected
  }

  editClocking(clocking?: Clocking) {
    const dialogRef = this.dialogService.open(ClockingFormDesktopComponent, {width: '500px'});
    dialogRef.componentInstance.clocking = clocking;
    dialogRef.componentInstance.vacationLimitDays = this.vacationLimitDays;
    dialogRef.componentInstance.currentMonthAndYearForVacation = this.currentMonthAndYearForVacation;
    dialogRef.componentInstance.monthSelected = this.monthSelected
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

  viewNote(clockingNote: string) {
    Swal.fire({
      text: clockingNote,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Close'
    });
  }

  ngOnDestroy() {
    this.subscriptionForGetAllClockings.unsubscribe();
  }

}
