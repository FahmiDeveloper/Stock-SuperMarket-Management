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
  ListUsersMobileComponent,
  ModalPrivilegeComponent,
  ModalPrivilegeMobileComponent
} from './list-users/index';

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
  ListUsersByStatusForMobileComponent
} from './core/components/index';

import { 
  ToDoListComponent,
  TaskComponent,
  TaskFormComponent,
  ToDoListMobileComponent,
  TaskMobileComponent,
  TaskFormMobileComponent
} from './to-do-list/index';

import { UserComponent } from './user/index';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
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
    MatGridListModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
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
    NgxDocViewerModule, BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    UserComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    SortPipe,
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
    ListUsersMobileComponent,
    ModalPrivilegeComponent,
    ModalPrivilegeMobileComponent,
    ToDoListComponent,
    TaskComponent,
    TaskFormComponent,
    ToDoListMobileComponent,
    TaskMobileComponent,
    TaskFormMobileComponent,
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
  entryComponents: [
    NewOrEditMovieComponent,
    NewOrEditAnimeComponent,
    NewOrEditSerieComponent,
    NewOrEditDebtComponent,
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