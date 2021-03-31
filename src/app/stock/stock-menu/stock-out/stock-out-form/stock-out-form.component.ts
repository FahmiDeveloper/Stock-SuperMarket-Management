import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { StockOut } from 'src/app/shared/models/stock-out.model';
import { StockOutService } from 'src/app/shared/services/stock-out.service';

@Component({
  selector: 'app-stock-out-form',
  templateUrl: './stock-out-form.component.html',
  styleUrls: ['./stock-out-form.component.scss']
})
export class StockOutFormComponent implements OnInit {

  stockOutId;
  stockOut: StockOut = new StockOut();

  constructor(private stockOutService: StockOutService, private router: Router, private route: ActivatedRoute) { 
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


  ngOnInit(): void {
  }

  save(stockOut) {
    if (this.stockOutId) this.stockOutService.update(this.stockOutId, stockOut);
    else this.stockOutService.create(stockOut);
    this.router.navigate(['/stock-out']);
  }

  cancel() {
    this.router.navigate(['/stock-out']);
  }

}
