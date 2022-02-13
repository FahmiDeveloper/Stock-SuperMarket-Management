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
  p: number = 1;
  queryDate: string = "";

  user: FirebaseUserModel = new FirebaseUserModel();

  subscriptionForGetAllDebts: Subscription;
  subscriptionForUser: Subscription;

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
        this.filteredDebts = this.debts = debts;
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

  // filter(query: string) {
  //    this.filteredMovies = (query)
  //       ? this.movies.filter(movie => movie.nameMovie.toLowerCase().includes(query.toLowerCase()))
  //       : this.movies;
  // }

  filterByDate() {
    this.filteredDebts = (this.queryDate)
      ? this.debts.filter(debt => debt.date.includes(this.queryDate))
      : this.debts;
  }

  clear() {
    this.queryDate = "";
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

  ngOnDestroy() {
    this.subscriptionForGetAllDebts.unsubscribe();
    this.subscriptionForUser.unsubscribe();
  }
}
