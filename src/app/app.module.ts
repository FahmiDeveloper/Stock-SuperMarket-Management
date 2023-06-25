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
import { OverlayModule } from '@angular/cdk/overlay';

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
  RegisterComponent
} from './core/components/index';

import { 
  AnimesForDesktopComponent,
  AnimeFormDesktopComponent,
  AnimeDetailsWithSeasonsDesktopComponent,
  AnimesForTabletComponent,
  AnimeFormTabletComponent,
  AnimeDetailsWithSeasonsTabletComponent,
  AnimesForMobileComponent,
  AnimeFormMobileComponent,
  AnimeDetailsWithSeasonsMobileComponent
} from './animes/index';

import { 
  ClockingsForDesktopComponent,
  ClockingFormForDesktopComponent,
  ClockingsForTabletComponent,
  ClockingFormForTabletComponent,
  ClockingsForMobileComponent,
  ClockingFormForMobileComponent
} from './clockings/index';

import { 
  DebtsForDesktopComponent,
  DebtFormDesktopComponent,
  DebtsForMobileComponent,
  DebtFormMobileComponent
} from './debts/index';

import { 
  SubjectDocumentsForDesktopComponent,
  SubjectDocumentsFormDesktopComponent,
  DocumentsListForDesktopComponent,
  DocumentFormDesktopComponent,
  SubjectsDocumentsForMobileComponent,
  SubjectDocumentsFormMobileComponent,
  DocumentsListForMobileComponent,
  DocumentFormMobileComponent
} from './documents/index';

import { 
  ExpirationsForDesktopComponent,
  ExpirationFormForDesktopComponent,
  ExpirationsForTabletComponent,
  ExpirationFormForTabletComponent,
  ExpirationsForMobileComponent,
  ExpirationFormForMobileComponent
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
  MedicationsForDesktopComponent,
  MedicationFormDesktopComponent,
  MedicationsForMobileComponent,
  MedicationFormMobileComponent
} from './medications/index';

import { 
  MoviesForDesktopComponent,
  MovieFormDesktopComponent,
  MovieDetailsWithPartsDesktopComponent,
  MoviesForTabletComponent,
  MovieFormTabletComponent,
  MovieDetailsWithPartsTabletComponent,
  MoviesForMobileComponent,
  MovieFormMobileComponent,
  MovieDetailsWithPartsMobileComponent
} from './movies/index';

import { 
  NotesForDesktopComponent,
  NoteFormDesktopComponent,
  NotesForMobileComponent,
  NoteFormMobileComponent,
  NoteMobileComponent
} from './notes/index';

import { 
  PasswordsForDesktopComponent,
  PasswordFormDesktopComponent,
  PasswordsForMobileComponent,
  PasswordFormMobileComponent,
} from './passwords/index';

import { 
  SeriesForDesktopComponent,
  SerieFormDesktopComponent,
  SerieDetailsWithSeasonsDesktopComponent,
  SeriesForTabletComponent,
  SerieFormTabletComponent,
  SerieDetailsWithSeasonsTabletComponent,
  SeriesForMobileComponent,
  SerieFormMobileComponent,
  SerieDetailsWithSeasonsMobileComponent
} from './series/index';

import { 
  ToDoListForDesktopComponent,
  TaskDesktopComponent,
  TaskFormDesktopComponent,
  ToDoListForMobileComponent,
  TaskMobileComponent,
  TaskFormMobileComponent
} from './to-do-list/index';

import { MaterialElevationDirective } from './shared/directives/material-elevation.directive';

import { BodyComponent } from './body/body.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { SublevelMenuComponent } from './sidenav/sublevel-menu.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    FormsModule,
    DragDropModule,
    OverlayModule,
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
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    SortPipe,

    AnimesForDesktopComponent,
    AnimeFormDesktopComponent,
    AnimeDetailsWithSeasonsDesktopComponent,
    AnimesForTabletComponent,
    AnimeFormTabletComponent,
    AnimeDetailsWithSeasonsTabletComponent,
    AnimesForMobileComponent,
    AnimeFormMobileComponent,
    AnimeDetailsWithSeasonsMobileComponent,

    ClockingsForDesktopComponent,
    ClockingFormForDesktopComponent,
    ClockingsForTabletComponent,
    ClockingFormForTabletComponent,
    ClockingsForMobileComponent,
    ClockingFormForMobileComponent,

    DebtsForDesktopComponent,
    DebtFormDesktopComponent,
    DebtsForMobileComponent,
    DebtFormMobileComponent,

    SubjectDocumentsForDesktopComponent,
    SubjectDocumentsFormDesktopComponent,
    DocumentsListForDesktopComponent,
    DocumentFormDesktopComponent,
    SubjectsDocumentsForMobileComponent,
    SubjectDocumentsFormMobileComponent,
    DocumentsListForMobileComponent,
    DocumentFormMobileComponent,

    ExpirationsForDesktopComponent,
    ExpirationFormForDesktopComponent,
    ExpirationsForTabletComponent,
    ExpirationFormForTabletComponent,
    ExpirationsForMobileComponent,
    ExpirationFormForMobileComponent,

    FilesComponent,
    UploadFormComponent,
    UploadListComponent,
    UploadDetailsComponent,
    NewOrEditLinkComponent,

    ListUsersForDesktopComponent,
    ModalPrivilegeDesktopComponent,
    ListUsersForMobileComponent,
    ModalPrivilegeMobileComponent,

    MedicationsForDesktopComponent,
    MedicationFormDesktopComponent,
    MedicationsForMobileComponent,
    MedicationFormMobileComponent,

    MoviesForDesktopComponent,
    MovieFormDesktopComponent,
    MovieDetailsWithPartsDesktopComponent,
    MoviesForTabletComponent,
    MovieFormTabletComponent,
    MovieDetailsWithPartsTabletComponent,
    MoviesForMobileComponent,
    MovieFormMobileComponent,
    MovieDetailsWithPartsMobileComponent,

    NotesForDesktopComponent,
    NoteFormDesktopComponent,
    NotesForMobileComponent,
    NoteFormMobileComponent,
    NoteMobileComponent,

    PasswordsForDesktopComponent,
    PasswordFormDesktopComponent,
    PasswordsForMobileComponent,
    PasswordFormMobileComponent,

    SeriesForDesktopComponent,
    SerieFormDesktopComponent,
    SerieDetailsWithSeasonsDesktopComponent,
    SeriesForTabletComponent,
    SerieFormTabletComponent,
    SerieDetailsWithSeasonsTabletComponent,
    SeriesForMobileComponent,
    SerieFormMobileComponent,
    SerieDetailsWithSeasonsMobileComponent,

    ToDoListForDesktopComponent,
    TaskDesktopComponent,
    TaskFormDesktopComponent,
    ToDoListForMobileComponent,
    TaskMobileComponent,
    TaskFormMobileComponent,

    BodyComponent,
    SidenavComponent,
    SublevelMenuComponent,

    MaterialElevationDirective
  ],
  entryComponents: [],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }