import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { StockInService } from 'src/app/shared/services/stock-in.service';

@Component({
  selector: 'app-stock-in-form',
  templateUrl: './stock-in-form.component.html',
  styleUrls: ['./stock-in-form.component.scss']
})
export class StockInFormComponent implements OnInit {

  stockInId;
  stockIn = {};

  constructor(private stockInService: StockInService, private router: Router, private route: ActivatedRoute) {
    this.stockInId = this.route.snapshot.paramMap.get('id');
        if (this.stockInId) {
          this.stockInService.getStockInId(this.stockInId).pipe(take(1)).subscribe(stockIn => {
          this.stockIn = stockIn;
        });
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
