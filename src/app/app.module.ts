import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTabsModule } from '@angular/material/tabs';
import { LayoutModule } from '@angular/cdk/layout';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

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
  HeaderComponent,
  HomeComponent,
  LoginComponent,
  RegisterComponent,
  ListMoviesByStatusForDesktopComponent,
  ListMoviesByStatusForMobileComponent,
  ListAnimesByStatusForDesktopComponent,
  ListAnimesByStatusForMobileComponent,
  ListSeriesByStatusForDesktopComponent,
  ListSeriesByStatusForMobileComponent,
  ListFilesByTypeComponent,
  ListTasksForDesktopComponent,
  ListTasksForMobileComponent,
  TaskDataComponent,
  ListUsersByStatusForDesktopComponent,
  ListUsersByStatusForMobileComponent,
  ListClockingsForDesktopComponent,
  ListClockingsForMobileComponent,
  ListExpirationsForDesktopComponent,
  ListExpirationsForMobileComponent
} from './core/components/index';

import { UserComponent } from './user/index';

import { 
  AnimesForDesktopComponent,
  ListSeasonsMoviesForDesktopComponent,
  AnimeFormDesktopComponent,
  AnimeDetailsWithSeasonsDesktopComponent,
  AnimesForMobileComponent,
  ListSeasonsMoviesForMobileComponent,
  AnimeFormMobileComponent,
  AnimeDetailsWithSeasonsMobileComponent
} from './animes/index';

import { 
  ClockingsForDesktopComponent,
  ClockingFormDesktopComponent,
  ClockingsForMobileComponent,
  ClockingFormMobileComponent,
} from './clockings/index';

import { 
  DebtsForDesktopComponent,
  DebtFormDesktopComponent,
  DebtsForMobileComponent,
  DebtFormMobileComponent
} from './debts/index';

import { 
  ExpirationsForDesktopComponent,
  ExpirationFormDesktopComponent,
  ExpirationsForMobileComponent,
  ExpirationFormMobileComponent,
} from './expirations/index';

import { 
  FilesComponent,
  UploadFormComponent,
  UploadListComponent,
  UploadDetailsComponent,
  NewOrEditLinkComponent
} from './files/index';

import { 
  ListUsersForDesktopComponent,
  ModalPrivilegeDesktopComponent,
  ListUsersForMobileComponent,
  ModalPrivilegeMobileComponent
} from './list-users/index';

import { 
  MoviesForDesktopComponent,
  ListPartsForDesktopComponent,
  MovieFormDesktopComponent,
  MovieDetailsWithPartsDesktopComponent,
  MoviesForMobileComponent,
  ListPartsForMobileComponent,
  MovieFormMobileComponent,
  MovieDetailsWithPartsMobileComponent
} from './movies/index';

import { 
  PasswordsForDesktopComponent,
  PasswordFormDesktopComponent,
  PasswordsForMobileComponent,
  PasswordFormMobileComponent,
} from './passwords/index';

import { 
  SeriesForDesktopComponent,
  ListSeasonsForDesktopComponent,
  SeriesForMobileComponent,
  ListSeasonsForMobileComponent
} from './series/index';

import { 
  ToDoListForDesktopComponent,
  TaskDesktopComponent,
  TaskFormDesktopComponent,
  ToDoListForMobileComponent,
  TaskMobileComponent,
  TaskFormMobileComponent
} from './to-do-list/index';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    FormsModule,
    MatCardModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatTabsModule,
    MatCheckboxModule,
    MatChipsModule,
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
    NgxDocViewerModule, 
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    UserComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    SortPipe,

    ListMoviesByStatusForDesktopComponent,
    ListMoviesByStatusForMobileComponent,
    ListAnimesByStatusForDesktopComponent,
    ListAnimesByStatusForMobileComponent,
    ListSeriesByStatusForDesktopComponent,
    ListSeriesByStatusForMobileComponent,
    ListFilesByTypeComponent,
    ListTasksForDesktopComponent,
    ListTasksForMobileComponent,
    TaskDataComponent,
    ListUsersByStatusForDesktopComponent,
    ListUsersByStatusForMobileComponent,

    AnimesForDesktopComponent,
    ListSeasonsMoviesForDesktopComponent,
    AnimeFormDesktopComponent,
    AnimeDetailsWithSeasonsDesktopComponent,
    AnimesForMobileComponent,
    ListSeasonsMoviesForMobileComponent,
    AnimeFormMobileComponent,
    AnimeDetailsWithSeasonsMobileComponent,

    ClockingsForDesktopComponent,
    ClockingFormDesktopComponent,
    ListClockingsForDesktopComponent,
    ClockingsForMobileComponent,
    ClockingFormMobileComponent,
    ListClockingsForMobileComponent,

    DebtsForDesktopComponent,
    DebtFormDesktopComponent,
    DebtsForMobileComponent,
    DebtFormMobileComponent,

    ExpirationsForDesktopComponent,
    ExpirationFormDesktopComponent,
    ListExpirationsForDesktopComponent,
    ExpirationsForMobileComponent,
    ExpirationFormMobileComponent,
    ListExpirationsForMobileComponent,

    FilesComponent,
    UploadFormComponent,
    UploadListComponent,
    UploadDetailsComponent,
    NewOrEditLinkComponent,

    ListUsersForDesktopComponent,
    ModalPrivilegeDesktopComponent,
    ListUsersForMobileComponent,
    ModalPrivilegeMobileComponent,

    MoviesForDesktopComponent,
    ListPartsForDesktopComponent,
    MovieFormDesktopComponent,
    MovieDetailsWithPartsDesktopComponent,
    MoviesForMobileComponent,
    ListPartsForMobileComponent,
    MovieFormMobileComponent,
    MovieDetailsWithPartsMobileComponent,

    PasswordsForDesktopComponent,
    PasswordFormDesktopComponent,
    PasswordsForMobileComponent,
    PasswordFormMobileComponent,

    SeriesForDesktopComponent,
    ListSeasonsForDesktopComponent,
    SeriesForMobileComponent,
    ListSeasonsForMobileComponent,

    ToDoListForDesktopComponent,
    TaskDesktopComponent,
    TaskFormDesktopComponent,
    ToDoListForMobileComponent,
    TaskMobileComponent,
    TaskFormMobileComponent
  ],
  entryComponents: [
    ListSeasonsMoviesForDesktopComponent,
    ListSeasonsMoviesForMobileComponent,

    NewOrEditLinkComponent,

    ListMoviesByStatusForDesktopComponent,
    ListMoviesByStatusForMobileComponent,

    ListAnimesByStatusForDesktopComponent,
    ListAnimesByStatusForMobileComponent,

    ListSeriesByStatusForDesktopComponent,
    ListSeriesByStatusForMobileComponent,

    ListFilesByTypeComponent,

    ListTasksForDesktopComponent,
    ListTasksForMobileComponent,
    TaskDataComponent,
    
    ListUsersByStatusForDesktopComponent,
    ListUsersByStatusForMobileComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }