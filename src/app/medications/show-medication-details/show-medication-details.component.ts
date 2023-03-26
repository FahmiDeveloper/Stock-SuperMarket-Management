import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { expandCollapse } from './show-medication-details.component.animations';

import { Medication } from 'src/app/shared/models/medication.model';

@Component({
  selector: 'show-medication-details',
  templateUrl: './show-medication-details.component.html',
  styleUrls: ['./show-medication-details.component.scss'],
  animations: [ expandCollapse ]
})
export class ShowMedicationDetailsComponent {

  @Input('medication') medication: Medication;
  isExpanded: boolean;

  constructor(private snackBar: MatSnackBar) {}

  toggle(){
    this.isExpanded = !this.isExpanded;
  }

  copyText(text: string, event: Event){
    event.stopPropagation();
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

}