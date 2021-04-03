import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Supplier } from '../shared/models/supplier.model';
import { SupplierService } from '../shared/services/supplier.service';
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

  p: number = 1;

  constructor(private supplierService: SupplierService, protected modalService: NgbModal) {
    this.subscription = this.supplierService.getAll()
    .subscribe(suppliers => this.filteredSuppliers = this.suppliers = suppliers);;;
   }

  ngOnInit(): void {
  }

  delete(supplierId) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

      this.supplierService.delete(supplierId);
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

 ngOnDestroy() {
   this.subscription.unsubscribe();
 }

}
