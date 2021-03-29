import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from '../shared/models/product.model';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: Product[];
  filteredProducts: any[];
  subscription: Subscription;

  constructor(private productService: ProductService) {
    this.subscription = this.productService.getAll()
    .subscribe(products => this.filteredProducts = this.products = products);
   }

  ngOnInit(): void {
  }

  delete(productId) {
    if (!confirm('Are you sure you want to delete this product?')) return;

      this.productService.delete(productId);
  }

  filter(query: string) {
     this.filteredProducts = (query)
        ? this.products.filter(product => product.nameProduct.toLowerCase().includes(query.toLowerCase()))
        : this.products;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
