import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { StockOutService } from 'src/app/shared/services/stock-out.service';

@Component({
  selector: 'app-stock-out-form',
  templateUrl: './stock-out-form.component.html',
  styleUrls: ['./stock-out-form.component.scss']
})
export class StockOutFormComponent implements OnInit {

  stockOutId;
  stockOut = {};

  constructor(private stockOutService: StockOutService, private router: Router, private route: ActivatedRoute) { 
    this.stockOutId = this.route.snapshot.paramMap.get('id');
        if (this.stockOutId) {
          this.stockOutService.getStockOutId(this.stockOutId).pipe(take(1)).subscribe(stockOut => {
          this.stockOut = stockOut;
        });
      }
  }


  ngOnInit(): void {
  }

  save(stockOut) {
    if (this.stockOutId) this.stockOutService.update(this.stockOutId, stockOut);
    else this.stockOutService.create(stockOut);
    this.router.navigate(['/stock-out']);
  }

}
