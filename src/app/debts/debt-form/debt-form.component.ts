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
    if (debt.placeId == 5) {
      if (debt.toPayThisMonth == undefined) debt.toPayThisMonth = false;
      if (debt.toPayNextMonth == undefined) debt.toPayNextMonth = false;
      if (debt.notToPayForNow == undefined) debt.notToPayForNow = false;

      if (debt.toGetThisMonth == undefined) debt.toGetThisMonth = false;
      if (debt.toGetNextMonth == undefined) debt.toGetNextMonth = false;
      if (debt.notToGetForNow == undefined) debt.notToGetForNow = false;
    }
    

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

  checkAddRestMoney() {
    if (!this.debt.key) {
      if(this.debt.isRestMoney == true) {
        this.debt.restMoney = "";
        this.debt.placeId = null;
        this.debt.debtForPay = false;
        this.debt.debtToGet = false;
        this.debt.debtor = "-";
        this.debt.creditor = "-";
        this.debt.financialDebt = "-";
      }
    }
  }

  checkDebtForPay() {
    if (!this.debt.key) {
      if(this.debt.debtForPay == true) {
        this.debt.financialDebt = "";
        this.debt.restMoney = "";
        this.debt.creditor = "";
        this.debt.debtToGet = false;
        this.debt.isRestMoney = false;
        this.debt.debtor = "Fahmi";
        this.debt.restMoney = "-";
        this.debt.placeId = 5;
      }
    }
  }

  checkDebtToGet() {
    if (!this.debt.key) {
      if(this.debt.debtToGet == true) {
        this.debt.financialDebt = "";
        this.debt.restMoney = "";
        this.debt.debtor = "";
        this.debt.debtForPay = false;
        this.debt.isRestMoney = false;
        this.debt.creditor = "Fahmi";
        this.debt.restMoney = "-";
        this.debt.placeId = 5;
      }
    }
  }

  checkToPayThisMonth() {
    if(this.debt.toPayThisMonth == true) {
      this.debt.toPayNextMonth = false;
      this.debt.notToPayForNow = false;
    }
  }

  checkToPayNextMonth() {
    if(this.debt.toPayNextMonth == true) {
      this.debt.toPayThisMonth = false;
      this.debt.notToPayForNow = false;
    }
  }

  checkNotToPayForNow() {
    if(this.debt.notToPayForNow == true) {
      this.debt.toPayThisMonth = false;
      this.debt.toPayNextMonth = false;
    }
  }

  checkToGetThisMonth() {
    if(this.debt.toGetThisMonth == true) {
      this.debt.toGetNextMonth = false;
      this.debt.notToGetForNow = false;
    }
  }

  checkToGetNextMonth() {
    if(this.debt.toGetNextMonth == true) {
      this.debt.toGetThisMonth = false;
      this.debt.notToGetForNow = false;
    }
  }

  checkNotToGetForNow() {
    if(this.debt.notToGetForNow == true) {
      this.debt.toGetThisMonth = false;
      this.debt.toGetNextMonth = false;
    }
  }
}

export interface PlacesMoney {
  id: number,
  place: string
}

