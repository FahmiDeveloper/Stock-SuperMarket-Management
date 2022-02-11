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

  debt: Debt = new Debt();

  modalRef: any;

  constructor(
    private debtService: DebtService
  ) {}

  ngOnInit() {
    if (!this.debt.key) {
      this.debt.date = moment().format('YYYY-MM-DD');
      this.debt.time = moment().format('HH:mm');
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
}

