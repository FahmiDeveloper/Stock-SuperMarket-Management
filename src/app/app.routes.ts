import { Routes } from '@angular/router';

import { AnimeFormComponent } from './animes/anime-form/anime-form.component';
import { AnimesComponent } from './animes/animes.component';
import { VersionGridAnimesComponent } from './animes/version-grid-animes/version-grid-animes.component';
import { HomeComponent } from './core/components/home/home.component';
import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { DebtsForGridComponent } from './debts/debts-for-grid/debts-for-grid.component';
import { NewOrEditDebtComponent } from './debts/debts-for-grid/new-or-edit-debt/new-or-edit-debt.component';
import { DebtsComponent } from './debts/debts.component';
import { FilesComponent } from './files/files.component';
import { ListUsersMobileComponent } from './list-users/list-users-mobile/list-users-mobile.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { MovieFormComponent } from './movies/movie-form/movie-form.component';
import { MoviesComponent } from './movies/movies.component';
import { VersionGridMoviesComponent } from './movies/version-grid-movies/version-grid-movies.component';
import { SerieFormComponent } from './series/serie-form/serie-form.component';
import { SeriesComponent } from './series/series.component';
import { VersionGridSeriesComponent } from './series/version-grid-series/version-grid-series.component';
import { UserComponent } from './user/user.component';

import { AuthGuard } from './shared/services/auth.guard';
import { SharedResolver } from './shared/services/shared.resolver';


export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  
  { path: 'user', component: UserComponent,  resolve: { data: SharedResolver}},
  { path: 'home', component: HomeComponent,  resolve: { data: SharedResolver}},

  // { path: 'employees/new', component: EmployeeFormComponent,  resolve: { data: SharedResolver}},
  // { path: 'employees/:id', component: EmployeeFormComponent,  resolve: { data: SharedResolver}},
  // { path: 'employees', component: EmployeesComponent,  resolve: { data: SharedResolver}},

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
  { path: 'debts/new', component: NewOrEditDebtComponent,  resolve: { data: SharedResolver}},
  { path: 'debts/:id', component: NewOrEditDebtComponent,  resolve: { data: SharedResolver}},

  { path: 'users', component: ListUsersComponent,  resolve: { data: SharedResolver}},
  { path: 'users-mobile', component: ListUsersMobileComponent,  resolve: { data: SharedResolver}}

]; 