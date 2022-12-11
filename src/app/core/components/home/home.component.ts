import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgNavigatorShareService } from 'ng-navigator-share';

import { DeviceDetectorService } from 'ngx-device-detector';

import { NewOrEditLinkComponent } from 'src/app/files/new-or-edit-link/new-or-edit-link.component';

import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { UsersListService } from 'src/app/shared/services/list-users.service';
import { MovieService } from 'src/app/shared/services/movie.service';
import { AnimeService } from 'src/app/shared/services/anime.service';
import { SerieService } from 'src/app/shared/services/serie.service';
import { DebtService } from 'src/app/shared/services/debt.service';
import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { LinkService } from 'src/app/shared/services/link.service';
import { ClockingService } from 'src/app/shared/services/clocking.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';
import { Task } from 'src/app/shared/models/task.model';
import { Debt } from 'src/app/shared/models/debt.model';
import { Movie } from 'src/app/shared/models/movie.model';
import { Anime } from 'src/app/shared/models/anime.model';
import { Serie } from 'src/app/shared/models/serie.model';
import { Link } from 'src/app/shared/models/link.model';
import { Clocking } from 'src/app/shared/models/clocking.model';

const getObservable = (collection: AngularFirestoreCollection<Task>) => {
  const subject = new BehaviorSubject<Task[]>([]);
  collection.valueChanges({ idField: 'id' }).subscribe((val: Task[]) => {
    subject.next(val);
  });
  return subject;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  isMobile: boolean;

  // movies variables
  moviesWaitToSort: number = 0;
  moviesNotDownloadedYet: number= 0;
  moviesWatched: number= 0;
  moviesDownloadedButNotWatchedYet: number= 0;
  moviesToSearchAboutIt: number= 0;
  listMovies: Movie[] = [];
  currentStatusForMovie: number;

  // animes variables
  animesWaitToSort: number = 0;
  animesNotDownloadedYet: number= 0;
  animesWatched: number= 0;
  animesDownloadedButNotWatchedYet: number= 0;
  animesToSearchAboutIt: number= 0;
  listAnimes: Anime[] = [];
  currentStatusForAnime: number;

  // series variables
  seriesWaitToSort: number = 0;
  seriesNotDownloadedYet: number= 0;
  seriesWatched: number= 0;
  seriesDownloadedButNotWatchedYet: number= 0;
  seriesToSearchAboutIt: number= 0;
  listSeries: Serie[] = [];
  currentStatusForSerie: number;

  // files variables
  pictureFilesNbr: number = 0;
  pdfFilesNbr: number = 0;
  excelFilesNbr: number = 0;
  txtFilesNbr: number = 0;
  zipFilesNbr: number = 0;
  wordFilesNbr: number = 0;
  listFiles: any[] = [];
  fileByType: number;

  // links variables
  dataSource = new MatTableDataSource<Link>();
  dataSourceCopie = new MatTableDataSource<Link>();
  displayedColumns: string[] = ['content', 'star'];
  angularContext: boolean = false;
  otherContext: boolean = false;
  content: string = '';
  linkToDelete: Link = new Link();
  modalRefDeleteLink: any;

  // debts variables
  totalInDebt: number= 0;
  totalOutDebt: number= 0;
  allDebts: Debt[] = [];
  totalInDebts: string = "";
  defaultTotalInDebts: number;
  customTotalInDebts: number;
  totalOutDebts: string = "";
  defaultTotalOutDebts: number;
  customTotalOutDebts: number;
  restInPocket: string = "";
  restInWallet: string = "";
  restInEnvelope: string = "";
  restInBox: string = "";
  restInPosteAccount: string = "";
  totalInDebtsByByTimeToPay: string;
  customTotalInDebtsByTimeToPay: number;
  defaultTotalInDebtsByTimeToPay: number;
  totalInDebtsToPayThisMonth: string;
  totalInDebtsToPayNextMonth: string;
  totalInDebtsNotToPayForNow: string;
  defaultTotalInDebtsToPayThisMonth: number;
  customTotalInDebtsToPayThisMonth: number;
  defaultTotalInDebtsToPayNextMonth: number;
  customTotalInDebtsToPayNextMonth: number;
  defaultTotalInDebtsNotToPayForNow: number;
  customTotalInDebtsNotToPayForNow: number;
  totalInDebtsToGetThisMonth: string;
  customTotalInDebtsToGetThisMonth: number;
  defaultTotalInDebtsToGetThisMonth: number;
  totalOutDebtsToGetThisMonth: string;
  totalOutDebtsToGetNextMonth: string;
  customTotalInDebtsToGetNextMonth: number;
  defaultTotalInDebtsToGetNextMonth: number;
  totalOutDebtsNotToGetForNow: string;
  customTotalInDebtsNotToGetForNow: number;
  defaultTotalInDebtsNotToGetForNow: number;

  // Clocking variables
  currentMonthAndYear: string;
  clockingsList: Clocking[] = [];
  totalClockingLate: number = 0;
  minutePartList: number[] = [];
  sumClockingLate: number;
  totalClockingLateByHoursMinute: string = '';
  vacationLimitDays: number = 4.25;

  // to do list variables
  toDoToday = getObservable(this.store.collection('toDoToday')) as Observable<Task[]>;
  toDoTomorrow = getObservable(this.store.collection('toDoTomorrow')) as Observable<Task[]>;
  toDoThisWeek = getObservable(this.store.collection('toDoThisWeek')) as Observable<Task[]>;
  toDoNextWeek = getObservable(this.store.collection('toDoNextWeek')) as Observable<Task[]>;
  toDoLater = getObservable(this.store.collection('toDoLater')) as Observable<Task[]>;
  nbrTodayTask: number= 0;
  nbrTomorrowTask: number= 0;
  nbrThisWeekTask: number= 0;
  nbrNextWeekTaskList: number= 0;
  nbrLaterTaskList: number= 0;
  tasksByStatus: number;
  taskListForToday: Task[] = [];
  taskListForTomorrow: Task[]= [];
  taskListForThisWeek: Task[]= [];
  taskListForNextWeek: Task[]= [];
  laterTaskList: Task[]= [];
  tasksListByStatus: Task[]= [];

  // users variables
  totalNbrUsers: number= 0;
  nbrUsersConnected: number = 0;
  nbrUsersNotConnected: number= 0;
  totalUsers: FirebaseUserModel[] = [];
  totalUsersConnected: FirebaseUserModel[] = [];
  totalUsersNotConnected: FirebaseUserModel[] = [];
  usersListByStatus: FirebaseUserModel[]= [];
  usersByStatus: number;

  subscripton: Subscription;
  subscriptionForGetAllMovies: Subscription;
  subscriptionForGetAllAnimes: Subscription;
  subscriptionForGetAllSeries: Subscription;
  subscriptionForGetAllFiles: Subscription;
  subscriptionForGetAllDebts: Subscription;
  subscriptionForGetTodayWork: Subscription;
  subscriptionForGetTomorrowWork: Subscription;
  subscriptionForGetThisWeekWork: Subscription;
  subscriptionForGetNextWeekWork: Subscription;
  subscriptionForGetLaterWork: Subscription;
  subscriptionForGetAllUsers: Subscription;
  subscriptionForGetAllLinks: Subscription;
  subscriptionForGetAllClockings: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private movieService: MovieService,
    private animeService: AnimeService,
    private serieService: SerieService,
    private linkService: LinkService,
    private uploadService: FileUploadService,
    private debtService: DebtService,
    public clockingService: ClockingService,
    private store: AngularFirestore,
    public usersListService: UsersListService,
    private deviceService: DeviceDetectorService,
    protected ngNavigatorShareService: NgNavigatorShareService,
    public dialogService: MatDialog,
    protected router: Router
  ) {}

  ngOnInit() {
    this.getRolesUser();
    this.loadDataStatistics();
    this.isMobile = this.deviceService.isMobile();

    const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = new Date();
    this.currentMonthAndYear = month[d.getMonth()] + ' ' + d.getFullYear();
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
                let connectedUserFromList: FirebaseUserModel = new FirebaseUserModel();

                this.subscriptionForGetAllUsers = this.usersListService
                .getAll()
                .subscribe((users: FirebaseUserModel[]) => { 
                  connectedUserFromList = users.find(element => element.email == user.email);
                  this.totalNbrUsers = users.length;
                  this.nbrUsersConnected = users.filter(user => user.isConnected == true).length;
                  this.nbrUsersNotConnected = users.filter(user => user.isConnected == false).length;

                  this.totalUsers = users.sort((n1, n2) => n2.numRefUser - n1.numRefUser);
                  this.totalUsersConnected = users.filter(user => user.isConnected == true).sort((n1, n2) => n2.numRefUser - n1.numRefUser);
                  this.totalUsersNotConnected = users.filter(user => user.isConnected == false).sort((n1, n2) => n2.numRefUser - n1.numRefUser);

                  this.usersListService
                  .get(connectedUserFromList.key)
                  .valueChanges()
                  .subscribe(dataUser=>{
                    this.dataUserConnected = dataUser;
                  });
                });
              }
          });   
        }
    })
  }

  loadDataStatistics() {
    this.getMoviesStatistics();
    this.getAnimesStatistics();
    this.getSeriesStatistics();
    this.getFilesStatistics();
    this.getAllLinks();
    this.getAllDebtsStatistics();
    this.getAllClockingsStatistics();
    this.getToDoListsStatistics();
  }

  getMoviesStatistics() {
    this.subscriptionForGetAllMovies = this.movieService
    .getAll()
    .subscribe(movies => {
        this.listMovies = movies.sort((n1, n2) => n2.numRefMovie - n1.numRefMovie);
        this.moviesWaitToSort = movies.filter(movie => movie.statusId == 1).length;
        this.moviesNotDownloadedYet = movies.filter(movie => movie.statusId == 2).length;
        this.moviesWatched = movies.filter(movie => movie.statusId == 3).length;     
        this.moviesDownloadedButNotWatchedYet = movies.filter(movie => movie.statusId == 4).length;     
        this.moviesToSearchAboutIt = movies.filter(movie => movie.statusId == 5).length;          
      }
    );
  }

  getAnimesStatistics() {
    this.subscriptionForGetAllAnimes = this.animeService
    .getAll()
    .subscribe(animes => {
        this.listAnimes = animes.sort((n1, n2) => n2.numRefAnime - n1.numRefAnime);
        this.animesWaitToSort = animes.filter(anime => anime.statusId == 1).length;
        this.animesNotDownloadedYet = animes.filter(anime => anime.statusId == 2).length;
        this.animesWatched = animes.filter(anime => anime.statusId == 3).length;     
        this.animesDownloadedButNotWatchedYet = animes.filter(anime => anime.statusId == 4).length;     
        this.animesToSearchAboutIt = animes.filter(anime => anime.statusId == 5).length;          
      }
    );
  }

  getSeriesStatistics() {
    this.subscriptionForGetAllSeries = this.serieService
    .getAll()
    .subscribe(series => {
        this.listSeries = series.sort((n1, n2) => n2.numRefSerie - n1.numRefSerie);
        this.seriesWaitToSort = series.filter(serie => serie.statusId == 1).length;
        this.seriesNotDownloadedYet = series.filter(serie => serie.statusId == 2).length;
        this.seriesWatched = series.filter(serie => serie.statusId == 3).length;     
        this.seriesDownloadedButNotWatchedYet = series.filter(serie => serie.statusId == 4).length;     
        this.seriesToSearchAboutIt = series.filter(serie => serie.statusId == 5).length;          
      }
    );
  }

  getFilesStatistics() {
    this.subscriptionForGetAllFiles = this.uploadService.getFiles().snapshotChanges().pipe(
      map(changes => changes.map(c => ({ key: c.payload.key, ...c.payload.val() })))
    ).subscribe(fileUploads => {
       this.listFiles = fileUploads.sort((n1, n2) => n2.numRefFile - n1.numRefFile);
       this.pictureFilesNbr = fileUploads.filter(element => element.typeFileId == 1).length;
       this.pdfFilesNbr = fileUploads.filter(element => element.typeFileId == 2).length;
       this.excelFilesNbr = fileUploads.filter(element => element.typeFileId == 3).length;
       this.txtFilesNbr = fileUploads.filter(element => element.typeFileId == 4).length;
       this.zipFilesNbr = fileUploads.filter(element => element.typeFileId == 5).length;
       this.wordFilesNbr = fileUploads.filter(element => element.typeFileId == 7).length;
    });
  }

  getAllDebtsStatistics() {
    this.subscriptionForGetAllDebts = this.debtService
    .getAll()
    .subscribe(debts => {
      this.allDebts = debts;
      this.getRestMoneyForeachPlace();
      this.getTotalIntDebts();
      this.getTotalOutDebts();
      this.getTotalInDebtsToPayThisMonth();
      this.getTotalInDebtsToPayNextMonth();
      this.getTotalInDebtsNotToPayForNow();
      this.getTotalOutDebtsToGetThisMonth();
      this.getTotalOutDebtsToGetNextMonth();
      this.getTotalOutDebtsNotToGetForNow();
    });
  }

  getRestMoneyForeachPlace() {
    let debtForRestInPocket = this.allDebts.filter(debt => debt.placeId == 1).sort((n1, n2) => n2.numRefDebt - n1.numRefDebt)[0];
    let debtForRestInWallet = this.allDebts.filter(debt => debt.placeId == 2).sort((n1, n2) => n2.numRefDebt - n1.numRefDebt)[0];
    let debtForRestInEnvelope = this.allDebts.filter(debt => debt.placeId == 3).sort((n1, n2) => n2.numRefDebt - n1.numRefDebt)[0];
    let debtForRestInBox = this.allDebts.filter(debt => debt.placeId == 4).sort((n1, n2) => n2.numRefDebt - n1.numRefDebt)[0];
    let debtForRestInPosteAccount = this.allDebts.filter(debt => debt.placeId == 6).sort((n1, n2) => n2.numRefDebt - n1.numRefDebt)[0];

    this.restInPocket = debtForRestInPocket ? debtForRestInPocket.restMoney : '0DT';

    this.restInWallet = debtForRestInWallet ? debtForRestInWallet.restMoney : '0DT';

    this.restInEnvelope = debtForRestInEnvelope ? debtForRestInEnvelope.restMoney : '0DT';

    this.restInBox = debtForRestInBox ? debtForRestInBox.restMoney : '0DT';

    this.restInPosteAccount = debtForRestInPosteAccount ? debtForRestInPosteAccount.restMoney : '0DT';
  }

  getTotalIntDebts() { 
    this.defaultTotalInDebts = 0;
    this.customTotalInDebts = 0;
    this.totalInDebts = "";

    this.allDebts.filter(debt => debt.debtForPay == true).forEach(element => {
      if (element.financialDebt.indexOf("DT") !== -1) {
        element.financialInDebtWithConvert = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
        element.financialInDebtWithConvert = element.financialInDebtWithConvert + '000';
      }
      if (element.financialDebt.indexOf("Mill") !== -1) {
        element.financialInDebtWithConvert = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));
      }
      if (element.financialDebt.includes(".")){
        const composedFinancialDebt = element.financialDebt.split('.');
        if (composedFinancialDebt[0].indexOf("DT") !== -1) {
          element.firstPartComposedFinancialInDebt = composedFinancialDebt[0].substring(0, composedFinancialDebt[0].lastIndexOf("DT"));
          element.firstPartComposedFinancialInDebt = element.firstPartComposedFinancialInDebt + '000';
        }
        if (composedFinancialDebt[1].indexOf("Mill") !== -1) {
          element.secondPartComposedFinancialInDebt = composedFinancialDebt[1].substring(0, composedFinancialDebt[1].lastIndexOf("Mill"));
        }
        element.financialInDebtWithConvert = String(Number(element.firstPartComposedFinancialInDebt)+Number(element.secondPartComposedFinancialInDebt));
      }

      this.defaultTotalInDebts += Number(element.financialInDebtWithConvert);
      if (this.defaultTotalInDebts.toString().length > 4) {

        this.customTotalInDebts = this.defaultTotalInDebts / 1000;

        if (String(this.customTotalInDebts).includes(".")){
          const customTotalInDebts = String(this.customTotalInDebts).split('.');
          if (customTotalInDebts[1].length == 1) this.totalInDebts = customTotalInDebts[0] + "DT." + customTotalInDebts[1] + "00Mill";
          else if (customTotalInDebts[1].length == 2) this.totalInDebts = customTotalInDebts[0] + "DT." + customTotalInDebts[1] + "0Mill";
          else this.totalInDebts = customTotalInDebts[0] + "DT." + customTotalInDebts[1] + "Mill";
        } else {
          this.totalInDebts = String(this.customTotalInDebts) + "DT";
        }
      } else {
        this.totalInDebts = this.defaultTotalInDebts + "Mill";
      }
    }); 
  }

  getTotalOutDebts() {
    this.defaultTotalOutDebts = 0;
    this.customTotalOutDebts = 0;
    this.totalOutDebts = "";

    this.allDebts.filter(debt => debt.debtToGet == true).forEach(element => {
      if (element.financialDebt.indexOf("DT") !== -1) {
        element.financialOutDebtWithConvert = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
        element.financialOutDebtWithConvert = element.financialOutDebtWithConvert + '000';
      }
      if (element.financialDebt.indexOf("Mill") !== -1) {
        element.financialOutDebtWithConvert = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));
      }

      if (element.financialDebt.includes(".")){
        const composedFinancialDebt = element.financialDebt.split('.');
        if (composedFinancialDebt[0].indexOf("DT") !== -1) {
          element.firstPartComposedFinancialOutDebt = composedFinancialDebt[0].substring(0, composedFinancialDebt[0].lastIndexOf("DT"));
          element.firstPartComposedFinancialOutDebt = element.firstPartComposedFinancialOutDebt + '000';
        }
        if (composedFinancialDebt[1].indexOf("Mill") !== -1) {
          element.secondPartComposedFinancialOutDebt = composedFinancialDebt[1].substring(0, composedFinancialDebt[1].lastIndexOf("Mill"));
        }
        element.financialOutDebtWithConvert = String(Number(element.firstPartComposedFinancialOutDebt)+Number(element.secondPartComposedFinancialOutDebt));
      }

      this.defaultTotalOutDebts += Number(element.financialOutDebtWithConvert);

      if (this.defaultTotalOutDebts.toString().length > 4) {

        this.customTotalOutDebts = this.defaultTotalOutDebts / 1000;
        if (String(this.customTotalOutDebts).includes(".")){
          const customTotalOutDebts = String(this.customTotalOutDebts).split('.');
          if (customTotalOutDebts[1].length == 1) this.totalOutDebts = customTotalOutDebts[0] + "DT." + customTotalOutDebts[1] + "00Mill";
          else if (customTotalOutDebts[1].length == 2) this.totalOutDebts = customTotalOutDebts[0] + "DT." + customTotalOutDebts[1] + "0Mill";
          else this.totalOutDebts = customTotalOutDebts[0] + "DT." + customTotalOutDebts[1] + "Mill";
        } else {
          this.totalOutDebts = String(this.customTotalOutDebts) + "DT";
        }
      } else {
        this.totalOutDebts = this.defaultTotalOutDebts + "Mill";
      }
    });
  }

  getTotalInDebtsToPayThisMonth() {
    this.defaultTotalInDebtsToPayThisMonth = 0;
    this.customTotalInDebtsToPayThisMonth = 0;
    this.totalInDebtsToPayThisMonth = "";

    this.allDebts.filter(debt => (debt.debtForPay == true) && (debt.toPayThisMonth == true)).forEach(element => {

      if (element.financialDebt.indexOf("DT") !== -1) {
        element.debtWithConvertToPayThisMonth = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
        element.debtWithConvertToPayThisMonth = element.debtWithConvertToPayThisMonth + '000';

      }
      if (element.financialDebt.indexOf("Mill") !== -1) {
        element.debtWithConvertToPayThisMonth = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));

      }
      if (element.financialDebt.includes(".")){
        const composedDebtToPayThisMonth = element.financialDebt.split('.');
        if (composedDebtToPayThisMonth[0].indexOf("DT") !== -1) {
          element.firstPartComposedDebtWithConvertToPayThisMonth = composedDebtToPayThisMonth[0].substring(0, composedDebtToPayThisMonth[0].lastIndexOf("DT"));
          element.firstPartComposedDebtWithConvertToPayThisMonth = element.firstPartComposedDebtWithConvertToPayThisMonth + '000';
        }
        if (composedDebtToPayThisMonth[1].indexOf("Mill") !== -1) {
          element.secondPartComposedDebtWithConvertToPayThisMonth = composedDebtToPayThisMonth[1].substring(0, composedDebtToPayThisMonth[1].lastIndexOf("Mill"));
        }
        element.debtWithConvertToPayThisMonth = String(Number(element.firstPartComposedDebtWithConvertToPayThisMonth)+Number(element.secondPartComposedDebtWithConvertToPayThisMonth));

      }

      this.defaultTotalInDebtsToPayThisMonth += Number(element.debtWithConvertToPayThisMonth);


      if (this.defaultTotalInDebtsToPayThisMonth.toString().length > 4) {

        this.customTotalInDebtsToPayThisMonth = this.defaultTotalInDebtsToPayThisMonth / 1000;

        if (String(this.customTotalInDebtsToPayThisMonth).includes(".")){
          const customTotalInDebtsToPayThisMonth = String(this.customTotalInDebtsToPayThisMonth).split('.');

          if (customTotalInDebtsToPayThisMonth[1].length == 1) this.totalInDebtsToPayThisMonth = customTotalInDebtsToPayThisMonth[0] + "DT." + customTotalInDebtsToPayThisMonth[1] + "00Mill";
          else if (customTotalInDebtsToPayThisMonth[1].length == 2) this.totalInDebtsToPayThisMonth = customTotalInDebtsToPayThisMonth[0] + "DT." + customTotalInDebtsToPayThisMonth[1] + "0Mill";
          else this.totalInDebtsToPayThisMonth = customTotalInDebtsToPayThisMonth[0] + "DT." + customTotalInDebtsToPayThisMonth[1] + "Mill";
        } else {
          this.totalInDebtsToPayThisMonth = String(this.customTotalInDebtsToPayThisMonth) + "DT";

        }
      } else {
        this.totalInDebtsToPayThisMonth = this.defaultTotalInDebtsToPayThisMonth + "Mill";
      }
    });
  }

  getTotalInDebtsToPayNextMonth() {
    this.defaultTotalInDebtsToPayNextMonth = 0;
    this.customTotalInDebtsToPayNextMonth = 0;
    this.totalInDebtsToPayNextMonth = "";

    this.allDebts.filter(debt => (debt.debtForPay == true) && (debt.toPayNextMonth == true)).forEach(element => {

      if (element.financialDebt.indexOf("DT") !== -1) {
        element.debtWithConvertToPayNextMonth = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
        element.debtWithConvertToPayNextMonth = element.debtWithConvertToPayNextMonth + '000';

      }
      if (element.financialDebt.indexOf("Mill") !== -1) {
        element.debtWithConvertToPayNextMonth = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));

      }
      if (element.financialDebt.includes(".")){
        const composedDebtToPayNextMonth = element.financialDebt.split('.');
        if (composedDebtToPayNextMonth[0].indexOf("DT") !== -1) {
          element.firstPartComposedDebtWithConvertToPayNextMonth = composedDebtToPayNextMonth[0].substring(0, composedDebtToPayNextMonth[0].lastIndexOf("DT"));
          element.firstPartComposedDebtWithConvertToPayNextMonth = element.firstPartComposedDebtWithConvertToPayNextMonth + '000';
        }
        if (composedDebtToPayNextMonth[1].indexOf("Mill") !== -1) {
          element.secondPartComposedDebtWithConvertToPayNextMonth = composedDebtToPayNextMonth[1].substring(0, composedDebtToPayNextMonth[1].lastIndexOf("Mill"));
        }
        element.debtWithConvertToPayNextMonth = String(Number(element.firstPartComposedDebtWithConvertToPayNextMonth)+Number(element.secondPartComposedDebtWithConvertToPayNextMonth));

      }

      this.defaultTotalInDebtsToPayNextMonth += Number(element.debtWithConvertToPayNextMonth);


      if (this.defaultTotalInDebtsToPayNextMonth.toString().length > 4) {

        this.customTotalInDebtsToPayNextMonth = this.defaultTotalInDebtsToPayNextMonth / 1000;

        if (String(this.customTotalInDebtsToPayNextMonth).includes(".")){
          const customTotalInDebtsToPayNextMonth = String(this.customTotalInDebtsToPayNextMonth).split('.');

          if (customTotalInDebtsToPayNextMonth[1].length == 1) this.totalInDebtsToPayNextMonth = customTotalInDebtsToPayNextMonth[0] + "DT." + customTotalInDebtsToPayNextMonth[1] + "00Mill";
          else if (customTotalInDebtsToPayNextMonth[1].length == 2) this.totalInDebtsToPayNextMonth = customTotalInDebtsToPayNextMonth[0] + "DT." + customTotalInDebtsToPayNextMonth[1] + "0Mill";
          else this.totalInDebtsToPayNextMonth = customTotalInDebtsToPayNextMonth[0] + "DT." + customTotalInDebtsToPayNextMonth[1] + "Mill";
        } else {
          this.totalInDebtsToPayNextMonth = String(this.customTotalInDebtsToPayNextMonth) + "DT";

        }
      } else {
        this.totalInDebtsToPayNextMonth = this.defaultTotalInDebtsToPayNextMonth + "Mill";
      }
    });
  }

  getTotalInDebtsNotToPayForNow() {
    this.defaultTotalInDebtsNotToPayForNow = 0;
    this.customTotalInDebtsNotToPayForNow = 0;
    this.totalInDebtsNotToPayForNow = "";

    this.allDebts.filter(debt => (debt.debtForPay == true) && (debt.notToPayForNow == true)).forEach(element => {

      if (element.financialDebt.indexOf("DT") !== -1) {
        element.debtWithConvertNotToPayForNow = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
        element.debtWithConvertNotToPayForNow = element.debtWithConvertNotToPayForNow + '000';

      }
      if (element.financialDebt.indexOf("Mill") !== -1) {
        element.debtWithConvertNotToPayForNow = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));

      }
      if (element.financialDebt.includes(".")){
        const composedDebtNotToPayForNow = element.financialDebt.split('.');
        if (composedDebtNotToPayForNow[0].indexOf("DT") !== -1) {
          element.firstPartComposedDebtWithConvertNotToPayForNow = composedDebtNotToPayForNow[0].substring(0, composedDebtNotToPayForNow[0].lastIndexOf("DT"));
          element.firstPartComposedDebtWithConvertNotToPayForNow = element.firstPartComposedDebtWithConvertNotToPayForNow + '000';
        }
        if (composedDebtNotToPayForNow[1].indexOf("Mill") !== -1) {
          element.secondPartComposedDebtWithConvertNotToPayForNow = composedDebtNotToPayForNow[1].substring(0, composedDebtNotToPayForNow[1].lastIndexOf("Mill"));
        }
        element.debtWithConvertNotToPayForNow = String(Number(element.firstPartComposedDebtWithConvertNotToPayForNow)+Number(element.secondPartComposedDebtWithConvertNotToPayForNow));

      }

      this.defaultTotalInDebtsNotToPayForNow += Number(element.debtWithConvertNotToPayForNow);


      if (this.defaultTotalInDebtsNotToPayForNow.toString().length > 4) {

        this.customTotalInDebtsNotToPayForNow = this.defaultTotalInDebtsNotToPayForNow / 1000;

        if (String(this.customTotalInDebtsNotToPayForNow).includes(".")){
          const customTotalInDebtsNotToPayForNow = String(this.customTotalInDebtsNotToPayForNow).split('.');

          if (customTotalInDebtsNotToPayForNow[1].length == 1) this.totalInDebtsNotToPayForNow = customTotalInDebtsNotToPayForNow[0] + "DT." + customTotalInDebtsNotToPayForNow[1] + "00Mill";
          else if (customTotalInDebtsNotToPayForNow[1].length == 2) this.totalInDebtsNotToPayForNow = customTotalInDebtsNotToPayForNow[0] + "DT." + customTotalInDebtsNotToPayForNow[1] + "0Mill";
          else this.totalInDebtsNotToPayForNow = customTotalInDebtsNotToPayForNow[0] + "DT." + customTotalInDebtsNotToPayForNow[1] + "Mill";
        } else {
          this.totalInDebtsNotToPayForNow = String(this.customTotalInDebtsNotToPayForNow) + "DT";

        }
      } else {
        this.totalInDebtsNotToPayForNow = this.defaultTotalInDebtsNotToPayForNow + "Mill";
      }
    });
  }

  getTotalOutDebtsToGetThisMonth() {
    this.defaultTotalInDebtsToGetThisMonth = 0;
    this.customTotalInDebtsToGetThisMonth = 0;
    this.totalOutDebtsToGetThisMonth = "";

    this.allDebts.filter(debt => (debt.debtToGet == true) && (debt.toGetThisMonth == true)).forEach(element => {

      if (element.financialDebt.indexOf("DT") !== -1) {
        element.debtWithConvertToGetThisMonth = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
        element.debtWithConvertToGetThisMonth = element.debtWithConvertToGetThisMonth + '000';

      }
      if (element.financialDebt.indexOf("Mill") !== -1) {
        element.debtWithConvertToGetThisMonth = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));

      }
      if (element.financialDebt.includes(".")){
        const composedDebtToGetThisMonth = element.financialDebt.split('.');
        if (composedDebtToGetThisMonth[0].indexOf("DT") !== -1) {
          element.firstPartComposedDebtWithConvertToGetThisMonth = composedDebtToGetThisMonth[0].substring(0, composedDebtToGetThisMonth[0].lastIndexOf("DT"));
          element.firstPartComposedDebtWithConvertToGetThisMonth = element.firstPartComposedDebtWithConvertToGetThisMonth + '000';
        }
        if (composedDebtToGetThisMonth[1].indexOf("Mill") !== -1) {
          element.secondPartComposedDebtWithConvertToGetThisMonth = composedDebtToGetThisMonth[1].substring(0, composedDebtToGetThisMonth[1].lastIndexOf("Mill"));
        }
        element.debtWithConvertToGetThisMonth = String(Number(element.firstPartComposedDebtWithConvertToGetThisMonth)+Number(element.secondPartComposedDebtWithConvertToGetThisMonth));

      }

      this.defaultTotalInDebtsToGetThisMonth += Number(element.debtWithConvertToGetThisMonth);


      if (this.defaultTotalInDebtsToGetThisMonth.toString().length > 4) {

        this.customTotalInDebtsToGetThisMonth = this.defaultTotalInDebtsToGetThisMonth / 1000;

        if (String(this.customTotalInDebtsToGetThisMonth).includes(".")){
          const customTotalInDebtsToGetThisMonth = String(this.customTotalInDebtsToGetThisMonth).split('.');

          if (customTotalInDebtsToGetThisMonth[1].length == 1) this.totalOutDebtsToGetThisMonth = customTotalInDebtsToGetThisMonth[0] + "DT." + customTotalInDebtsToGetThisMonth[1] + "00Mill";
          else if (customTotalInDebtsToGetThisMonth[1].length == 2) this.totalOutDebtsToGetThisMonth = customTotalInDebtsToGetThisMonth[0] + "DT." + customTotalInDebtsToGetThisMonth[1] + "0Mill";
          else this.totalOutDebtsToGetThisMonth = customTotalInDebtsToGetThisMonth[0] + "DT." + customTotalInDebtsToGetThisMonth[1] + "Mill";
        } else {
          this.totalOutDebtsToGetThisMonth = String(this.customTotalInDebtsToGetThisMonth) + "DT";

        }
      } else {
        this.totalOutDebtsToGetThisMonth = this.defaultTotalInDebtsToGetThisMonth + "Mill";
      }
    });
  }

  getTotalOutDebtsToGetNextMonth() {
    this.defaultTotalInDebtsToGetNextMonth = 0;
    this.customTotalInDebtsToGetNextMonth = 0;
    this.totalOutDebtsToGetNextMonth = "";

    this.allDebts.filter(debt => (debt.debtToGet == true) && (debt.toGetNextMonth == true)).forEach(element => {

      if (element.financialDebt.indexOf("DT") !== -1) {
        element.debtWithConvertToGetNextMonth = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
        element.debtWithConvertToGetNextMonth = element.debtWithConvertToGetNextMonth + '000';

      }
      if (element.financialDebt.indexOf("Mill") !== -1) {
        element.debtWithConvertToGetNextMonth = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));

      }
      if (element.financialDebt.includes(".")){
        const composedDebtToGetNextMonth = element.financialDebt.split('.');
        if (composedDebtToGetNextMonth[0].indexOf("DT") !== -1) {
          element.firstPartComposedDebtWithConvertToGetNextMonth = composedDebtToGetNextMonth[0].substring(0, composedDebtToGetNextMonth[0].lastIndexOf("DT"));
          element.firstPartComposedDebtWithConvertToGetNextMonth = element.firstPartComposedDebtWithConvertToGetNextMonth + '000';
        }
        if (composedDebtToGetNextMonth[1].indexOf("Mill") !== -1) {
          element.secondPartComposedDebtWithConvertToGetNextMonth = composedDebtToGetNextMonth[1].substring(0, composedDebtToGetNextMonth[1].lastIndexOf("Mill"));
        }
        element.debtWithConvertToGetNextMonth = String(Number(element.firstPartComposedDebtWithConvertToGetNextMonth)+Number(element.secondPartComposedDebtWithConvertToGetNextMonth));

      }

      this.defaultTotalInDebtsToGetNextMonth += Number(element.debtWithConvertToGetNextMonth);


      if (this.defaultTotalInDebtsToGetNextMonth.toString().length > 4) {

        this.customTotalInDebtsToGetNextMonth = this.defaultTotalInDebtsToGetNextMonth / 1000;

        if (String(this.customTotalInDebtsToGetNextMonth).includes(".")){
          const customTotalInDebtsToGetNextMonth = String(this.customTotalInDebtsToGetNextMonth).split('.');

          if (customTotalInDebtsToGetNextMonth[1].length == 1) this.totalOutDebtsToGetNextMonth = customTotalInDebtsToGetNextMonth[0] + "DT." + customTotalInDebtsToGetNextMonth[1] + "00Mill";
          else if (customTotalInDebtsToGetNextMonth[1].length == 2) this.totalOutDebtsToGetNextMonth = customTotalInDebtsToGetNextMonth[0] + "DT." + customTotalInDebtsToGetNextMonth[1] + "0Mill";
          else this.totalOutDebtsToGetNextMonth = customTotalInDebtsToGetNextMonth[0] + "DT." + customTotalInDebtsToGetNextMonth[1] + "Mill";
        } else {
          this.totalOutDebtsToGetNextMonth = String(this.customTotalInDebtsToGetNextMonth) + "DT";

        }
      } else {
        this.totalOutDebtsToGetNextMonth = this.defaultTotalInDebtsToGetNextMonth + "Mill";
      }
    });
  }

  getTotalOutDebtsNotToGetForNow() {
    this.defaultTotalInDebtsNotToGetForNow = 0;
    this.customTotalInDebtsNotToGetForNow = 0;
    this.totalOutDebtsNotToGetForNow = "";

    this.allDebts.filter(debt => (debt.debtToGet == true) && (debt.notToGetForNow == true)).forEach(element => {

      if (element.financialDebt.indexOf("DT") !== -1) {
        element.debtWithConvertNotToGetForNow = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
        element.debtWithConvertNotToGetForNow = element.debtWithConvertNotToGetForNow + '000';

      }
      if (element.financialDebt.indexOf("Mill") !== -1) {
        element.debtWithConvertNotToGetForNow = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));

      }
      if (element.financialDebt.includes(".")){
        const composedDebtNotToGetForNow = element.financialDebt.split('.');
        if (composedDebtNotToGetForNow[0].indexOf("DT") !== -1) {
          element.firstPartComposedDebtWithConvertNotToGetForNow = composedDebtNotToGetForNow[0].substring(0, composedDebtNotToGetForNow[0].lastIndexOf("DT"));
          element.firstPartComposedDebtWithConvertNotToGetForNow = element.firstPartComposedDebtWithConvertNotToGetForNow + '000';
        }
        if (composedDebtNotToGetForNow[1].indexOf("Mill") !== -1) {
          element.secondPartComposedDebtWithConvertNotToGetForNow = composedDebtNotToGetForNow[1].substring(0, composedDebtNotToGetForNow[1].lastIndexOf("Mill"));
        }
        element.debtWithConvertNotToGetForNow = String(Number(element.firstPartComposedDebtWithConvertNotToGetForNow)+Number(element.secondPartComposedDebtWithConvertNotToGetForNow));

      }

      this.defaultTotalInDebtsNotToGetForNow += Number(element.debtWithConvertNotToGetForNow);


      if (this.defaultTotalInDebtsNotToGetForNow.toString().length > 4) {

        this.customTotalInDebtsNotToGetForNow = this.defaultTotalInDebtsNotToGetForNow / 1000;

        if (String(this.customTotalInDebtsNotToGetForNow).includes(".")){
          const customTotalInDebtsNotToGetForNow = String(this.customTotalInDebtsNotToGetForNow).split('.');

          if (customTotalInDebtsNotToGetForNow[1].length == 1) this.totalOutDebtsNotToGetForNow = customTotalInDebtsNotToGetForNow[0] + "DT." + customTotalInDebtsNotToGetForNow[1] + "00Mill";
          else if (customTotalInDebtsNotToGetForNow[1].length == 2) this.totalOutDebtsNotToGetForNow = customTotalInDebtsNotToGetForNow[0] + "DT." + customTotalInDebtsNotToGetForNow[1] + "0Mill";
          else this.totalOutDebtsNotToGetForNow = customTotalInDebtsNotToGetForNow[0] + "DT." + customTotalInDebtsNotToGetForNow[1] + "Mill";
        } else {
          this.totalOutDebtsNotToGetForNow = String(this.customTotalInDebtsNotToGetForNow) + "DT";

        }
      } else {
        this.totalOutDebtsNotToGetForNow = this.defaultTotalInDebtsNotToGetForNow + "Mill";
      }
    });
  }

  showRest(contentRestMoneyForeachPlace, e: Event) {
    e.stopPropagation();

    if (this.isMobile) {
      this.dialogService.open(contentRestMoneyForeachPlace, {
        width: '98vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    } else {
      this.dialogService.open(contentRestMoneyForeachPlace, {
        width: '18vw',
        height:'50vh',
        maxWidth: '100vw'
      });
    }  
  }

  showTotalInDebtsDet(contentTotalInDebtsDet, e: Event) {
    e.stopPropagation();

    if (this.isMobile) {
      this.dialogService.open(contentTotalInDebtsDet, {
        width: '98vw',
        height:'50vh',
        maxWidth: '100vw'
      });
    } else {
      this.dialogService.open(contentTotalInDebtsDet, {
        width: '20vw',
        height:'35vh',
        maxWidth: '100vw'
      });
    }  
  }

  showTotalOutDebtsDet(contentTotalOutDebtsDet, e: Event) {
    e.stopPropagation();

    if (this.isMobile) {
      this.dialogService.open(contentTotalOutDebtsDet, {
        width: '98vw',
        height:'50vh',
        maxWidth: '100vw'
      });
    } else {
      this.dialogService.open(contentTotalOutDebtsDet, {
        width: '20vw',
        height:'35vh',
        maxWidth: '100vw'
      });
    }  
  }

  getAllClockingsStatistics() {
    this.subscriptionForGetAllClockings = this.clockingService
    .getAll()
    .subscribe((clockings: Clocking[]) => {

      this.clockingsList = clockings.filter(clocking => clocking.dateClocking.split('-')[1] == String(new Date().getMonth()+ 1)).sort((n1, n2) => n2.numRefClocking - n1.numRefClocking);
  
      this.minutePartList = [];
      if (this.clockingsList.length > 0) {
        this.clockingsList.forEach(clocking => {
          if (clocking.timeClocking > '08:00') this.calculTotalClockingLate(clocking.timeClocking);
        })
      } else {
        this.totalClockingLate = 0;
        this.totalClockingLateByHoursMinute = '0 Min';
      }   
    });                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
  }

  calculTotalClockingLate(timeClocking: string) {
    const composedFinancialDebt = timeClocking.split(':');
    this.minutePartList.push(Number(composedFinancialDebt[1]))
    this.sumClockingLate = this.minutePartList.reduce((accumulator, current) => {return accumulator + current;}, 0);
    if (this.sumClockingLate < 60) {this.totalClockingLate = this.sumClockingLate;}
    else {
      let hours = Math.floor(this.sumClockingLate / 60);
      let minutes = this.sumClockingLate - (hours * 60);
      this.totalClockingLateByHoursMinute = hours +"H "+ minutes +"Min";
    }
  }

  getToDoListsStatistics() {
    this.subscriptionForGetTodayWork = this.toDoToday.subscribe(res => {
      this.taskListForToday = res.sort((n1, n2) => n2.orderNo - n1.orderNo);
      this.taskListForToday.forEach((task, index) => {
        task.indexNo = index + 1;
      })
      this.nbrTodayTask = res.length;
    })

    this.subscriptionForGetTomorrowWork = this.toDoTomorrow.subscribe(res => {
      this.taskListForTomorrow = res.sort((n1, n2) => n2.orderNo - n1.orderNo);
      this.taskListForTomorrow.forEach((task, index) => {
        task.indexNo = index + 1;
      })
      this.nbrTomorrowTask = res.length;
    })

    this.subscriptionForGetThisWeekWork = this.toDoThisWeek.subscribe(res => {
      this.taskListForThisWeek = res.sort((n1, n2) => n2.orderNo - n1.orderNo);
      this.taskListForThisWeek.forEach((task, index) => {
        task.indexNo = index + 1;
      })
      this.nbrThisWeekTask = res.length;
    })

    this.subscriptionForGetNextWeekWork = this.toDoNextWeek.subscribe(res => {
      this.taskListForNextWeek = res.sort((n1, n2) => n2.orderNo - n1.orderNo);
      this.taskListForNextWeek.forEach((task, index) => {
        task.indexNo = index + 1;
      })
      this.nbrNextWeekTaskList = res.length;
    })

    this.subscriptionForGetLaterWork = this.toDoLater.subscribe(res => {
      this.laterTaskList = res.sort((n1, n2) => n2.orderNo - n1.orderNo);
      this.laterTaskList.forEach((task, index) => {
        task.indexNo = index + 1;
      })
      this.nbrLaterTaskList = res.length;
    })
  }

  showListMoviesByStatus(status: number, contentListMoviesByStatus, e: Event) {
    e.stopPropagation();
    this.currentStatusForMovie = status;

    if (this.isMobile) {
      this.dialogService.open(contentListMoviesByStatus, {
        width: '98vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    } else {
      this.dialogService.open(contentListMoviesByStatus, {
        width: '35vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    }    
  }

  showListAnimesByStatus(status: number, contentListAnimesByStatus, e: Event) {
    e.stopPropagation();
    this.currentStatusForAnime = status;

    if (this.isMobile) {
      this.dialogService.open(contentListAnimesByStatus, {
        width: '98vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    } else {
      this.dialogService.open(contentListAnimesByStatus, {
        width: '35vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    }    
  }

  showListSeriesByStatus(status: number, contentListSeriesByStatus, e: Event) {
    e.stopPropagation();
    this.currentStatusForSerie = status;

    if (this.isMobile) {
      this.dialogService.open(contentListSeriesByStatus, {
        width: '98vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    } else {
      this.dialogService.open(contentListSeriesByStatus, {
        width: '35vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    }    
  }

  showListFilesByType(type: number, contentListFilesByType, e: Event) {
    e.stopPropagation();
    this.fileByType = type;

    if (this.isMobile) {
      this.dialogService.open(contentListFilesByType, {
        width: '98vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    } else {
      this.dialogService.open(contentListFilesByType, {
        width: '35vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    }   
  }

  showTaskList(status: number, contentTaskList, e: Event) {
    e.stopPropagation();
    this.tasksByStatus = status;

    if (this.tasksByStatus == 1) this.tasksListByStatus = this.taskListForToday;

    else if (this.tasksByStatus == 2) this.tasksListByStatus = this.taskListForTomorrow;

    else if (this.tasksByStatus == 3) this.tasksListByStatus = this.taskListForThisWeek;

    else if (this.tasksByStatus == 4) this.tasksListByStatus = this.taskListForNextWeek;

    else this.tasksListByStatus = this.laterTaskList;

    if (this.isMobile) {
      this.dialogService.open(contentTaskList, {
        width: '98vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    } else {
      this.dialogService.open(contentTaskList, {
        width: '35vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    }   
  }

  showUsersList(status: number, contentUsersList, e: Event) {
    e.stopPropagation();
    this.usersByStatus = status;

    if (this.usersByStatus == 1) this.usersListByStatus = this.totalUsers;

    else if (this.usersByStatus == 2) this.usersListByStatus = this.totalUsersConnected;

    else this.usersListByStatus = this.totalUsersNotConnected;

    if (this.isMobile) {
      this.dialogService.open(contentUsersList, {
        width: '98vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    } else {
      this.dialogService.open(contentUsersList, {
        width: '35vw',
        height:'70vh',
        maxWidth: '100vw'
      });
    }   
  }

  showLinksList(contentLinks, e: Event) {
    e.stopPropagation();
    this.content = '';
    this.angularContext = false;
    this.otherContext = false;
    if (this.isMobile) {
      this.dialogService.open(contentLinks, {
        width: '98vw',
        height:'85vh',
        maxWidth: '100vw'
      });
    } else {
      this.dialogService.open(contentLinks, {
        width: '30vw',
        height:'85vh',
        maxWidth: '100vw'
      });
    } 
  }

  getAllLinks() {
    this.subscriptionForGetAllLinks = this.linkService
    .getAll()
    .subscribe(links => {

      this.dataSourceCopie.data = links.sort((n1, n2) => n2.numRefLink - n1.numRefLink);

      if (this.angularContext) {
        if (this.content) this.filterLinksList(1, this.content);
        else this.filterLinksList(1);
      } 
      
      else if (this.otherContext) {
        if (this.content) this.filterLinksList(2, this.content);
        else this.filterLinksList(2);
      } 

      else if (this.content && (!this.angularContext || !this.otherContext)) {
        this.dataSource.data = this.dataSourceCopie.data.filter(link => link.content.toLowerCase().includes(this.content.toLowerCase()));
      }

      else this.dataSource.data = this.dataSourceCopie.data;

      this.dataSource.paginator = this.paginator;

    });
  }

  filterLinksList(refLinkContent?: number, linkContent?: string) {
    if (linkContent) {
      this.dataSource.data = this.dataSourceCopie.data.filter(link => (link.typeLinkId == refLinkContent) && (link.content.toLowerCase().includes(linkContent.toLowerCase())));
    } else {
      this.dataSource.data = this.dataSourceCopie.data.filter(link => link.typeLinkId == refLinkContent);
    }
    this.dataSource.paginator = this.paginator;
  }

  checkAngularContext() {
    if (this.angularContext == true) this.otherContext = false;
    if (this.content) this.content = '';
    this.getAllLinks();
  }

  checkotherContext() {
    if (this.otherContext == true) this.angularContext = false;
    if (this.content) this.content = '';
    this.getAllLinks();
  }

  newLink() {
    if (this.isMobile) {
      const dialogRef = this.dialogService.open(NewOrEditLinkComponent, {
        width: '98vw',
        height:'40vh',
        maxWidth: '100vw'
      });

      dialogRef.componentInstance.typeLinkId = this.angularContext ? 1 : 2;
      dialogRef.componentInstance.arrayLinks = this.dataSourceCopie.data;
      dialogRef.componentInstance.isMobile = this.isMobile;
      dialogRef.componentInstance.modalRef = dialogRef;
    } else {
      const dialogRef = this.dialogService.open(NewOrEditLinkComponent, {
        width: '25vw',
        height:'33vh',
        maxWidth: '100vw'
      });

      dialogRef.componentInstance.typeLinkId = this.angularContext ? 1 : 2;
      dialogRef.componentInstance.arrayLinks = this.dataSourceCopie.data;
      dialogRef.componentInstance.isMobile = this.isMobile;
      dialogRef.componentInstance.modalRef = dialogRef;
    }
  }

  editLink(link?: Link) {
    if (this.isMobile) {
      const dialogRef = this.dialogService.open(NewOrEditLinkComponent, {
        width: '98vw',
        height:'40vh',
        maxWidth: '100vw'
      });
      
      dialogRef.componentInstance.link = link;
      dialogRef.componentInstance.isMobile = this.isMobile;
      dialogRef.componentInstance.modalRef = dialogRef;

    } else {
      const dialogRef = this.dialogService.open(NewOrEditLinkComponent, {
        width: '25vw',
        height:'33vh',
        maxWidth: '100vw'
      });

      dialogRef.componentInstance.link = link;
      dialogRef.componentInstance.isMobile = this.isMobile;
      dialogRef.componentInstance.modalRef = dialogRef;
    }
  }

  openDeleteLinkModal(link: Link, contentDeleteLink) {
    this.linkToDelete = link;
    if (this.isMobile) {
      this.modalRefDeleteLink =  this.dialogService.open(contentDeleteLink, {
        width: '98vw',
       height:'40vh',
       maxWidth: '100vw'
     });
   } else {
    this.modalRefDeleteLink =  this.dialogService.open(contentDeleteLink, {
      width: '30vw',
      height:'30vh',
      maxWidth: '100vw'
    }); 
   }
  }

  confirmDelete() {
    this.linkService.delete(this.linkToDelete.key);
  }

  close() {
    this.modalRefDeleteLink.close();
  }

  shareLink(link: Link) {
    if (this.isMobile) {
      if (!this.ngNavigatorShareService.canShare()) {
        alert(`This service/api is not supported in your Browser`);
        return;
      }

      this.ngNavigatorShareService.share({
        title: link.content,
        text: '',
        url: link.path
      }).then( (response) => {
        console.log(response);
      })
      .catch( (error) => {
        console.log(error);
      });
    } else
    window.open("https://web.whatsapp.com/send?text=" + link.path,'_blank');
  }

  ngOnDestroy() {
    this.subscripton.unsubscribe();
    this.subscriptionForGetAllMovies.unsubscribe();
    this.subscriptionForGetAllAnimes.unsubscribe();
    this.subscriptionForGetAllSeries.unsubscribe();
    this.subscriptionForGetAllFiles.unsubscribe();
    this.subscriptionForGetAllDebts.unsubscribe();
    this.subscriptionForGetTodayWork.unsubscribe();
    this.subscriptionForGetTomorrowWork.unsubscribe();
    this.subscriptionForGetThisWeekWork.unsubscribe();
    this.subscriptionForGetNextWeekWork.unsubscribe();
    this.subscriptionForGetLaterWork.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
    this.subscriptionForGetAllLinks.unsubscribe();
    this.subscriptionForGetAllClockings.unsubscribe();
  }
  
}