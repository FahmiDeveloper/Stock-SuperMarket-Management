import { Component, OnDestroy, OnInit } from '@angular/core';
import { element } from 'protractor';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { Product } from '../shared/models/product.model';
import { CategoryService } from '../shared/services/category.service';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  products: Product[];
  filteredProducts: Product[];
  subscriptionForGetAllProducts: Subscription;
  subscriptionForGetCategoryName: Subscription;

  p: number = 1;

  constructor(private productService: ProductService, private categoryService: CategoryService) {
    this.subscriptionForGetAllProducts = this.productService.getAll()
    .subscribe(products => {
      this.filteredProducts = this.products = products;
      this.getCategoryName();
    });
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

  getCategoryName() {
    this.filteredProducts.forEach(element=>{
      this.subscriptionForGetCategoryName =  this.categoryService
      .getCategoryId(String(element.categoryId))
      .valueChanges()
      .subscribe(category => {   
        if(category.name) element.nameCategory = category.name;
      });
    })
  }

  ngOnDestroy() {
    this.subscriptionForGetAllProducts.unsubscribe();
    this.subscriptionForGetCategoryName.unsubscribe();
  }

}
