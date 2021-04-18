import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { UserService } from 'src/app/shared/services/user.service';

import { Product } from 'src/app/shared/models/product.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-version-grid',
  templateUrl: './version-grid.component.html',
  styleUrls: ['./version-grid.component.scss']
})
export class VersionGridComponent implements OnInit {

  products: Product[];
  filteredProducts: Product[];

  subscriptionForGetAllProducts: Subscription;
  subscriptionForGetCategoryName: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  p: number = 1;

  categories$;
  categoryId: string;

  isGrid: boolean = false;

  constructor(
    private productService: ProductService, 
    private categoryService: CategoryService,
    public userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getAllProducts();
    this.getRolesUser();
    this.loadListCategories();
    this.isGrid = true;
  }

  getAllProducts() {
    this.subscriptionForGetAllProducts = this.productService
      .getAll()
      .subscribe(products => {
        this.filteredProducts = this.products = products;
        this.getCategoryName();
    });
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

  getRolesUser() {
    this.subscriptionForUser = this.authService
      .isConnected
      .subscribe(res=>{
        if(res) {
          this.userService
          .getCurrentUser()
          .then(user=>{
            if(user) {
              this.userService
                .get(user.uid)
                .valueChanges()
                .subscribe(dataUser=>{
                  this.user = dataUser;
                });
              }
          });   
        }
    })
  }

  loadListCategories() {
    this.categories$ = this.categoryService.getAll();
  }

  delete(productId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.productService.delete(productId);
        Swal.fire(
          'Product has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  filter(query: string) {
     this.filteredProducts = (query)
        ? this.products.filter(product => product.nameProduct.toLowerCase().includes(query.toLowerCase()))
        : this.products;
  }

  filetrByCategory() {
    this.filteredProducts = (this.categoryId)
        ? this.products.filter(element=>element.categoryId==this.categoryId)
        : this.products;
  }

  ngOnDestroy() {
    this.subscriptionForGetAllProducts.unsubscribe();
    this.subscriptionForGetCategoryName.unsubscribe();
  }
}
