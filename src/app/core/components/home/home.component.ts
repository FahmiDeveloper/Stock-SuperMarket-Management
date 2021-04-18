import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable, Subscription } from 'rxjs';

import { AuthService } from 'src/app/shared/services/auth.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { EmployeeService } from 'src/app/shared/services/employee.service';
import { InvoiceService } from 'src/app/shared/services/invoice.service';
import { ProductService } from 'src/app/shared/services/product.service';
import { StockInService } from 'src/app/shared/services/stock-in.service';
import { StockOutService } from 'src/app/shared/services/stock-out.service';
import { SupplierService } from 'src/app/shared/services/supplier.service';
import { UserService } from 'src/app/shared/services/user.service';

import { Category } from 'src/app/shared/models/category.model';
import { Employee } from 'src/app/shared/models/employee.model';
import { Invoice } from 'src/app/shared/models/invoice.model';
import { Product } from 'src/app/shared/models/product.model';
import { StockIn } from 'src/app/shared/models/stock-in.model';
import { StockOut } from 'src/app/shared/models/stock-out.model';
import { Supplier } from 'src/app/shared/models/supplier.model';
import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  user: FirebaseUserModel = new FirebaseUserModel();

  subscripton: Subscription;

  employees: Observable<Employee[]>;
  products: Observable<Product[]>;
  categories: Observable<Category[]>;
  stockInProducts: Observable<StockIn[]>;
  stockOutProducts: Observable<StockOut[]>;
  suppliers: Observable<Supplier[]>;
  invoices: Observable<Invoice[]>;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private employeeService: EmployeeService,
    private productService: ProductService, 
    private categoryService: CategoryService, 
    private stockInService: StockInService, 
    private stockOutService: StockOutService, 
    private supplierService: SupplierService, 
    private invoiceService: InvoiceService
  ) {}

  ngOnInit() {
    this.getRolesUser();
    this.loadData();
  }
  
  getRolesUser() {
    this.subscripton = this.authService
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

  loadData() {
    this.employees = this.employeeService.getAll();
    this.products = this.productService.getAll();
    this.categories = this.categoryService.getAll();
    this.stockInProducts = this.stockInService.getAll();
    this.stockOutProducts = this.stockOutService.getAll();
    this.suppliers = this.supplierService.getAll();
    this.invoices = this.invoiceService.getAll();  
  }

  ngOnDestroy() {
    this.subscripton.unsubscribe();
  }
}
