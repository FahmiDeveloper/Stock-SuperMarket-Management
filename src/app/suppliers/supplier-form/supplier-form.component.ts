import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupplierService } from 'src/app/shared/services/supplier.service';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})
export class SupplierFormComponent implements OnInit {

  phoneMobileNumberPattern = "^((\\+91-?)|0)?[0-9]{8}$";

  constructor(private supplierService: SupplierService, private router: Router) { }

  ngOnInit(): void {
  }

  save(supplier) {
    this.supplierService.create(supplier);
    this.router.navigate(['/suppliers']);
  }

}
