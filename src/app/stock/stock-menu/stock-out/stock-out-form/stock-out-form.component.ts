import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { ProductService } from 'src/app/shared/services/product.service';
import { StockOutService } from 'src/app/shared/services/stock-out.service';

import { StockOut } from 'src/app/shared/models/stock-out.model';

@Component({
  selector: 'app-stock-out-form',
  templateUrl: './stock-out-form.component.html',
  styleUrls: ['./stock-out-form.component.scss']
})

export class StockOutFormComponent implements OnInit {

  stockOutId;
  stockOut: StockOut = new StockOut();
  products$;

  constructor(
    private stockOutService: StockOutService, 
    private router: Router, 
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.getStockOutData();
    this.loadListProducts();
  }

  getStockOutData() {
    this.stockOutId = this.route.snapshot.paramMap.get('id');
    if (this.stockOutId) {
      this.stockOutService.getStockOutId(this.stockOutId).valueChanges().pipe(take(1)).subscribe(stockOut => {
      this.stockOut = stockOut;
    });
    } else {
      this.stockOut.date = moment().format('YYYY-MM-DD');
      this.stockOut.time = moment().format('HH:mm');
    }
  }

  loadListProducts() {
    this.products$ = this.productService.getAll();
  }

  save(stockOut) {
    if (this.stockOutId) {
      this.stockOutService.update(this.stockOutId, stockOut);
      Swal.fire(
        'Stock out data has been Updated successfully',
        '',
        'success'
      )
    }
    else {
      this.stockOutService.create(stockOut);
      Swal.fire(
        'New stock out added successfully',
        '',
        'success'
      )
    }
    this.router.navigate(['/stock-out']);
  }

  cancel() {
    this.router.navigate(['/stock-out']);
  }
}
