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

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  user: FirebaseUserModel = new FirebaseUserModel();

  subscripton: Subscription;

  lengthEmployees: Observable<number>;
  lengthProducts: Observable<number>;
  lengthCategories: Observable<number>;
  lengthStockIn: Observable<number>;
  lengthStockOut: Observable<number>;
  lengthSuppliers: Observable<number>;
  lengthInvoices: Observable<number>;

  isMobile: boolean;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private employeeService: EmployeeService,
    private productService: ProductService, 
    private categoryService: CategoryService, 
    private stockInService: StockInService, 
    private stockOutService: StockOutService, 
    private supplierService: SupplierService, 
    private invoiceService: InvoiceService,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.getRolesUser();
    this.loadLengthData();
    this.isMobile = this.deviceService.isMobile();
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

  loadLengthData() {
    this.lengthEmployees = this.employeeService.countLengthEmployees();
    this.lengthProducts = this.productService.countLengthProducts();
    this.lengthCategories = this.categoryService.countLengthCategories();
    this.lengthStockIn = this.stockInService.countLengthStockIn();
    this.lengthStockOut = this.stockOutService.countLengthStockOut();
    this.lengthSuppliers = this.supplierService.countLengthSuppliers();
    this.lengthInvoices = this.invoiceService.countLengthInvoices();
  }

  ngOnDestroy() {
    this.subscripton.unsubscribe();
  }
}
