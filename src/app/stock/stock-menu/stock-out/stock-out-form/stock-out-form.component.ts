import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StockOutService } from 'src/app/shared/services/stock-out.service';

@Component({
  selector: 'app-stock-out-form',
  templateUrl: './stock-out-form.component.html',
  styleUrls: ['./stock-out-form.component.scss']
})
export class StockOutFormComponent implements OnInit {

  constructor(private stockOutService: StockOutService, private router: Router) { }


  ngOnInit(): void {
  }

  save(stockOut) {
    this.stockOutService.create(stockOut);
    this.router.navigate(['/stock-out']);
  }

}
