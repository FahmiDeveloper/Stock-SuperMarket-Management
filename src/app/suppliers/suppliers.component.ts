import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Supplier } from '../shared/models/supplier.model';
import { SupplierService } from '../shared/services/supplier.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit, OnDestroy {

  suppliers: Supplier[];
  filteredSuppliers: any[];
  subscription: Subscription;

  constructor(private supplierService: SupplierService) {
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

 ngOnDestroy() {
   this.subscription.unsubscribe();
 }

}
