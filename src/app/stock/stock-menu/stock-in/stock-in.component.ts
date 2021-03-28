import { Component, OnInit } from '@angular/core';
import { StockInService } from 'src/app/shared/services/stock-in.service';

@Component({
  selector: 'app-stock-in',
  templateUrl: './stock-in.component.html',
  styleUrls: ['./stock-in.component.scss']
})
export class StockInComponent implements OnInit {
  
  stockInProducts$;

  constructor(private stockInService: StockInService) { 
    this.stockInProducts$ = this.stockInService.getAll();
  }

  ngOnInit(): void {
  }

}
