import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { NewOrEditDebtComponent } from './new-or-edit-debt/new-or-edit-debt.component';

import { AuthService } from 'src/app/shared/services/auth.service';
import { DebtService } from 'src/app/shared/services/debt.service';
import { UserService } from 'src/app/shared/services/user.service';

import { Debt } from 'src/app/shared/models/debt.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-debts-for-grid',
  templateUrl: './debts-for-grid.component.html',
  styleUrls: ['./debts-for-grid.component.scss']
})

export class DebtsForGridComponent implements OnInit, OnDestroy {

  debts: Debt[];
  filteredDebts: Debt[];
  filteredDebtsCopie: Debt[];
  detailsInDebt: Debt[];
  detailsOutDebt: Debt[];

  p: number = 1;
  // queryDate: string = "";
  restInPocket: string = "";
  restInWallet: string = "";
  restInEnvelope: string = "";
  restInBox: string = "";
  restInPosteAccount: string = "";
  queryNote: string = "";
  modalRefSearch: any;
  placeId: number;
  outDebt: number;
  inDebt: number;

  modalRefRestMoneyForeachPlace: any;
  modalRefDebt: any;
  modalRefDetInDebt: any;
  modalRefDetOutDebt: any;

  user: FirebaseUserModel = new FirebaseUserModel();

  subscriptionForGetAllDebts: Subscription;
  subscriptionForUser: Subscription;

  placesMoney: PlacesMoney[] = [
    {id: 1, place: 'الجيب'},
    {id: 2, place: 'المحفظة'},
    {id: 3, place: 'الظرف'}, 
    {id: 4, place: 'الصندوق'},
    {id: 5, place: 'دين'},
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
      // if (this.queryDate) {
      //   this.filteredDebts = debts.filter(debt => debt.date.includes(this.queryDate));
      // } else 
      if (this.queryNote) 
      this.filteredDebts = debts.filter(debt => debt.note.toLowerCase().includes(this.queryNote.toLowerCase()));
      else if (this.placeId) {
        this.filteredDebts = debts.filter(debt => debt.placeId == this.placeId);
        if (this.placeId == 5) this.getDebts();
        else this.getRestMoneyForeachPlace();
      } else this.filteredDebts = debts;
      if (this.queryNote || this.placeId) this.modalRefSearch.close();
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
    // this.queryDate = "";
    this.queryNote = "";
    this.placeId = null;
    this.getAllDebts();
    this.modalRefSearch.close();
  }

  newDebt() {
    const modalRef = this.modalService.open(NewOrEditDebtComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
  }

  editDebt(debt?: Debt) {
    const modalRef = this.modalService.open(NewOrEditDebtComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
    modalRef.componentInstance.debt = debt;
  }

  openModalSearch(contentModalSearch) {
    this.modalRefSearch = this.modalService.open(contentModalSearch as Component, { size: 'lg', centered: true });
  }

  openModalRestMoneyForeachPlace(contentRestMoneyForeachPlace) {
    this.modalRefRestMoneyForeachPlace = this.modalService.open(contentRestMoneyForeachPlace as Component, { size: 'lg', centered: true });
    this.getRestMoneyForeachPlace();
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

    this.restInPosteAccount = this.filteredDebtsCopie.filter(debt => debt.placeId == 6).sort(
      (n1, n2) => n2.numRow - n1.numRow)[0].restMoney;
  }

  openModalDebt(contentDebt) {
    this.modalRefDebt = this.modalService.open(contentDebt as Component, { size: 'lg', centered: true });
    this.getDebts();
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

  showDetInDebt(contentDetInDebt) {
    this.modalRefDetInDebt = this.modalService.open(contentDetInDebt as Component, { size: 'lg', centered: true });
    this.getDetDebts();
  }

  showDetOutDebt(contentDetOutDebt) {
    this.modalRefDetOutDebt = this.modalService.open(contentDetOutDebt as Component, { size: 'lg', centered: true });
    this.getDetDebts();
  }

  getDetDebts() {
    this.detailsInDebt = this.filteredDebtsCopie.filter(debt => debt.debtor == "Fahmi");
    this.detailsOutDebt = this.filteredDebtsCopie.filter(debt => debt.creditor == "Fahmi");
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
