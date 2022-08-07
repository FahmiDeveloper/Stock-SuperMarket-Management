import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { AngularFireStorageModule } from '@angular/fire/storage';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { CustomFormsModule } from 'ng2-validation';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

import { AppRoutingModule } from './app-routing.module';
import { rootRouterConfig } from './app.routes';

import { environment } from 'src/environments/environment';

import { SortPipe } from './shared/pipes/sort.pipe';

import { AppComponent } from './app.component';

import { 
  MoviesComponent,
  MovieFormComponent,
  ShowMoviePictureComponent,
  VersionGridMoviesComponent,
  NewOrEditMovieComponent
} from './movies/index';

import { 
  AnimesComponent,
  AnimeFormComponent,
  ShowAnimePictureComponent,
  VersionGridAnimesComponent,
  NewOrEditAnimeComponent
} from './animes/index';

import { 
  SeriesComponent,
  SerieFormComponent,
  ShowSeriePictureComponent,
  VersionGridSeriesComponent,
  NewOrEditSerieComponent
} from './series/index';

import { 
  FilesComponent,
  UploadFormComponent,
  UploadListComponent,
  UploadDetailsComponent,
  NewOrEditLinkComponent
} from './files/index';

import { 
  DebtsComponent,
  DebtFormComponent,
  DebtsForGridComponent,
  NewOrEditDebtComponent
} from './debts/index';

import { 
  ListUsersComponent,
  ListUsersMobileComponent
} from './list-users/index';


import { 
  HeaderComponent,
  HomeComponent,
  LoginComponent,
  RegisterComponent
} from './core/components/index';

import { UserComponent } from './user/index';


import { ProductsComponent } from './products/products.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { EmployeesComponent } from './employees/employees.component';
import { EmployeeFormComponent } from './employees/employee-form/employee-form.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryFormComponent } from './categories/category-form/category-form.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { SupplierFormComponent } from './suppliers/supplier-form/supplier-form.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { InvoiceFormComponent } from './invoices/invoice-form/invoice-form.component';
import { StockMenuComponent } from './stock/stock-menu/stock-menu.component';
import { StockInFormComponent } from './stock/stock-menu/stock-in/stock-in-form/stock-in-form.component';
import { StockInComponent } from './stock/stock-menu/stock-in/stock-in.component';
import { StockOutFormComponent } from './stock/stock-menu/stock-out/stock-out-form/stock-out-form.component';
import { StockOutComponent } from './stock/stock-menu/stock-out/stock-out.component';
import { ListProductsComponent } from './categories/list-products/list-products.component';
import { ListInvoicesComponent } from './suppliers/list-invoices/list-invoices.component';
import { ShowProductPictureComponent } from './products/show-product-picture/show-product-picture.component';
import { ShowEmployeePictureComponent } from './employees/show-employee-picture/show-employee-picture.component';
import { VersionGridComponent } from './products/version-grid/version-grid.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PdfViewerModule,
    NgbModule,
    NgxPaginationModule,
    CustomFormsModule,
    RouterModule.forRoot(rootRouterConfig, { useHash: false }),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    NgxDocViewerModule
  ],
  declarations: [
    AppComponent,
    UserComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    ProductFormComponent,
    ProductsComponent,
    EmployeesComponent,
    EmployeeFormComponent,
    CategoriesComponent,
    CategoryFormComponent,
    SuppliersComponent,
    SupplierFormComponent,
    StockInComponent,
    StockOutComponent,
    StockOutFormComponent,
    StockInFormComponent,
    InvoicesComponent,
    InvoiceFormComponent,
    StockMenuComponent,
    SortPipe,
    ListProductsComponent,
    ListInvoicesComponent,
    ShowProductPictureComponent,
    ShowEmployeePictureComponent,
    VersionGridComponent,
    MoviesComponent,
    MovieFormComponent,
    ShowMoviePictureComponent,
    VersionGridMoviesComponent,
    AnimesComponent,
    AnimeFormComponent,
    ShowAnimePictureComponent,
    VersionGridAnimesComponent,
    NewOrEditMovieComponent,
    NewOrEditAnimeComponent,
    SeriesComponent,
    SerieFormComponent,
    ShowSeriePictureComponent,
    VersionGridSeriesComponent,
    NewOrEditSerieComponent,
    FilesComponent,
    UploadFormComponent,
    UploadListComponent,
    UploadDetailsComponent,
    DebtsComponent,
    DebtFormComponent,
    DebtsForGridComponent,
    NewOrEditDebtComponent,
    NewOrEditLinkComponent,
    ListUsersComponent,
    ListUsersMobileComponent
  ],
  entryComponents: [
    ListProductsComponent,
    ListInvoicesComponent,
    ShowProductPictureComponent,
    ShowEmployeePictureComponent,
    NewOrEditMovieComponent,
    NewOrEditAnimeComponent,
    NewOrEditSerieComponent,
    NewOrEditDebtComponent,
    NewOrEditLinkComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }