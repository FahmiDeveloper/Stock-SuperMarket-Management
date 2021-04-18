import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { SupplierService } from 'src/app/shared/services/supplier.service';

import { Supplier } from 'src/app/shared/models/supplier.model';

@Component({
  selector: 'app-supplier-form',
  templateUrl: './supplier-form.component.html',
  styleUrls: ['./supplier-form.component.scss']
})

export class SupplierFormComponent implements OnInit {

  supplierId;
  supplier: Supplier = new Supplier();

  phoneMobileNumberPattern = "^((\\+91-?)|0)?[0-9]{8}$";

  constructor(
    private supplierService: SupplierService, 
    private router: Router, 
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getDataSupplier();
  }

  getDataSupplier() {
    this.supplierId = this.route.snapshot.paramMap.get('id');
    if (this.supplierId) {
      this.supplierService.getSupplierId(this.supplierId).valueChanges().pipe(take(1)).subscribe(supplier => {
      this.supplier = supplier;
    });
    } else {
      this.supplier.date = moment().format('YYYY-MM-DD');
      this.supplier.time = moment().format('HH:mm');
    }
  }

  save(supplier) {
    if (this.supplierId) {
      this.supplierService.update(this.supplierId, supplier);
      Swal.fire(
        'Supplier data has been Updated successfully',
        '',
        'success'
      )
    }
    else {
      this.supplierService.create(supplier);
      Swal.fire(
        'New supplier added successfully',
        '',
        'success'
      )
    }
    this.router.navigate(['/suppliers']);
  }

  cancel() {
    this.router.navigate(['/suppliers']);
  }
}
