import { Component, OnDestroy, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

import { Debt } from 'src/app/shared/models/debt.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

import { AuthService } from 'src/app/shared/services/auth.service';
import { DebtService } from 'src/app/shared/services/debt.service';
import { UserService } from 'src/app/shared/services/user.service';

import Swal from 'sweetalert2';
import { NewOrEditDebtComponent } from './new-or-edit-debt/new-or-edit-debt.component';

@Component({
  selector: 'app-debts-for-grid',
  templateUrl: './debts-for-grid.component.html',
  styleUrls: ['./debts-for-grid.component.scss']
})
export class DebtsForGridComponent implements OnInit, OnDestroy {

  debts: Debt[];
  filteredDebts: Debt[];

  subscriptionForGetAllDebts: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  queryDate: string = "";

  modalRefSearch: any;

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
      if (this.queryDate) {
        this.filteredDebts = debts.filter(debt => debt.date.includes(this.queryDate));
        this.modalRefSearch.close();
      }  else this.filteredDebts = debts;
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

  ngOnDestroy() {
    this.subscriptionForGetAllDebts.unsubscribe();
    this.subscriptionForUser.unsubscribe();
  }

}
