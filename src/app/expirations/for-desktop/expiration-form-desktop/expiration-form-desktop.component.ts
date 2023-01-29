import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import * as moment from 'moment';
import Swal from 'sweetalert2';

import { ExpirationService } from 'src/app/shared/services/expiration.service';

import { Expiration } from 'src/app/shared/models/expiration.model';
import { Unit } from 'src/app/shared/models/debt.model';

@Component({
  selector: 'expiration-form-desktop',
  templateUrl: './expiration-form-desktop.component.html',
  styleUrls: ['./expiration-form-desktop.scss']
})

export class ExpirationFormDesktopComponent implements OnInit {

  arrayExpirations: Expiration[];

  expiration: Expiration = new Expiration();

  selectedUnit:string = '';
  
  formControl = new FormControl('', [Validators.required]);

  units: Unit[] = [
    {unitName: ''},
    {unitName: 'DT'},
    {unitName: 'DT.'},
    {unitName: 'Mill'}
  ];

  constructor(
    public expirationService: ExpirationService, 
    public dialogRef: MatDialogRef<ExpirationFormDesktopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Expiration
  ) {}

  ngOnInit() {
    if (!this.expiration.key) {
      this.expiration.dateStart = moment().format('YYYY-MM-DD');
    }
  }

  save() {
    if (this.expiration.key) {

      this.expirationService.update(this.expiration.key, this.expiration);

      Swal.fire(
        'Expiration data has been updated successfully',
        '',
        'success'
      )

    } else {
      if (this.arrayExpirations[0] && this.arrayExpirations[0].numRefExpiration) this.expiration.numRefExpiration = this.arrayExpirations[0].numRefExpiration + 1;
      else this.expiration.numRefExpiration = 1;

      this.expirationService.create(this.expiration);

      Swal.fire(
      'New expiration added successfully',
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

  onSelectUnit() {
   this.expiration.cost = this.expiration.cost + this.selectedUnit;
  }

}
