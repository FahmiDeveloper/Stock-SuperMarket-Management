import { Component, OnInit } from '@angular/core';
import { Category } from 'src/app/shared/models/category.model';
import { Product } from 'src/app/shared/models/product.model';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit {

  category: Category = new Category();
  listProducts: Product[];
  
  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadAllProducts();
  }

  loadAllProducts() {
    this.productService.getAll()
    .subscribe((products: Product[]) => {
        this.getListProductsForCategory(products);
    });
  }

  getListProductsForCategory(products: Product[]) {
    this.listProducts = [];
    this.listProducts = products.filter(element=>element.categoryId==this.category.key);
  }

}
