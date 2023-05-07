import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import * as fileSaver from 'file-saver';

import { MedicationFormDesktopComponent } from './medication-form-desktop/medication-form-desktop.component';

import { MedicationService } from 'src/app/shared/services/medication.service';
import { DiseaseService } from 'src/app/shared/services/disease.service';

import { Medication } from 'src/app/shared/models/medication.model';
import { Disease } from 'src/app/shared/models/disease.model';

@Component({
  selector: 'medications-for-desktop',
  templateUrl: './medications-for-desktop.component.html',
  styleUrls: ['./medications-for-desktop.scss']
})

export class MedicationsForDesktopComponent implements OnInit, OnDestroy {

  medicationsList: Medication[] = [];
  medicationsListCopieForNewMedication: Medication[] = [];
  diseaseList: Disease[] = [];

  p: number = 1;

  isDesktop: boolean;
  isTablet: boolean;
  diseaseSelectedId: number;
  pictureFile: string = '';
  FileName: string = '';
  medicationName: string = '';

  subscriptionForGetAllMedications: Subscription;
  subscriptionForGetAllDiseases: Subscription;
    
  constructor(
    public diseaseService: DiseaseService,
    public medicationService: MedicationService,
    public dialogService: MatDialog,
    private deviceService: DeviceDetectorService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();

    this.getAllMedications();
    this.getAllDiseases();
  }

  getAllMedications() {
    this.subscriptionForGetAllMedications = this.medicationService
    .getAll()
    .subscribe((medications: Medication[]) => {

      this.medicationsListCopieForNewMedication = medications.sort((n1, n2) => n2.numRefMedication - n1.numRefMedication);

      if (this.medicationName) {
        this.medicationsList = medications
        .filter(medication => medication.medicationName.toLowerCase().includes(this.medicationName.toLowerCase()))
        .sort((n1, n2) => n2.numRefMedication - n1.numRefMedication);
      }
      else if (this.diseaseSelectedId) {
        this.medicationsList = medications
        .filter(medication => medication.diseaseId == this.diseaseSelectedId)
        .sort((n1, n2) => n2.numRefMedication - n1.numRefMedication);
      }
      else {
        this.medicationsList = medications.sort((n1, n2) => n2.numRefMedication - n1.numRefMedication)
      }

    });
  }

  getAllDiseases() {
    this.subscriptionForGetAllDiseases = this.diseaseService
    .getAll()
    .subscribe((diseases: Disease[]) => {
      this.diseaseList = diseases.sort((n1, n2) => n2.id - n1.id);
    });
  }

  OnPageChange(event: PageEvent){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  newMedication() {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(MedicationFormDesktopComponent, config);

    dialogRef.componentInstance.arrayMedications = this.medicationsListCopieForNewMedication;
    dialogRef.componentInstance.arrayDiseases = this.diseaseList;
  }

  editMedication(medication?: Medication) {
    let config: MatDialogConfig = {panelClass: "dialog-responsive"}
    const dialogRef = this.dialogService.open(MedicationFormDesktopComponent, config);
    
    dialogRef.componentInstance.medication = medication;
    dialogRef.componentInstance.arrayDiseases = this.diseaseList;
  }

  deleteMedication(medicationKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this medication!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.medicationService.delete(medicationKey);
        Swal.fire(
          'Medication has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  viewPicture(medication: Medication, showPicture) {
    this.pictureFile = medication.urlPicture;
    this.FileName = medication.fileName.substring(0, medication.fileName.lastIndexOf("."));

    if (this.isTablet) {
      this.dialogService.open(showPicture, {
        height: '80%',
        width: '100%'
      });
    } else {
      this.dialogService.open(showPicture, {
        width: '40vw',
        height:'85vh',
        maxWidth: '100vw'
      });
    }   
  }

  downloadPicture(medication: Medication) {
    fetch(medication.urlPicture)
    .then(res => res.blob()) // Gets the response and returns it as a blob
    .then(blob => {
      fileSaver.saveAs(blob, medication.fileName.substring(0, medication.fileName.lastIndexOf(".")));
    });
  }

  checkIsImage(urlFile: string): boolean {
    let imageExtentions = ['.jpeg', '.jpg', '.png', '.gif']; // Array of image extention
    if (urlFile.includes(imageExtentions[0]) || urlFile.includes(imageExtentions[1]) || urlFile.includes(imageExtentions[2]) || urlFile.includes(imageExtentions[3]))
    return true;
    else return false;
  }

  copyText(text: string){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = text;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.showSnackbarTopPosition();
  }

  showSnackbarTopPosition() {
    this.snackBar.open('Text copied', 'Done', {
      duration: 2000,
      verticalPosition: "bottom", // Allowed values are  'top' | 'bottom'
      horizontalPosition: "center" // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

  viewUtilisation(utilisation: string) {
    Swal.fire({
      text: utilisation,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Close'
    });
  }

  ngOnDestroy() {
    this.subscriptionForGetAllMedications.unsubscribe();
  }

}