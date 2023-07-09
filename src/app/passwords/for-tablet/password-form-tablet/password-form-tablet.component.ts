import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

import { PasswordService } from 'src/app/shared/services/password.service';

import { Password } from 'src/app/shared/models/password.model';

@Component({
  selector: 'password-form-tablet',
  templateUrl: './password-form-tablet.component.html',
  styleUrls: ['./password-form-tablet.scss']
})

export class PasswordFormTabletComponent implements OnInit {

  arrayPasswords: Password[];

  password: Password = new Password();

  basePath = '/PicturesPasswords';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  formControl = new FormControl('', [Validators.required]);

  constructor(
    public passwordService: PasswordService,
    private fireStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<PasswordFormTabletComponent>
  ) {}

  ngOnInit() {}

  save() {
    if (this.password.key) {

      this.passwordService.update(this.password.key, this.password);

      Swal.fire(
        'Password data has been updated successfully',
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

  async onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
      const filePath = `${this.basePath}/${file.name}`;  // path at which image will be stored in the firebase storage
      this.task =  this.fireStorage.upload(filePath, file);    // upload task

      // this.progress = this.snapTask.percentageChanges();
      this.progressValue = this.task.percentageChanges();

      (await this.task).ref.getDownloadURL().then(url => {
        this.password.imageUrl = url;
        Swal.fire(
          'Picture has been uploaded successfully',
          '',
          'success'
        )
      });  // <<< url is found here

    } else {  
      alert('No images selected');
      this.password.imageUrl = '';
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :'';
  }

  close() {
    this.dialogRef.close();
  }

}