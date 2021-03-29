import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../shared/services/supplier.service';

@Component({
  selector: 'app-suppliers',
  templateUrl: './suppliers.component.html',
  styleUrls: ['./suppliers.component.scss']
})
export class SuppliersComponent implements OnInit {

  suppliers$;

  constructor(private supplierService: SupplierService) {
    this.suppliers$ = this.supplierService.getAll();
   }

  ngOnInit(): void {
  }

  delete(supplierId) {
    if (!confirm('Are you sure you want to delete this supplier?')) return;

      this.supplierService.delete(supplierId);
  }

}
