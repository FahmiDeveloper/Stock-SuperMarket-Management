import { Routes } from '@angular/router';

import { LoginComponent } from './core/components/login/login.component';
import { RegisterComponent } from './core/components/register/register.component';
import { UserComponent } from './user/user.component';
import { HomeComponent } from './core/components/home/home.component';

import { AnimesForDesktopComponent } from './animes/for-desktop/animes-for-desktop.component';
import { AnimesForMobileComponent } from './animes/for-mobile/animes-for-mobile.component';

import { ClockingsForMobileComponent } from './clockings/for-mobile/clockings-for-mobile.component';
import { ClockingsForDesktopComponent } from './clockings/for-desktop/clockings-for-desktop.component';

import { DebtsForDesktopComponent } from './debts/for-desktop/debts-for-desktop.component';
import { DebtsForMobileComponent } from './debts/for-mobile/debts-for-mobile.component';

import { SubjectDocumentsForDesktopComponent } from './documents/for-desktop/subjects-documents-for-desktop.component';
import { SubjectsDocumentsForMobileComponent } from './documents/for-mobile/subjects-documents-for-mobile.component';

import { ExpirationsForMobileComponent } from './expirations/for-mobile/expirations-for-mobile.component';
import { ExpirationsForDesktopComponent } from './expirations/for-desktop/expirations-for-desktop.component';

import { FilesComponent } from './files/files.component';

import { ListUsersForDesktopComponent } from './list-users/for-desktop/list-users-for-desktop.component';
import { ListUsersForMobileComponent } from './list-users/for-mobile/list-users-for-mobile.component';

import { MedicationsForDesktopComponent } from './medications/for-desktop/medications-for-desktop.component';
import { MedicationsForMobileComponent } from './medications/for-mobile/medications-for-mobile.component';

import { MoviesForDesktopComponent } from './movies/for-desktop/movies-for-desktop.component';
import { MoviesForMobileComponent } from './movies/for-mobile/movies-for-mobile.component';

import { NotesForDesktopComponent } from './notes/for-desktop/notes-for-desktop.component';
import { NotesForMobileComponent } from './notes/for-mobile/notes-for-mobile.component';

import { PasswordsForMobileComponent } from './passwords/for-mobile/passwords-for-mobile.component';
import { PasswordsForDesktopComponent } from './passwords/for-desktop/passwords-for-desktop.component';

import { SeriesForDesktopComponent } from './series/for-desktop/series-for-desktop.component';
import { SeriesForMobileComponent } from './series/for-mobile/series-for-mobile.component';

import { ToDoListForDesktopComponent } from './to-do-list/for-desktop/to-do-list-desktop.component';
import { ToDoListForMobileComponent } from './to-do-list/for-mobile/to-do-list-mobile.component';

import { AuthGuard } from './shared/services/auth.guard';
import { SharedResolver } from './shared/services/shared.resolver';

export const rootRouterConfig: Routes = [
  
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  
  { path: 'user', component: UserComponent,  resolve: { data: SharedResolver}},
  { path: 'home', component: HomeComponent,  resolve: { data: SharedResolver}},

  { path: 'animes-desktop', component: AnimesForDesktopComponent,  resolve: { data: SharedResolver}},
  { path: 'animes-mobile', component: AnimesForMobileComponent,  resolve: { data: SharedResolver}},

  { path: 'clockings-desktop', component: ClockingsForDesktopComponent,  resolve: { data: SharedResolver}},
  { path: 'clockings-mobile', component: ClockingsForMobileComponent,  resolve: { data: SharedResolver}},

  { path: 'debts-desktop', component: DebtsForDesktopComponent,  resolve: { data: SharedResolver}},
  { path: 'debts-mobile', component: DebtsForMobileComponent,  resolve: { data: SharedResolver}},

  { path: 'documents-desktop', component: SubjectDocumentsForDesktopComponent,  resolve: { data: SharedResolver}},
  { path: 'documents-mobile', component: SubjectsDocumentsForMobileComponent,  resolve: { data: SharedResolver}},

  { path: 'expirations-desktop', component: ExpirationsForDesktopComponent,  resolve: { data: SharedResolver}},
  { path: 'expirations-mobile', component: ExpirationsForMobileComponent,  resolve: { data: SharedResolver}},

  { path: 'files', component: FilesComponent,  resolve: { data: SharedResolver}},

  { path: 'users-desktop', component: ListUsersForDesktopComponent,  resolve: { data: SharedResolver}},
  { path: 'users-mobile', component: ListUsersForMobileComponent,  resolve: { data: SharedResolver}},

  { path: 'medications-desktop', component: MedicationsForDesktopComponent,  resolve: { data: SharedResolver}},
  { path: 'medications-mobile', component: MedicationsForMobileComponent,  resolve: { data: SharedResolver}},

  { path: 'movies-desktop', component: MoviesForDesktopComponent,  resolve: { data: SharedResolver}},
  { path: 'movies-mobile', component: MoviesForMobileComponent,  resolve: { data: SharedResolver}},

  { path: 'notes-desktop', component: NotesForDesktopComponent,  resolve: { data: SharedResolver}},
  { path: 'notes-mobile', component: NotesForMobileComponent,  resolve: { data: SharedResolver}},

  { path: 'passwords-desktop', component: PasswordsForDesktopComponent,  resolve: { data: SharedResolver}},
  { path: 'passwords-mobile', component: PasswordsForMobileComponent,  resolve: { data: SharedResolver}},

  { path: 'series-desktop', component: SeriesForDesktopComponent,  resolve: { data: SharedResolver}},
  { path: 'series-mobile', component: SeriesForMobileComponent,  resolve: { data: SharedResolver}},

  { path: 'to-do-list-desktop', component: ToDoListForDesktopComponent,  resolve: { data: SharedResolver}},
  { path: 'to-do-list-mobile', component: ToDoListForMobileComponent,  resolve: { data: SharedResolver}},

]; 