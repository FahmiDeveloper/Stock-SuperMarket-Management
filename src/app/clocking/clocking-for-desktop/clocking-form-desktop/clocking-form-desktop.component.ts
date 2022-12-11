import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import * as moment from 'moment';
import Swal from 'sweetalert2';

import { ClockingService } from 'src/app/shared/services/clocking.service';

import { Clocking } from 'src/app/shared/models/clocking.model';

@Component({
  selector: 'clocking-form-desktop',
  templateUrl: './clocking-form-desktop.component.html',
  styleUrls: ['./clocking-form-desktop.component.scss']
})

export class ClockingFormDesktopComponent implements OnInit {

  arrayClockings: Clocking[];

  clocking: Clocking = new Clocking();
  
  formControl = new FormControl('', [Validators.required]);

  constructor(
    public clockingService: ClockingService, 
    public dialogRef: MatDialogRef<ClockingFormDesktopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Clocking
  ) {}

  ngOnInit() {
    if (!this.clocking.key) {
      this.clocking.dateClocking = moment().format('YYYY-MM-DD');
      this.clocking.timeClocking = moment().format('HH:mm');
    }
  }

  save() {
    if (this.clocking.key) {

      this.clockingService.update(this.clocking.key, this.clocking);

      Swal.fire(
        'Clocking data has been Updated successfully',
        '',
        'success'
      )

    } else {
      if (this.arrayClockings[0] && this.arrayClockings[0].numRefClocking) this.clocking.numRefClocking = this.arrayClockings[0].numRefClocking + 1;
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

}
