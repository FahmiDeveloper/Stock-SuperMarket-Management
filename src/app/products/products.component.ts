import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products$;

  constructor(private productService: ProductService) {
    this.products$ = this.productService.getAll();
   }

  ngOnInit(): void {
  }

}
