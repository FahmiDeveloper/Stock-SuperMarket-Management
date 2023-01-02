import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import * as moment from 'moment';
import Swal from 'sweetalert2';

import { ClockingService } from 'src/app/shared/services/clocking.service';

import { Clocking, SubjectList } from 'src/app/shared/models/clocking.model';

@Component({
  selector: 'clocking-form-mobile',
  templateUrl: './clocking-form-mobile.component.html',
  styleUrls: ['./clocking-form-mobile.scss']
})

export class ClockingFormMobileComponent implements OnInit {

  arrayClockings: Clocking[];

  clocking: Clocking = new Clocking();

  selectedSubjectId: number;
  vacationLimitDays: number;
  currentMonthAndYearForVacation: string;
  monthSelected: string ;
  showVacationLimitDays: boolean;
  
  formControl = new FormControl('', [Validators.required]);

  subjectList: SubjectList[] = [
    {id: 1, subjectName: 'Work on sunday'},
    {id: 2, subjectName: 'Take vacation'},
    {id: 3, subjectName: 'Take one hour'} ,
    {id: 4, subjectName: 'Work half day'}  
  ];

  constructor(
    public clockingService: ClockingService, 
    public dialogRef: MatDialogRef<ClockingFormMobileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Clocking
  ) {}

  ngOnInit() {
    if (!this.clocking.key) {
      this.clocking.dateClocking = moment().format('YYYY-MM-DD');
      this.clocking.timeClocking = moment().format('HH:mm');
    }
    if (this.clocking.key) {
      if (this.clocking.workOnSunday == true) this.selectedSubjectId = 1;
      else if (this.clocking.takeVacation == true) this.selectedSubjectId = 2;
      else if (this.clocking.takeOneHour == true) this.selectedSubjectId = 3;
      else if (this.clocking.workHalfDay == true) this.selectedSubjectId = 4;
      else this.selectedSubjectId = null;
    }
    if (this.monthSelected == String(new Date().getMonth()+ 1)  || (this.monthSelected == '0' + String(new Date().getMonth()+ 1))) {this.showVacationLimitDays = true;} 
    else {this.showVacationLimitDays = false;}
  }

  save() {
    if (this.clocking.workOnSunday == undefined && this.clocking.takeVacation == undefined && this.clocking.takeOneHour == undefined && this.clocking.workHalfDay == undefined) {
      this.clocking.workOnSunday = false;
      this.clocking.takeVacation = false;
      this.clocking.takeOneHour = false;
      this.clocking.workHalfDay = false;
    } 
    if (this.selectedSubjectId == 1) {
      this.clocking.workOnSunday = true;
      this.clocking.takeVacation = false;
      this.clocking.takeOneHour = false;
      this.clocking.workHalfDay = false;
    }
    if (this.selectedSubjectId == 2) {
      this.clocking.workOnSunday = false;
      this.clocking.takeVacation = true;
      this.clocking.takeOneHour = false;
      this.clocking.workHalfDay = false;
    }
    if (this.selectedSubjectId == 3) {
      this.clocking.workOnSunday = false;
      this.clocking.takeVacation = false;
      this.clocking.takeOneHour = true;
      this.clocking.workHalfDay = false;
    }
    if (this.selectedSubjectId == 4) {
      this.clocking.workOnSunday = false;
      this.clocking.takeVacation = false;
      this.clocking.takeOneHour = false;
      this.clocking.workHalfDay = true;
    }

    this.clocking.restVacationDays = this.vacationLimitDays;

    if (this.clocking.key) {

      this.clockingService.update(this.clocking.key, this.clocking);

      Swal.fire(
        'Clocking data has been Updated successfully',
        '',
        'success'
      )

    } else {
      if (this.arrayClockings[0].numRefClocking) this.clocking.numRefClocking = this.arrayClockings[0].numRefClocking + 1;
      else this.clocking.numRefClocking = 1;

      this.clockingService.create(this.clocking);

      Swal.fire(
      'New clocking added successfully',
      '',
      'success'
      )

    }
    this.close();
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :'';
  }

  close() {
    this.dialogRef.close();
  }

  selectSubject() {
    this.vacationLimitDays = (this.selectedSubjectId == 2) ? this.vacationLimitDays - 1 : this.vacationLimitDays;
  }

}
