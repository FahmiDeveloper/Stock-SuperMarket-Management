import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';

import { ClockingFormDesktopComponent } from './clocking-form-desktop/clocking-form-desktop.component';

import { ClockingService } from 'src/app/shared/services/clocking.service';

import { Clocking, MonthsList } from 'src/app/shared/models/clocking.model';

@Component({
  selector: 'clocking-for-desktop',
  templateUrl: './clocking-for-desktop.component.html',
  styleUrls: ['./clocking-for-desktop.scss']
})

export class ClockingForDesktopComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Clocking>();
  dataSourceCopie = new MatTableDataSource<Clocking>();
  displayedColumns: string[] = ['date', 'day','time', 'clockingNbr', 'note'];

  clockingToDelete: Clocking = new Clocking();

  modalRefDeleteClocking: any;
  currentMonthAndYear: string;
  totalClockingLate: number = 0;
  minutePartList: number[] = [];
  sumClockingLate: number;
  totalClockingLateByHoursMinute: string = '';
  vacationLimitDays: number = 4.25;
  monthSelected: string = '';
  currentMonth: string = '';
  currentYear: number;
  currentMonthAndYearForVacation: string = '';

  subscriptionForGetAllClockings: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  
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
  
  constructor(
    public clockingService: ClockingService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    const d = new Date();
    this.currentYear = d.getFullYear();
    this.monthSelected = String(d.getMonth()+ 1);
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    this.currentMonthAndYearForVacation = months[d.getMonth()] + ' ' + d.getFullYear();
    this.getAllClockings();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllClockings() {
    this.subscriptionForGetAllClockings = this.clockingService
    .getAll()
    .subscribe((clockings: Clocking[]) => {

      this.dataSourceCopie.data = clockings.sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);

      this.currentMonth = this.monthsList.find(month => month.monthNbr == this.monthSelected).monthName;

      this.dataSource.data = clockings.filter(clocking => clocking.dateClocking.split('-')[1] == this.monthSelected).sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
        
      this.minutePartList = [];
      if (this.dataSource.data.length > 0) {
        this.dataSource.data.forEach(clocking => {
          if (clocking.timeClocking && clocking.timeClocking > '08:00') this.calculTotalClockingLate(clocking.timeClocking);
          this.getDayFromDateClocking(clocking);
        })
      } else {
        this.totalClockingLate = 0;
        this.totalClockingLateByHoursMinute = '0 Min';
      }   
    });
  }

  calculTotalClockingLate(timeClocking: string) {
    const composedFinancialDebt = timeClocking.split(':');
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
    dialogRef.componentInstance.arrayClockings = this.dataSourceCopie.data;
  }

  editClocking(clocking?: Clocking) {
    const dialogRef = this.dialogService.open(ClockingFormDesktopComponent, {width: '500px'});
    dialogRef.componentInstance.clocking = clocking;
  }

  openDeleteClockingModal(clocking: Clocking, contentDeleteClocking) {
    this.clockingToDelete = clocking;
    this.modalRefDeleteClocking =  this.dialogService.open(contentDeleteClocking, {
      width: '30vw',
      height:'35vh',
      maxWidth: '100vw'
    }); 
  }

  confirmDelete() {
    this.clockingService.delete(this.clockingToDelete.key);
  }

  close() {
    this.modalRefDeleteClocking.close();
  }

  ngOnDestroy() {
    this.subscriptionForGetAllClockings.unsubscribe();
  }

}
