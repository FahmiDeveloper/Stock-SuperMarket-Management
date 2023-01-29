import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { RouterModule } from '@angular/router';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';
import { DragDropModule } from '@angular/cdk/drag-drop';

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

import { AngularMaterialModule } from './angular-material.module';

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
  AnimeDetailsDesktopComponent,
  AnimesForMobileComponent,
  ListSeasonsMoviesForMobileComponent,
  AnimeFormMobileComponent,
  AnimeDetailsWithSeasonsMobileComponent,
  AnimeDetailsMobileComponent
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
  MovieDetailsDesktopComponent,
  MoviesForMobileComponent,
  ListPartsForMobileComponent,
  MovieFormMobileComponent,
  MovieDetailsWithPartsMobileComponent,
  MovieDetailsMobileComponent
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
  SerieFormDesktopComponent,
  SerieDetailsWithSeasonsDesktopComponent,
  SerieDetailsDesktopComponent,
  SeriesForMobileComponent,
  ListSeasonsForMobileComponent,
  SerieFormMobileComponent,
  SerieDetailsWithSeasonsMobileComponent,
  SerieDetailsMobileComponent
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
    DragDropModule,
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
    BrowserAnimationsModule,
    AngularMaterialModule
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
    AnimeDetailsDesktopComponent,
    AnimesForMobileComponent,
    ListSeasonsMoviesForMobileComponent,
    AnimeFormMobileComponent,
    AnimeDetailsWithSeasonsMobileComponent,
    AnimeDetailsMobileComponent,

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
    MovieDetailsDesktopComponent,
    MoviesForMobileComponent,
    ListPartsForMobileComponent,
    MovieFormMobileComponent,
    MovieDetailsWithPartsMobileComponent,
    MovieDetailsMobileComponent,

    PasswordsForDesktopComponent,
    PasswordFormDesktopComponent,
    PasswordsForMobileComponent,
    PasswordFormMobileComponent,

    SeriesForDesktopComponent,
    ListSeasonsForDesktopComponent,
    SerieFormDesktopComponent,
    SerieDetailsWithSeasonsDesktopComponent,
    SerieDetailsDesktopComponent,
    SeriesForMobileComponent,
    ListSeasonsForMobileComponent,
    SerieFormMobileComponent,
    SerieDetailsWithSeasonsMobileComponent,
    SerieDetailsMobileComponent,

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