import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Debt } from 'src/app/shared/models/debt.model';
import { DebtService } from 'src/app/shared/services/debt.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-debt-form',
  templateUrl: './debt-form.component.html',
  styleUrls: ['./debt-form.component.scss']
})

export class DebtFormComponent implements OnInit {

  modalRef: any;

  debt: Debt = new Debt();

  placesMoney: PlacesMoney[] = [
    {id: 1, place: 'الجيب'},
    {id: 2, place: 'المحفظة'},
    {id: 3, place: 'الظرف'}, 
    {id: 4, place: 'الصندوق'},
    {id: 5, place: 'دين'},
    {id: 6, place: 'الحساب البريدي'}
  ];

  constructor(private debtService: DebtService) {}

  ngOnInit() {
    if (!this.debt.key) {
      this.debt.date = moment().format('YYYY-MM-DD');
      this.generateNumRow();
    }
  }

  save(debt) {
    if (this.debt.key) {
      this.debtService.update(this.debt.key, debt);
      Swal.fire(
        'Debt data has been Updated successfully',
        '',
        'success'
      )
    } else {
      this.debtService.create(debt);
      Swal.fire(
      'New Debt added successfully',
      '',
      'success'
      )
    }
    this.modalRef.close();
  }

  generateNumRow(){
    this.debtService
      .getAll()
      .subscribe((debts: Debt[]) => {
          if (debts.length > 0) {
            for (let i = 0; i < debts.length; i++) {
              if(debts[i].numRow) {
                this.debt.numRow = debts[i].numRow + 1;
              }
            }      
        } 
    });
  }
}

export interface PlacesMoney {
  id: number,
  place: string
}

