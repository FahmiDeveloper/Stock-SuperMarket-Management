import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';

import Swal from 'sweetalert2';
import { Observable } from 'rxjs';

import { MedicationService } from 'src/app/shared/services/medication.service';
import { DiseaseService } from 'src/app/shared/services/disease.service';

import { Medication, Unit } from 'src/app/shared/models/medication.model';
import { Disease } from 'src/app/shared/models/disease.model';

@Component({
  selector: 'medication-form-mobile',
  templateUrl: './medication-form-mobile.component.html',
  styleUrls: ['./medication-form-mobile.scss']
})

export class MedicationFormMobileComponent implements OnInit {

  arrayMedications: Medication[];
  pagedList: Medication[];
  arrayDiseases: Disease[];


  medication: Medication = new Medication();
  diseaseSelected: Disease = new Disease();

  selectedUnit:string;

  basePath = '/PicturesMedications';
  task: AngularFireUploadTask;
  progressValue: Observable<number>;
  
  formControl = new FormControl('', [Validators.required]);

  units: Unit[] = [
    {unitName: ''},
    {unitName: 'DT'},
    {unitName: 'DT.'},
    {unitName: 'Mill'}
  ];

  constructor(
    public medicationService: MedicationService,
    public diseaseService: DiseaseService,
    private fireStorage: AngularFireStorage,
    public dialogRef: MatDialogRef<MedicationFormMobileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Medication[]
  ) {}

  ngOnInit() {
    this.data = this.pagedList;

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
    this.dialogRef.close(this.data);
  }

  newDisease() {
    Swal.fire({
      title: 'New disease',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        let disease: Disease = new Disease();
        disease.id = (this.arrayDiseases[0] && this.arrayDiseases[0].id) ? this.arrayDiseases[0].id + 1 : 1;
        disease.diseaseName = result.value;

        this.arrayDiseases.push(disease);

        this.arrayDiseases = this.arrayDiseases.sort((n1, n2) => n2.id - n1.id);

        this.diseaseSelected = disease;

        this.diseaseService.create(disease);

        Swal.fire(
          'New disease added successfully',
          '',
          'success'
        )
      }
    })
  }

  editDisease(diseaseSelected: Disease) {
    Swal.fire({
      title: 'Edit disease',
      input: 'text',
      inputValue: diseaseSelected.diseaseName,
      showCancelButton: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        diseaseSelected.diseaseName = result.value;

        this.diseaseService.update(diseaseSelected.key, diseaseSelected);
        
        Swal.fire(
          'Disease data has been updated successfully',
          '',
          'success'
        )
      }
    })
  }

  deleteDisease(diseaseKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this disease!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.diseaseService.delete(diseaseKey);
        this.arrayDiseases.forEach((disease, index) => {
          if(disease.key === diseaseKey) this.arrayDiseases.splice(index,1);
        });
        Swal.fire(
          'Disease has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  onSelectUnit() {
    if (this.medication.price) this.medication.price = this.medication.price + this.selectedUnit;
  }

}