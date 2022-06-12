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
  detailsInDebt: Debt[];
  detailsOutDebt: Debt[];

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
  totalOutDebts: number;
  totalInDebts: number;
  placeId: number;
  totalOutDebtsInModal: number;
  totalInDebtsInModal: number;
  toPayThisMonth: boolean = false;
  toGetThisMonth: boolean = false;

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
          if (this.placeId == 5) {
            this.getTotalIntDebts();
            this.getTotalOutDebts();
          }
          else this.getRestMoneyForeachPlace();
        } else this.filteredDebts = debts;
        this.getPlaceDebt();
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

  showRest(contentRestMoneyForeachPlace) {
    this.modalRefRestMoneyForeachPlace = this.modalService.open(contentRestMoneyForeachPlace as Component, { windowClass : "restModalClass", centered: true });
    this.getRestMoneyForeachPlace();
  }

  showDebt(contentDebt) {
    this.modalRefDebt = this.modalService.open(contentDebt as Component, { windowClass : "debtModalClass", centered: true});
    this.getTotalIntDebts();
    this.getTotalOutDebts();
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
    this.modalRefDetInDebt = this.modalService.open(contentDetInDebt as Component, { windowClass : "detailsDebtModalClass", centered: true});
    this.getDetInDebts();
  }

  showDetOutDebt(contentDetOutDebt) {
    this.modalRefDetOutDebt = this.modalService.open(contentDetOutDebt as Component, { windowClass : "detailsDebtModalClass", centered: true});
    this.getDetOutDebts();
  }

  getDetInDebts() {
    this.totalInDebtsInModal = 0;

    if (this.toPayThisMonth) {
      this.detailsInDebt = this.filteredDebtsCopie.filter(debt => (debt.debtor == "Fahmi") && (debt.debtForPay == true));
    } else {
      this.detailsInDebt = this.filteredDebtsCopie.filter(debt => debt.debtor == "Fahmi");
    }
    this.detailsInDebt.forEach(element => {
      this.totalInDebtsInModal += Number(element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT")));
    });
  }

  getDetOutDebts() {
    this.totalOutDebtsInModal = 0;

    if (this.toGetThisMonth) {
      this.detailsOutDebt = this.filteredDebtsCopie.filter(debt => (debt.creditor == "Fahmi") && (debt.debtToGet == true));
    } else {
      this.detailsOutDebt = this.filteredDebtsCopie.filter(debt => debt.creditor == "Fahmi");
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
            this.getDetInDebts();
            this.getTotalIntDebts();
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
            this.getDetOutDebts();
            this.getTotalOutDebts();
          }
        })
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
