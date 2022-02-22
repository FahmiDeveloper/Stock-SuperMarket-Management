import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { DebtFormComponent } from './debt-form/debt-form.component';

import { AuthService } from '../shared/services/auth.service';
import { DebtService } from '../shared/services/debt.service';
import { UserService } from '../shared/services/user.service';

import { Debt } from '../shared/models/debt.model';
import { FirebaseUserModel } from '../shared/models/user.model';

@Component({
  selector: 'app-debts',
  templateUrl: './debts.component.html',
  styleUrls: ['./debts.component.scss']
})

export class DebtsComponent implements OnInit, OnDestroy {

  debts: Debt[];
  filteredDebts: Debt[];
  filteredDebtsCopie: Debt[];

  p: number = 1;
  queryDate: string = "";
  restInPocket: string = "";
  restInWallet: string = "";
  restInEnvelope: string = "";
  restInBox: string = "";
  restInPosteAccount: string = "";
  outDebt: number;
  inDebt: number;

  user: FirebaseUserModel = new FirebaseUserModel();

  subscriptionForGetAllDebts: Subscription;
  subscriptionForUser: Subscription;

  placeId: number;

  placesMoney: PlacesMoney[] = [
    {id: 1, place: 'الجيب'},
    {id: 2, place: 'المحفظة'},
    {id: 3, place: 'الظرف'}, 
    {id: 4, place: 'الصندوق'},
    {id: 5, place: 'لا يوجد'},
    {id: 6, place: 'الحساب البريدي'}
  ];

  constructor(
    private debtService: DebtService, 
    public userService: UserService,
    public authService: AuthService,
    protected modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getAllDebts();
    this.getRolesUser();
  }

  getAllDebts() {
    this.subscriptionForGetAllDebts = this.debtService
      .getAll()
      .subscribe(debts => {
        this.filteredDebtsCopie = debts;
        if (this.queryDate) {
          this.filteredDebts = debts.filter(debt => debt.date.includes(this.queryDate));
        } else if (this.placeId) {
          this.filteredDebts = debts.filter(debt => debt.placeId == this.placeId);
          if (this.placeId == 5) {
            this.getDebts();
          }
          if (this.placeId == 6) {
            this.getRestInPosteAccount();
          }
        } else this.filteredDebts = debts;
        this.getRestMoneyForeachPlace();
    });
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

  delete(debtId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this debt!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.debtService.delete(debtId);
        Swal.fire(
          'Debt has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  clear() {
    this.queryDate = "";
    this.placeId = null;
    this.p = 1;
    this.getAllDebts();
  }

  newDebt() {
    const modalRef = this.modalService.open(DebtFormComponent as Component, { centered: true });

    modalRef.componentInstance.modalRef = modalRef;
  }

  editDebt(debt?: Debt) {
    const modalRef = this.modalService.open(DebtFormComponent as Component, { centered: true });

    modalRef.componentInstance.modalRef = modalRef;
    modalRef.componentInstance.debt = debt;
  }

  getRestMoneyForeachPlace() {
    this.restInPocket = this.filteredDebtsCopie.filter(debt => debt.placeId == 1).sort(
      (n1, n2) => n2.numRow - n1.numRow)[0].restMoney;

    this.restInWallet = this.filteredDebtsCopie.filter(debt => debt.placeId == 2).sort(
      (n1, n2) => n2.numRow - n1.numRow)[0].restMoney;

    this.restInEnvelope = this.filteredDebtsCopie.filter(debt => debt.placeId == 3).sort(
      (n1, n2) => n2.numRow - n1.numRow)[0].restMoney;

    this.restInBox = this.filteredDebtsCopie.filter(debt => debt.placeId == 4).sort(
      (n1, n2) => n2.numRow - n1.numRow)[0].restMoney;
  }

  getDebts() {
    this.outDebt = 0;
    this.inDebt = 0;

    this.filteredDebtsCopie.filter(debt => debt.creditor == "Fahmi").forEach(element => {
      this.outDebt += Number(element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT")));
    });

    this.filteredDebtsCopie.filter(debt => debt.debtor == "Fahmi").forEach(element => {
      this.inDebt += Number(element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT")));
    });  
  }

  getRestInPosteAccount() {
    this.restInPosteAccount = this.filteredDebtsCopie.filter(debt => debt.placeId == 6).sort(
      (n1, n2) => n2.numRow - n1.numRow)[0].restMoney;
  }

  ngOnDestroy() {
    this.subscriptionForGetAllDebts.unsubscribe();
    this.subscriptionForUser.unsubscribe();
  }
}

export interface PlacesMoney {
  id: number,
  place: string
}
