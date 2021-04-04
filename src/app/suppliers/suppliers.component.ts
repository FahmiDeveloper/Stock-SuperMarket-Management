import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { Supplier } from '../shared/models/supplier.model';
import { FirebaseUserModel } from '../shared/models/user.model';
import { AuthService } from '../shared/services/auth.service';
import { SupplierService } from '../shared/services/supplier.service';
import { UserService } from '../shared/services/user.service';
import { ListInvoicesComponent } from './list-invoices/list-invoices.component';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit, OnDestroy {

  suppliers: Supplier[];
  filteredSuppliers: any[];
  subscription: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  constructor(
    private supplierService: SupplierService, 
    protected modalService: NgbModal,
    public userService: UserService,
    public authService: AuthService
    ) {
    this.subscription = this.supplierService.getAll()
    .subscribe(suppliers => this.filteredSuppliers = this.suppliers = suppliers);;;
   }

  ngOnInit(): void {
    this.getRolesUser();
  }

  delete(supplierId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this supplier!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.supplierService.delete(supplierId);
        Swal.fire(
          'Supplier has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  filter(query: string) {
    this.filteredSuppliers = (query)
       ? this.suppliers.filter(supplier => supplier.name.toLowerCase().includes(query.toLowerCase()))
       : this.suppliers;
 }

 openListInvoices(supplier: Supplier) {
  const modelref = this.modalService.open(ListInvoicesComponent as Component, { size: 'lg', centered: true });

  modelref.componentInstance.supplier = supplier;
  modelref.componentInstance.modelref = modelref;
}

getRolesUser() {
  this.subscriptionForUser = this.authService.isConnected.subscribe(res=>{
    if(res) {
      this.userService.getCurrentUser().then(user=>{
        if(user) {
          this.userService.get(user.uid).valueChanges().subscribe(dataUser=>{
            this.user = dataUser;
          });
        }
      });   
    }
  })
}

 ngOnDestroy() {
   this.subscription.unsubscribe();
   this.subscriptionForUser.unsubscribe();
 }

}
