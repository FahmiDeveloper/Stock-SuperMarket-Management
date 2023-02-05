import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

import { MedicationService } from 'src/app/shared/services/medication.service';
import { DiseaseService } from 'src/app/shared/services/disease.service';

import { Medication } from 'src/app/shared/models/medication.model';
import { Disease } from 'src/app/shared/models/disease.model';

@Component({
  selector: 'medication-form-desktop',
  templateUrl: './medication-form-desktop.component.html',
  styleUrls: ['./medication-form-desktop.scss']
})

export class MedicationFormDesktopComponent implements OnInit {

  arrayMedications: Medication[];
  arrayDiseases: Disease[];

  medication: Medication = new Medication();

  diseaseSelected: Disease = new Disease();

  basePath = '/PicturesMedications';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;
  
  formControl = new FormControl('', [Validators.required]);

  constructor(
    public medicationService: MedicationService,
    public diseaseService: DiseaseService,
    private fireStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<MedicationFormDesktopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Medication
  ) {}

  ngOnInit() {
    if (this.medication.key) this.diseaseSelected = this.arrayDiseases.find(disease => disease.id == this.medication.diseaseId);
  }

  save() {
    this.medication.diseaseId = this.diseaseSelected.id;
    this.medication.medicationFor = this.diseaseSelected.diseaseName;

    if (this.medication.key) {
      this.medicationService.update(this.medication.key, this.medication);

      Swal.fire(
        'Medication data has been updated successfully',
        '',
        'success'
      )

    } else {
      if (this.arrayMedications[0] && this.arrayMedications[0].numRefMedication) this.medication.numRefMedication = this.arrayMedications[0].numRefMedication + 1;
      else this.medication.numRefMedication = 1;

      // if (this.arrayDiseases[0] && this.arrayDiseases[0].id) this.disease.id = this.arrayDiseases[0].id + 1;
      // else this.disease.id = 1;

      this.medicationService.create(this.medication);

      Swal.fire(
      'New medication added successfully',
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
        this.medication.urlPicture = url;
        this.medication.fileName = file.name;
        Swal.fire(
          'Picture has been uploaded successfully',
          '',
          'success'
        )
      });  // <<< url is found here

    } else {  
      alert('No picture selected');
      this.medication.urlPicture = '';
    }
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :'';
  }

  close() {
    this.dialogRef.close();
  }

}
