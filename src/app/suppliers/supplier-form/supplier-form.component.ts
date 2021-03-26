import { Component, OnInit } from '@angular/core';
import { SupplierService } from 'src/app/shared/services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent implements OnInit {

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
  }

  save(supplier) {
    this.supplierService.create(supplier);
  }

}
