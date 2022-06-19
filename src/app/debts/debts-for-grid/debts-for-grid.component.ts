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
  detailInDebt: Debt;
  detailOutDebt: Debt;

  p: number = 1;
  pageDetsInDebt: number = 1;
  pageDetsOutDebt: number = 1;

  // queryDate: string = "";
  restInPocket: string = "";
  restInWallet: string = "";
  restInEnvelope: string = "";
  restInBox: string = "";
  restInPosteAccount: string = "";
  queryNote: string = "";
  modalRefSearch: any;
  placeId: number;
  totalOutDebts: number;
  totalInDebts: number;
  totalOutDebtsInModal: number;
  totalInDebtsInModal: number;

  toPayThisMonth: boolean = true;
  toPayNextMonth: boolean = false;
  notToPay: boolean = false;
  checkToPayThisMonth: boolean = false;
  checkToPayNextMonth: boolean = false;
  checkNotToPay: boolean = false;

  toGetThisMonth: boolean = true;
  toGetNextMonth: boolean = false;
  notToGet: boolean = false;
  checkToGetThisMonth: boolean = false;
  checkToGetNextMonth: boolean = false;
  checkNotToGet: boolean = false;

  modalRefRestMoneyForeachPlace: any;
  modalRefDebt: any;
  modalRefDetInDebt: any;
  modalRefDetOutDebt: any;
  modalRefChangeStatusInDebt: any;
  modalRefChangeStatusOutDebt: any;

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
        if (this.placeId == 5) {
          this.getTotalIntDebts();
          this.getTotalOutDebts();
        }
        else this.getRestMoneyForeachPlace();
      } else this.filteredDebts = debts;
      this.getPlaceDebt();
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
    this.getTotalIntDebts();
    this.getTotalOutDebts();
  }

  getTotalOutDebts() {
    this.totalOutDebts = 0;
    this.filteredDebtsCopie.filter(debt => debt.creditor == "Fahmi").forEach(element => {
      this.totalOutDebts += Number(element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT")));
    });
  }

  getTotalIntDebts() {
    this.totalInDebts = 0;
    this.filteredDebtsCopie.filter(debt => debt.debtor == "Fahmi").forEach(element => {
      this.totalInDebts += Number(element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT")));
    });  
  }

  showDetInDebt(contentDetInDebt) {
    this.modalRefDetInDebt = this.modalService.open(contentDetInDebt as Component, { size: 'lg', centered: true });
    this.payThisMonth();
  }

  showDetOutDebt(contentDetOutDebt) {
    this.modalRefDetOutDebt = this.modalService.open(contentDetOutDebt as Component, { size: 'lg', centered: true });
    this.getThisMonth();
  }

  payThisMonth() {
    this.totalInDebtsInModal = 0;

    if (this.toPayThisMonth) {
      this.toPayNextMonth= false;
      this.notToPay = false;
      this.detailsInDebt = this.filteredDebtsCopie.filter(debt => (debt.debtor == "Fahmi") && (debt.toPayThisMonth == true));
    }
    this.detailsInDebt.forEach(element => {
      this.totalInDebtsInModal += Number(element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT")));
    });
  }

  payNextMonth() {
    this.totalInDebtsInModal = 0;

    if (this.toPayNextMonth) {
      this.toPayThisMonth = false;
      this.notToPay = false;
      this.detailsInDebt = this.filteredDebtsCopie.filter(debt => (debt.debtor == "Fahmi") && (debt.toPayNextMonth == true));
    }
    this.detailsInDebt.forEach(element => {
      this.totalInDebtsInModal += Number(element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT")));
    });
  }

  notToBePay() {
    this.totalInDebtsInModal = 0;

    if (this.notToPay) {
      this.toPayThisMonth = false;
      this.toPayNextMonth= false;
      this.detailsInDebt = this.filteredDebtsCopie.filter(debt => (debt.debtor == "Fahmi") && (debt.notToPayForNow == true));
    }
    this.detailsInDebt.forEach(element => {
      this.totalInDebtsInModal += Number(element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT")));
    });
  }

  getThisMonth() {
    this.totalOutDebtsInModal = 0;

    if (this.toGetThisMonth) {
      this.toGetNextMonth = false;
      this.notToGet= false;
      this.detailsOutDebt = this.filteredDebtsCopie.filter(debt => (debt.creditor == "Fahmi") && (debt.toGetThisMonth == true));
    }
    this.detailsOutDebt.forEach(element => {
      this.totalOutDebtsInModal += Number(element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT")));
    });
  }

  getNextMonth() {
    this.totalOutDebtsInModal = 0;

    if (this.toGetNextMonth) {
      this.toGetThisMonth = false;
      this.notToGet= false;
      this.detailsOutDebt = this.filteredDebtsCopie.filter(debt => (debt.creditor == "Fahmi") && (debt.toGetNextMonth == true));
    }
    this.detailsOutDebt.forEach(element => {
      this.totalOutDebtsInModal += Number(element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT")));
    });
  }

  notToBeGet() {
    this.totalOutDebtsInModal = 0;

    if (this.notToGet) {
      this.toGetThisMonth = false;
      this.toGetNextMonth = false;
      this.detailsOutDebt = this.filteredDebtsCopie.filter(debt => (debt.creditor == "Fahmi") && (debt.notToGetForNow == true));
    }
    this.detailsOutDebt.forEach(element => {
      this.totalOutDebtsInModal += Number(element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT")));
    });
  }

  getPlaceDebt() {
    this.filteredDebts.forEach(element=>{
      this.placesMoney.forEach(placeMoney => {
        if (placeMoney.id == element.placeId) {
          element.place = placeMoney.place;
        }
      })
    })
  }

  deleteFromModalInDebts(debtId) {
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
        ).then((res) => {
          if (res.value) {
            this.getTotalIntDebts();
            if (this.toPayThisMonth) this.payThisMonth();
            else if (this.toPayNextMonth) this.payNextMonth();
            else this.notToBePay()
          }
        })
      }
    })
  }

  deleteFromModalOutDebts(debtId) {
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
        ).then((res) => {
          if (res.value) {
            this.getTotalOutDebts();
            if (this.toGetThisMonth) this.getThisMonth();
            else if (this.toGetNextMonth) this.getNextMonth();
            else this.notToBeGet()
          }
        })
      }
    })
  }

  openModalChangeStatusInDebt(contentChangeStatusInDebt, detailInDebt: Debt) {
    this.detailInDebt = detailInDebt;
    this.checkToPayThisMonth = false;
    this.checkToPayNextMonth = false;
    this.checkNotToPay = false;
    this.modalRefChangeStatusInDebt = this.modalService.open(contentChangeStatusInDebt as Component, { windowClass : "statusInDebtModalClass", centered: true});
  }

  changeStatusToPayThisMonth() {
    if (this.checkToPayThisMonth) {
      this.detailInDebt.toPayThisMonth = true;
      this.detailInDebt.toPayNextMonth = false;
      this.detailInDebt.notToPayForNow = false;
    }

    this.debtService.update(this.detailInDebt.key, this.detailInDebt);
    Swal.fire(
      'Status changed successfully' ,
      '',
      'success'
    ).then((res) => {
      if (res.value) {
        this.getTotalIntDebts();
        if (this.toPayThisMonth) this.payThisMonth();
        else if (this.toPayNextMonth) this.payNextMonth();
        else this.notToBePay();
        this.modalRefChangeStatusInDebt.close();
      }
    })
  }

  changeStatusToPayNextMonth() {
  if (this.checkToPayNextMonth) {
      this.detailInDebt.toPayNextMonth = true;
      this.detailInDebt.toPayThisMonth = false;
      this.detailInDebt.notToPayForNow = false;
    }

    this.debtService.update(this.detailInDebt.key, this.detailInDebt);
    Swal.fire(
      'Status changed successfully' ,
      '',
      'success'
    ).then((res) => {
      if (res.value) {
        this.getTotalIntDebts();
        if (this.toPayThisMonth) this.payThisMonth();
        else if (this.toPayNextMonth) this.payNextMonth();
        else this.notToBePay();
        this.modalRefChangeStatusInDebt.close();
      }
    })
  }

  changeStatusNotToPayForNow() {
    if (this.checkNotToPay) {
      this.detailInDebt.notToPayForNow = true;
      this.detailInDebt.toPayThisMonth = false;
      this.detailInDebt.toPayNextMonth = false;
    }

    this.debtService.update(this.detailInDebt.key, this.detailInDebt);
    Swal.fire(
      'Status changed successfully' ,
      '',
      'success'
    ).then((res) => {
      if (res.value) {
        this.getTotalIntDebts();
        if (this.toPayThisMonth) this.payThisMonth();
        else if (this.toPayNextMonth) this.payNextMonth();
        else this.notToBePay();
        this.modalRefChangeStatusInDebt.close();
      }
    })
  }

  openModalChangeStatusOutDebt(contentChangeStatusOutDebt, detailOutDebt: Debt) {
    this.detailOutDebt = detailOutDebt;
    this.checkToGetThisMonth = false;
    this.checkToGetNextMonth = false;
    this.checkNotToGet = false;
    this.modalRefChangeStatusOutDebt = this.modalService.open(contentChangeStatusOutDebt as Component, { windowClass : "statusOutDebtModalClass", centered: true});
  }

  changeStatusToGetThisMonth() {
    if (this.checkToGetThisMonth) {
      this.detailOutDebt.toGetThisMonth = true;
      this.detailOutDebt.toGetNextMonth = false;
      this.detailOutDebt.notToGetForNow = false;
    }

    this.debtService.update(this.detailOutDebt.key, this.detailOutDebt);
    Swal.fire(
      'Status changed successfully' ,
      '',
      'success'
    ).then((res) => {
      if (res.value) {
        this.getTotalOutDebts();
        if (this.toGetThisMonth) this.getThisMonth();
        else if (this.toGetNextMonth) this.getNextMonth();
        else this.notToBeGet();
        this.modalRefChangeStatusOutDebt.close();
      }
    })
  }

  changeStatusToGetNextMonth() {
  if (this.checkToGetNextMonth) {
      this.detailOutDebt.toGetNextMonth = true;
      this.detailOutDebt.toGetThisMonth = false;
      this.detailOutDebt.notToGetForNow = false;
    }

    this.debtService.update(this.detailOutDebt.key, this.detailOutDebt);
    Swal.fire(
      'Status changed successfully' ,
      '',
      'success'
    ).then((res) => {
      if (res.value) {
        this.getTotalOutDebts();
        if (this.toGetThisMonth) this.getThisMonth();
        else if (this.toGetNextMonth) this.getNextMonth();
        else this.notToBeGet();
        this.modalRefChangeStatusOutDebt.close();
      }
    })
  }

  changeStatusNotToGetForNow() {
    if (this.checkNotToGet) {
      this.detailOutDebt.notToGetForNow = true;
      this.detailOutDebt.toGetThisMonth = false;
      this.detailOutDebt.toGetNextMonth = false;
    }

    this.debtService.update(this.detailOutDebt.key, this.detailOutDebt);
    Swal.fire(
      'Status changed successfully' ,
      '',
      'success'
    ).then((res) => {
      if (res.value) {
        this.getTotalOutDebts();
        if (this.toGetThisMonth) this.getThisMonth();
        else if (this.toGetNextMonth) this.getNextMonth();
        else this.notToBeGet();
        this.modalRefChangeStatusOutDebt.close();
      }
    })
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
