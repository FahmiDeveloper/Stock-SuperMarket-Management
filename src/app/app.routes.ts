import { Routes } from '@angular/router';
import { AnimeFormComponent } from './animes/anime-form/anime-form.component';
import { AnimesComponent } from './animes/animes.component';
import { VersionGridAnimesComponent } from './animes/version-grid-animes/version-grid-animes.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryFormComponent } from './categories/category-form/category-form.component';
import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { DebtsForGridComponent } from './debts/debts-for-grid/debts-for-grid.component';
import { DebtsComponent } from './debts/debts.component';
import { EmployeeFormComponent } from './employees/employee-form/employee-form.component';
import { EmployeesComponent } from './employees/employees.component';
import { FilesComponent } from './files/files.component';
import { InvoiceFormComponent } from './invoices/invoice-form/invoice-form.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { MovieFormComponent } from './movies/movie-form/movie-form.component';
import { MoviesComponent } from './movies/movies.component';
import { VersionGridMoviesComponent } from './movies/version-grid-movies/version-grid-movies.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { ProductsComponent } from './products/products.component';
import { VersionGridComponent } from './products/version-grid/version-grid.component';
import { SerieFormComponent } from './series/serie-form/serie-form.component';
import { SeriesComponent } from './series/series.component';
import { VersionGridSeriesComponent } from './series/version-grid-series/version-grid-series.component';
import { AuthGuard } from './shared/services/auth.guard';
import { SharedResolver } from './shared/services/shared.resolver';
import { StockInFormComponent } from './stock/stock-menu/stock-in/stock-in-form/stock-in-form.component';
import { StockInComponent } from './stock/stock-menu/stock-in/stock-in.component';
import { StockMenuComponent } from './stock/stock-menu/stock-menu.component';
import { StockOutFormComponent } from './stock/stock-menu/stock-out/stock-out-form/stock-out-form.component';
import { StockOutComponent } from './stock/stock-menu/stock-out/stock-out.component';
import { SupplierFormComponent } from './suppliers/supplier-form/supplier-form.component';
import { SuppliersComponent } from './suppliers/suppliers.component';
import { UserComponent } from './user/user.component';


export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  
  { path: 'user', component: UserComponent,  resolve: { data: SharedResolver}},
  { path: 'home', component: HomeComponent,  resolve: { data: SharedResolver}},

  { path: 'employees/new', component: EmployeeFormComponent,  resolve: { data: SharedResolver}},
  { path: 'employees/:id', component: EmployeeFormComponent,  resolve: { data: SharedResolver}},
  { path: 'employees', component: EmployeesComponent,  resolve: { data: SharedResolver}},

  { path: 'products/new', component: ProductFormComponent,  resolve: { data: SharedResolver}},
  { path: 'products/:id', component: ProductFormComponent,  resolve: { data: SharedResolver}},
  { path: 'products', component: ProductsComponent,  resolve: { data: SharedResolver}},
  { path: 'products-for-grid', component: VersionGridComponent,  resolve: { data: SharedResolver}},
  
  { path: 'categories/new', component: CategoryFormComponent,  resolve: { data: SharedResolver}},
  { path: 'categories/:id', component: CategoryFormComponent,  resolve: { data: SharedResolver}},
  { path: 'categories', component: CategoriesComponent,  resolve: { data: SharedResolver}},

  { path: 'stock-menu', component: StockMenuComponent,  resolve: { data: SharedResolver}},

  { path: 'stock-in/new', component: StockInFormComponent,  resolve: { data: SharedResolver}},
  { path: 'stock-in/:id', component: StockInFormComponent,  resolve: { data: SharedResolver}},
  { path: 'stock-in', component: StockInComponent,  resolve: { data: SharedResolver}},
  
  { path: 'stock-out/new', component: StockOutFormComponent,  resolve: { data: SharedResolver}},
  { path: 'stock-out/:id', component: StockOutFormComponent,  resolve: { data: SharedResolver}},
  { path: 'stock-out', component: StockOutComponent,  resolve: { data: SharedResolver}},
  
  { path: 'suppliers/new', component: SupplierFormComponent,  resolve: { data: SharedResolver}},
  { path: 'suppliers/:id', component: SupplierFormComponent,  resolve: { data: SharedResolver}},
  { path: 'suppliers', component: SuppliersComponent,  resolve: { data: SharedResolver}},

  { path: 'invoices/new', component: InvoiceFormComponent,  resolve: { data: SharedResolver}},
  { path: 'invoices/:id', component: InvoiceFormComponent,  resolve: { data: SharedResolver}},
  { path: 'invoices', component: InvoicesComponent,  resolve: { data: SharedResolver}},

  { path: 'movies/new', component: MovieFormComponent,  resolve: { data: SharedResolver}},
  { path: 'movies/:id', component: MovieFormComponent,  resolve: { data: SharedResolver}},
  { path: 'movies', component: MoviesComponent,  resolve: { data: SharedResolver}},
  { path: 'movies-for-grid', component: VersionGridMoviesComponent,  resolve: { data: SharedResolver}},

  { path: 'animes/new', component: AnimeFormComponent,  resolve: { data: SharedResolver}},
  { path: 'animes/:id', component: AnimeFormComponent,  resolve: { data: SharedResolver}},
  { path: 'animes', component: AnimesComponent,  resolve: { data: SharedResolver}},
  { path: 'animes-for-grid', component: VersionGridAnimesComponent,  resolve: { data: SharedResolver}},

  { path: 'series/new', component: SerieFormComponent,  resolve: { data: SharedResolver}},
  { path: 'series/:id', component: SerieFormComponent,  resolve: { data: SharedResolver}},
  { path: 'series', component: SeriesComponent,  resolve: { data: SharedResolver}},
  { path: 'series-for-grid', component: VersionGridSeriesComponent,  resolve: { data: SharedResolver}},

  { path: 'files', component: FilesComponent,  resolve: { data: SharedResolver}},

  { path: 'debts', component: DebtsComponent,  resolve: { data: SharedResolver}},
  { path: 'debts-for-grid', component: DebtsForGridComponent,  resolve: { data: SharedResolver}},

]; 