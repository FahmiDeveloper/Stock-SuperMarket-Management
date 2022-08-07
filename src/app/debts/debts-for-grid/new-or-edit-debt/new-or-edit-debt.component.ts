import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import * as moment from 'moment';
import Swal from 'sweetalert2';

import { DebtService } from 'src/app/shared/services/debt.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Debt } from 'src/app/shared/models/debt.model';

@Component({
  selector: 'new-or-edit-debt',
  templateUrl: './new-or-edit-debt.component.html',
  styleUrls: ['./new-or-edit-debt.scss']
})

export class NewOrEditDebtComponent implements OnInit, OnDestroy {

  debt: Debt = new Debt();
  arrayDebts: Debt[];
  selectUnitForRestMoney:string;
  selectUnitForFinancialDebt:string;
  subscriptionForGetAllDebts: Subscription;
  subscriptionForUser: Subscription;

  modalRef: any;

  placesMoney: PlacesMoney[] = [
    {id: 1, place: 'الجيب'},
    {id: 2, place: 'المحفظة'},
    {id: 3, place: 'الظرف'}, 
    {id: 4, place: 'الصندوق'},
    {id: 5, place: 'دين'},
    {id: 6, place: 'الحساب البريدي'}
  ];

  units: Unit[] = [
    {unitName: ''},
    {unitName: 'DT'},
    {unitName: 'DT.'},
    {unitName: 'Mill'}
  ];

  filteredDebts: Debt[];
  debtId: string;
  user: FirebaseUserModel = new FirebaseUserModel();


  constructor(
    private debtService: DebtService,
    public userService: UserService,
    public authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.debtId = this.route.snapshot.paramMap.get('id');
    this.getDebtData();
    this.getRolesUser();
  }

  getDebtData() {
    if (this.debtId) {
      this.debtService
        .getDebtId(this.debtId)
        .valueChanges()
        .pipe(take(1))
        .subscribe(debt => {
          this.debt = debt;
        });
    } else {
      this.debt.date = moment().format('YYYY-MM-DD');

      this.subscriptionForGetAllDebts = this.debtService
      .getAll()
      .subscribe(debts => {
        this.filteredDebts = debts;
      });
    }
  }

  getRolesUser() {
    this.subscriptionForUser = this.authService
      .isConnected
      .subscribe(res=>{
        if(res) {
          this.userService
          .getCurrentUser()
          .then(user=>{
            if(user) {
              this.userService
                .get(user.uid)
                .valueChanges()
                .subscribe(dataUser=>{
                  this.user = dataUser;
                });
              }
          });   
        }
    })
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

    if (this.debtId) {
      this.debtService.update(this.debtId, debt);
      Swal.fire(
        'Debt data has been Updated successfully',
        '',
        'success'
      )
    } else {
      if (this.filteredDebts.sort((n1, n2) => n2.numRefDebt - n1.numRefDebt)[0].numRefDebt) debt.numRefDebt = this.filteredDebts[0].numRefDebt + 1;
      this.debtService.create(debt);
      Swal.fire(
      'New Debt added successfully',
      '',
      'success'
      )
    }
    this.router.navigate(['/debts-for-grid']);  
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

  onSelectUnitForRestMoney(unitName:string) {
    this.debt.restMoney = this.debt.restMoney + unitName;
  }

  onSelectUnitForFinancialDebt(unitName:string) {
    this.debt.financialDebt = this.debt.financialDebt + unitName;
  }

  deleteDebt() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this debt!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.debtService.delete(this.debtId);
        this.router.navigate(['/debts-for-grid']);
        Swal.fire(
          'Debt has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  cancel() {
    this.router.navigate(['/debts-for-grid']);
  }

  ngOnDestroy() {
    this.subscriptionForUser.unsubscribe();
    if (!this.debtId) this.subscriptionForGetAllDebts.unsubscribe();
  }
}

export interface PlacesMoney {
  id: number,
  place: string
}

export interface Unit {
  unitName: string
}