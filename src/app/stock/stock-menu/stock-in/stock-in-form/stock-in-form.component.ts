import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import { take } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { ProductService } from 'src/app/shared/services/product.service';
import { StockInService } from 'src/app/shared/services/stock-in.service';

import { StockIn } from 'src/app/shared/models/stock-in.model';

@Component({
  selector: 'app-stock-in-form',
  templateUrl: './stock-in-form.component.html',
  styleUrls: ['./stock-in-form.component.scss']
})
export class StockInFormComponent implements OnInit {

  stockInId;
  stockIn: StockIn = new StockIn();
  products$;

  constructor(
    private stockInService: StockInService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.getStockInData();
    this.loadListProducts();
  }

  getStockInData() {
    this.stockInId = this.route.snapshot.paramMap.get('id');
    if (this.stockInId) {
      this.stockInService
      .getStockInId(this.stockInId)
      .valueChanges()
      .pipe(take(1))
      .subscribe(stockIn => {
        this.stockIn = stockIn;
    });
    } else {
      this.stockIn.date = moment().format('YYYY-MM-DD');
      this.stockIn.time = moment().format('HH:mm');
    }
  }

  loadListProducts() {
    this.products$ = this.productService.getAll();
  }

  save(stockIn) {
    if (this.stockInId) {
      this.stockInService.update(this.stockInId, stockIn);
      Swal.fire(
        'Stock in data has been Updated successfully',
        '',
        'success'
      )
    }
    else {
      this.stockInService.create(stockIn);
      Swal.fire(
        'New stock in added successfully',
        '',
        'success'
      )
    }
    this.router.navigate(['/stock-in']);
  }

  cancel() {
    this.router.navigate(['/stock-in']);
  }
}
