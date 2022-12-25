import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { PasswordService } from 'src/app/shared/services/password.service';

import { Password } from 'src/app/shared/models/password.model';

@Component({
  selector: 'password-form-mobile',
  templateUrl: './password-form-mobile.component.html',
  styleUrls: ['./password-form-mobile.scss']
})

export class PasswordFormMobileComponent implements OnInit {

  arrayPasswords: Password[];

  password: Password = new Password();

  formControl = new FormControl('', [Validators.required]);

  constructor(
    public passwordService: PasswordService, 
    public dialogRef: MatDialogRef<PasswordFormMobileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Password
  ) {}

  ngOnInit() {}

  save() {
    if (this.password.key) {

      this.passwordService.update(this.password.key, this.password);

      Swal.fire(
        'Password data has been Updated successfully',
        '',
        'success'
      )

    } else {
      if (this.arrayPasswords[0] && this.arrayPasswords[0].numRefPassword) this.password.numRefPassword = this.arrayPasswords[0].numRefPassword + 1;
      else this.password.numRefPassword = 1;

      this.passwordService.create(this.password);

      Swal.fire(
      'New password added successfully',
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
