import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from '../shared/services/auth.service';
import { InvoiceService } from '../shared/services/invoice.service';
import { SupplierService } from '../shared/services/supplier.service';
import { UserService } from '../shared/services/user.service';

import { Invoice } from '../shared/models/invoice.model';
import { FirebaseUserModel } from '../shared/models/user.model';


@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit, OnDestroy {

  invoices: Invoice[];
  filteredInvoices: Invoice[];

  subscription: Subscription;
  subscriptionForGetSupplierName: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  suppliers$;
  supplierId: string;
  
  queryDate: string = "";

  constructor(
    private invoiceService: InvoiceService, 
    private supplierService: SupplierService,
    public userService: UserService,
    public authService: AuthService
    ) {}

  ngOnInit() {
    this.getAllInvoices();
    this.getRolesUser();
    this.loadListSuppliers();
  }

  getAllInvoices() {
    this.subscription = this.invoiceService
      .getAll()
      .subscribe(invoices => {
        this.filteredInvoices = this.invoices = invoices;
        this.getSupplierName();
    });
  }

  getSupplierName() {
    this.filteredInvoices.forEach(element=>{
      this.subscriptionForGetSupplierName =  this.supplierService
      .getSupplierId(String(element.supplierId))
      .valueChanges()
      .subscribe(supplier => {   
        if(supplier) element.nameSupplier = supplier.name;
      });
    })
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

  loadListSuppliers() {
    this.suppliers$ = this.supplierService.getAll();
  }

  delete(invoiceId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this invoice!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.invoiceService.delete(invoiceId);
        Swal.fire(
          'Invoice has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  filter(query: string) {
    this.filteredInvoices = (query)
       ? this.invoices.filter(invoice => invoice.code.toLowerCase().includes(query.toLowerCase()))
       : this.invoices;
  }

  filetrBySupplier() {
    this.filteredInvoices = (this.supplierId)
        ? this.invoices.filter(element=>element.supplierId==this.supplierId)
        : this.invoices;
  }

  filterByDate() {
    this.filteredInvoices = (this.queryDate)
      ? this.invoices.filter(invoice => invoice.date.includes(this.queryDate))
      : this.invoices;
  }

  clear() {
    this.queryDate = "";
    this.getAllInvoices();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    if(this.subscriptionForGetSupplierName) this.subscriptionForGetSupplierName.unsubscribe();
  }

}
