import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { UserComponent } from './user/user.component';

import { RouterModule } from '@angular/router';
import { rootRouterConfig } from './app.routes';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './core/components/header/header.component';
import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
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
import { SortPipe } from './shared/pipes/sort.pipe';
import { CustomFormsModule } from 'ng2-validation';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ListProductsComponent } from './categories/list-products/list-products.component';
import { ListInvoicesComponent } from './suppliers/list-invoices/list-invoices.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ShowProductPictureComponent } from './products/show-product-picture/show-product-picture.component';
import { ShowEmployeePictureComponent } from './employees/show-employee-picture/show-employee-picture.component';
import { VersionGridComponent } from './products/version-grid/version-grid.component';
import { MoviesComponent } from './movies/movies.component';
import { MovieFormComponent } from './movies/movie-form/movie-form.component';
import { ShowMoviePictureComponent } from './movies/show-movie-picture/show-movie-picture.component';
import { VersionGridMoviesComponent } from './movies/version-grid-movies/version-grid-movies.component';
import { AnimesComponent } from './animes/animes.component';
import { AnimeFormComponent } from './animes/anime-form/anime-form.component';
import { ShowAnimePictureComponent } from './animes/show-anime-picture/show-anime-picture.component';
import { VersionGridAnimesComponent } from './animes/version-grid-animes/version-grid-animes.component';
import { NewOrEditMovieComponent } from './movies/version-grid-movies/new-or-edit-movie/new-or-edit-movie.component';
import { NewOrEditAnimeComponent } from './animes/version-grid-animes/new-or-edit-anime/new-or-edit-anime.component';
import { SeriesComponent } from './series/series.component';
import { SerieFormComponent } from './series/serie-form/serie-form.component';
import { ShowSeriePictureComponent } from './series/show-serie-picture/show-serie-picture.component';
import { VersionGridSeriesComponent } from './series/version-grid-series/version-grid-series.component';
import { NewOrEditSerieComponent } from './series/version-grid-series/new-or-edit-serie/new-or-edit-serie.component';
import { FilesComponent } from './files/files.component';
import { UploadFormComponent } from './files/upload-form/upload-form.component';
import { UploadListComponent } from './files/upload-list/upload-list.component';
import { UploadDetailsComponent } from './files/upload-details/upload-details.component';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { DebtsComponent } from './debts/debts.component';
import { DebtFormComponent } from './debts/debt-form/debt-form.component';
import { DebtsForGridComponent } from './debts/debts-for-grid/debts-for-grid.component';
import { NewOrEditDebtComponent } from './debts/debts-for-grid/new-or-edit-debt/new-or-edit-debt.component';
import { NewOrEditLinkComponent } from './files/new-or-edit-link/new-or-edit-link.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
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
    NewOrEditLinkComponent
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
