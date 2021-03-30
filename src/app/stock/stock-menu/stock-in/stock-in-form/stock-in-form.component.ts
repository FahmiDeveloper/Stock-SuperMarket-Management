import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { take } from 'rxjs/operators';
import { StockIn } from 'src/app/shared/models/stock-in.model';
import { StockInService } from 'src/app/shared/services/stock-in.service';

@Component({
  selector: 'app-stock-in-form',
  templateUrl: './stock-in-form.component.html',
  styleUrls: ['./stock-in-form.component.scss']
})
export class StockInFormComponent implements OnInit {

  stockInId;
  stockIn: StockIn = new StockIn();

  constructor(private stockInService: StockInService, private router: Router, private route: ActivatedRoute) {
    this.stockInId = this.route.snapshot.paramMap.get('id');
        if (this.stockInId) {
          this.stockInService.getStockInId(this.stockInId).valueChanges().pipe(take(1)).subscribe(stockIn => {
          this.stockIn = stockIn;
        });
      } else {
        this.stockIn.date = moment().format('YYYY-MM-DD');
        this.stockIn.time = moment().format('HH:mm');
      }
   }

  ngOnInit(): void {
  }

  save(stockIn) {
    if (this.stockInId) this.stockInService.update(this.stockInId, stockIn);
    else this.stockInService.create(stockIn);
    this.router.navigate(['/stock-in']);
  }

}
