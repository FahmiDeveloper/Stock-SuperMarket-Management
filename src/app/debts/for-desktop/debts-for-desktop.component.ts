import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { Subscription } from 'rxjs';

import Swal from 'sweetalert2';

import { DebtFormDesktopComponent } from './debt-form-desktop/debt-form-desktop.component';

import { AuthService } from '../../shared/services/auth.service';
import { DebtService } from '../../shared/services/debt.service';
import { UserService } from '../../shared/services/user.service';
import { UsersListService } from '../../shared/services/list-users.service';

import { Debt, PlacesMoney, StatusInDebts, StatusOutDebts } from '../../shared/models/debt.model';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'debts-for-desktop',
  templateUrl: './debts-for-desktop.component.html',
  styleUrls: ['./debts-for-desktop.scss']
})

export class DebtsForDesktopComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Debt>();
  dataSourceCopie = new MatTableDataSource<Debt>();
  displayedColumns: string[] = ['debtor', 'creditor', 'debt', 'rest', 'date', 'place', 'status', 'note', 'star'];
  filteredDebtsByPlaceAndDebtForPay: Debt[];
  filteredDebtsByPlaceAndDebtToGet: Debt[];

  debtsList: Debt[] = [];
  pagedList: Debt[]= [];
  length: number = 0;
  
  creditors: string[] = [];
  creditorName: string ='';
  debtors: string[] = [];
  debtorName: string ='';

  sortByDesc: boolean = true;
  isLoading: boolean;
  restInPocket: string = '';
  restInWallet: string = '';
  restInEnvelope: string = '';
  restInBox: string = '';
  restInPosteAccount: string = '';
  placeId: number;
  getInDebt: boolean = false;
  getOutDebt: boolean = false;
  statusOutDebtId: number;
  statusInDebtId: number;
  
  //in debt attributes
  totalInDebts: string = '';
  defaultTotalInDebts: number;
  customTotalInDebts: number;
  totalInDebtsByCreditor: string;
  customTotalInDebtsByCreditor: number;
  defaultTotalInDebtsByCreditor: number;

   //out debt attributes
  totalOutDebts: string = '';
  defaultTotalOutDebts: number;
  customTotalOutDebts: number;
  totalOutDebtsByDebtor: string;
  defaultTotalOutDebtsByDebtor: number;
  customTotalOutDebtsByDebtor: number;

  modalRefLodaing: any;
  isDesktop: boolean;
  isTablet: boolean;

  @ViewChild(MatMenuTrigger) contextMenu: MatMenuTrigger;

  subscriptionForGetAllDebts: Subscription;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  placesMoney: PlacesMoney[] = [
    {id: 1, place: 'الجيب'},
    {id: 2, place: 'المحفظة'},
    {id: 3, place: 'الظرف'}, 
    {id: 4, place: 'الصندوق'},
    {id: 5, place: 'دين'},
    {id: 6, place: 'الحساب البريدي'}
  ];

  statusInDebts: StatusInDebts[] = [
    {id: 1, status: 'Pay this month'},
    {id: 2, status: 'Pay next month'},
    {id: 3, status: 'Pay will be delayed'}
  ];

  statusOutDebts: StatusOutDebts[] = [
    {id: 1, status: 'Get this month'},
    {id: 2, status: 'Get next month'},
    {id: 3, status: 'Get will be delayed'}
  ];

  constructor(
    private debtService: DebtService, 
    public userService: UserService,
    public usersListService: UsersListService,
    public authService: AuthService,
    public dialogService: MatDialog,
    private deviceService: DeviceDetectorService
  ) {}

  ngOnInit() {
    this.isDesktop = this.deviceService.isDesktop();
    this.isTablet = this.deviceService.isTablet();

    if (this.isDesktop) {this.getAllDebtsForDesktop();}
    else {this.getAllDebtsForTablet();}
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllDebtsForDesktop() {
    this.subscriptionForGetAllDebts = this.debtService
    .getAll()
    .subscribe(debts => {
      this.dataSourceCopie.data = debts.sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
     if (this.placeId) {
        this.dataSource.data = debts.filter(debt => debt.placeId == this.placeId).sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        if (this.placeId == 5) {
          if (this.getInDebt == true) this.showInDebt();
          if (this.getOutDebt == true) this.showOutDebt();
        } else this.getRestMoneyForeachPlace();
      } else this.dataSource.data = debts.sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
      this.getPlaceDebt();
    });
  }

  getAllDebtsForTablet() {
    this.subscriptionForGetAllDebts = this.debtService
    .getAll()
    .subscribe(debts => {
      this.dataSourceCopie.data = debts.sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
     if (this.placeId) {
        this.debtsList = debts.filter(debt => debt.placeId == this.placeId).sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        if (this.placeId == 5) {
          if (this.getInDebt == true) this.showInDebt();
          if (this.getOutDebt == true) this.showOutDebt();
        } else this.getRestMoneyForeachPlace();
      } else this.debtsList = debts.sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);

      this.pagedList = this.debtsList.slice(0, 6);
      this.length = this.debtsList.length;

      this.getPlaceDebt();
    });
  }

  OnPageChangeForDesktop(event: PageEvent){
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  OnPageChangeForTablet(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedList = this.debtsList.slice(startIndex, endIndex);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  showInDebt() {
    if (this.getInDebt == true) {
      this.getOutDebt = false;
      this.statusOutDebtId = null;
      this.creditors = [];
      this.debtorName = '';
      this.getTotalIntDebts();
      if (this.isDesktop) {
        this.dataSource.data = this.dataSourceCopie.data
        .filter(debt => (debt.placeId == this.placeId) && (debt.debtForPay == true))
        .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
      } else {
        this.debtsList = this.dataSourceCopie.data
        .filter(debt => (debt.placeId == this.placeId) && (debt.debtForPay == true))
        .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        this.pagedList = this.debtsList.slice(0, 6);
        this.length = this.debtsList.length;
      }
      this.filteredDebtsByPlaceAndDebtForPay = this.dataSourceCopie.data
      .filter(debt => (debt.placeId == this.placeId) && (debt.debtForPay == true))
      .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);

      if (this.statusInDebtId) this.getTotalInDebtsByStatus();
      if (this.creditorName) this.getTotalInDebtsByCreditor();
      this.filteredDebtsByPlaceAndDebtForPay.forEach(element => {
        if (!this.creditors.includes(element.creditor)) {
          this.creditors.push(element.creditor);
        }
      })
    }
  }

  showOutDebt() {
    if (this.getOutDebt == true) {
      this.getInDebt = false;
      this.statusInDebtId = null;
      this.debtors = [];
      this.creditorName = '';
      this.getTotalOutDebts();
      if (this.isDesktop) {
        this.dataSource.data = this.dataSourceCopie.data
        .filter(debt => (debt.placeId == this.placeId) && (debt.debtToGet == true))
        .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
      } else {
        this.debtsList = this.dataSourceCopie.data
        .filter(debt => (debt.placeId == this.placeId) && (debt.debtToGet == true))
        .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        this.pagedList = this.debtsList.slice(0, 6);
        this.length = this.debtsList.length;
      }
      this.filteredDebtsByPlaceAndDebtToGet = this.dataSourceCopie.data
      .filter(debt => (debt.placeId == this.placeId) && (debt.debtToGet == true))
      .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);;
      if (this.statusOutDebtId) this.getTotalOutDebtsByStatus();
      if (this.debtorName) this.getTotalOutDebtsByDebtor();
      this.filteredDebtsByPlaceAndDebtToGet.forEach(element => {
        if (!this.debtors.includes(element.debtor)) {
          this.debtors.push(element.debtor);
        }
      })
    }
  }

  getRestMoneyForeachPlace() {
    let debtForRestInPocket = this.dataSourceCopie.data.filter(debt => debt.placeId == 1).sort((n1, n2) => n2.numRefDebt - n1.numRefDebt)[0];
    let debtForRestInWallet = this.dataSourceCopie.data.filter(debt => debt.placeId == 2).sort((n1, n2) => n2.numRefDebt - n1.numRefDebt)[0];
    let debtForRestInEnvelope = this.dataSourceCopie.data.filter(debt => debt.placeId == 3).sort((n1, n2) => n2.numRefDebt - n1.numRefDebt)[0];
    let debtForRestInBox = this.dataSourceCopie.data.filter(debt => debt.placeId == 4).sort((n1, n2) => n2.numRefDebt - n1.numRefDebt)[0];
    let debtForRestInPosteAccount = this.dataSourceCopie.data.filter(debt => debt.placeId == 6).sort((n1, n2) => n2.numRefDebt - n1.numRefDebt)[0];

    this.restInPocket = debtForRestInPocket ? debtForRestInPocket.restMoney : '0DT';

    this.restInWallet = debtForRestInWallet ? debtForRestInWallet.restMoney : '0DT';

    this.restInEnvelope = debtForRestInEnvelope ? debtForRestInEnvelope.restMoney : '0DT';

    this.restInBox = debtForRestInBox ? debtForRestInBox.restMoney : '0DT';

    this.restInPosteAccount = debtForRestInPosteAccount ? debtForRestInPosteAccount.restMoney : '0DT';
  }

  getPlaceDebt() {
    if (this.isDesktop) {
      this.dataSource.data.forEach(element=>{
        this.placesMoney.forEach(placeMoney => {
          if (placeMoney.id == element.placeId) {
            element.place = placeMoney.place;
          }
        })
      })
    } else {
      this.debtsList.forEach(element=>{
        this.placesMoney.forEach(placeMoney => {
          if (placeMoney.id == element.placeId) {
            element.place = placeMoney.place;
          }
        })
      })
    }
  }

  newDebt() {
    const dialogRef = this.dialogService.open(DebtFormDesktopComponent, {width: '800px', data: {movie: {}}});
    dialogRef.componentInstance.defaultDebts = this.dataSourceCopie.data; 
  }

  editDebt(debt?: Debt) {
    const dialogRef = this.dialogService.open(DebtFormDesktopComponent, {width: '800px'});
    dialogRef.componentInstance.debt = debt;
    dialogRef.componentInstance.dataSource = this.isDesktop ? this.dataSource.data : this.pagedList;

    dialogRef.afterClosed().subscribe(res => {
      if (this.isDesktop) this.dataSource.data = res;
      else this.pagedList = res;
    });
  }

  showRest(contentRestMoneyForeachPlace) {
    this.dialogService.open(contentRestMoneyForeachPlace, {width: '400px'});
    this.getRestMoneyForeachPlace();
  }

  getTotalIntDebts() { 
    this.defaultTotalInDebts = 0;
    this.customTotalInDebts = 0;
    this.totalInDebts = "";
    this.creditors = [];

    this.dataSourceCopie.data.filter(debt => debt.debtForPay == true).forEach(element => {
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

      if (!this.creditors.includes(element.creditor)) {
        this.creditors.push(element.creditor);
      }
    });
  }

  getTotalInDebtsByStatus() {
    this.defaultTotalInDebtsByCreditor = 0;
    this.customTotalInDebtsByCreditor = 0;
    this.totalInDebtsByCreditor = "";

    if (this.isDesktop) {
      if (this.creditorName) {
        if (this.statusInDebtId == 1) {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.toPayThisMonth == true) && (debt.creditor == this.creditorName))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else if (this.statusInDebtId == 2) {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.toPayNextMonth == true) && (debt.creditor == this.creditorName))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.notToPayForNow == true) && (debt.creditor == this.creditorName))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }
      } else {
        if (this.statusInDebtId == 1) {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.toPayThisMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else if (this.statusInDebtId == 2) {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.toPayNextMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }
         else {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.notToPayForNow == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }   
      }
  
      this.dataSource.data.forEach(element => {
  
        if (element.financialDebt.indexOf("DT") !== -1) {
          element.financialInDebtWithConvertByCreditor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
          element.financialInDebtWithConvertByCreditor = element.financialInDebtWithConvertByCreditor + '000';
        }
        if (element.financialDebt.indexOf("Mill") !== -1) {
          element.financialInDebtWithConvertByCreditor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));
        }
        if (element.financialDebt.includes(".")){
          const composedFinancialDebtByCreditor = element.financialDebt.split('.');
          if (composedFinancialDebtByCreditor[0].indexOf("DT") !== -1) {
            element.firstPartComposedFinancialInDebtByCreditor = composedFinancialDebtByCreditor[0].substring(0, composedFinancialDebtByCreditor[0].lastIndexOf("DT"));
            element.firstPartComposedFinancialInDebtByCreditor = element.firstPartComposedFinancialInDebtByCreditor + '000';
          }
          if (composedFinancialDebtByCreditor[1].indexOf("Mill") !== -1) {
            element.secondPartComposedFinancialInDebtByCreditor = composedFinancialDebtByCreditor[1].substring(0, composedFinancialDebtByCreditor[1].lastIndexOf("Mill"));
          }
          element.financialInDebtWithConvertByCreditor = String(Number(element.firstPartComposedFinancialInDebtByCreditor)+Number(element.secondPartComposedFinancialInDebtByCreditor));
        }
  
        this.defaultTotalInDebtsByCreditor += Number(element.financialInDebtWithConvertByCreditor);
        if (this.defaultTotalInDebtsByCreditor.toString().length > 4) {
  
          this.customTotalInDebtsByCreditor = this.defaultTotalInDebtsByCreditor / 1000;
  
          if (String(this.customTotalInDebtsByCreditor).includes(".")){
            const customTotalInDebtsByCreditor = String(this.customTotalInDebtsByCreditor).split('.');
            if (customTotalInDebtsByCreditor[1].length == 1) this.totalInDebtsByCreditor = customTotalInDebtsByCreditor[0] + "DT." + customTotalInDebtsByCreditor[1] + "00Mill";
            else if (customTotalInDebtsByCreditor[1].length == 2) this.totalInDebtsByCreditor = customTotalInDebtsByCreditor[0] + "DT." + customTotalInDebtsByCreditor[1] + "0Mill";
            else this.totalInDebtsByCreditor = customTotalInDebtsByCreditor[0] + "DT." + customTotalInDebtsByCreditor[1] + "Mill";
          } else {
            this.totalInDebtsByCreditor = String(this.customTotalInDebtsByCreditor) + "DT";
          }
        } else {
          this.totalInDebtsByCreditor = this.defaultTotalInDebtsByCreditor + "Mill";
        }
      });
    }
    else {
      if (this.creditorName) {
        if (this.statusInDebtId == 1) {
          this.debtsList = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.toPayThisMonth == true) && (debt.creditor == this.creditorName))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else if (this.statusInDebtId == 2) {
          this.debtsList = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.toPayNextMonth == true) && (debt.creditor == this.creditorName))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else {
          this.debtsList = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.notToPayForNow == true) && (debt.creditor == this.creditorName))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }
      } else {
        if (this.statusInDebtId == 1) {
          this.debtsList = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.toPayThisMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else if (this.statusInDebtId == 2) {
          this.debtsList = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.toPayNextMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }
         else {
          this.debtsList = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.notToPayForNow == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }   
      }

      this.pagedList = this.debtsList.slice(0, 6);
      this.length = this.debtsList.length;
  
      this.debtsList.forEach(element => {
  
        if (element.financialDebt.indexOf("DT") !== -1) {
          element.financialInDebtWithConvertByCreditor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
          element.financialInDebtWithConvertByCreditor = element.financialInDebtWithConvertByCreditor + '000';
        }
        if (element.financialDebt.indexOf("Mill") !== -1) {
          element.financialInDebtWithConvertByCreditor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));
        }
        if (element.financialDebt.includes(".")){
          const composedFinancialDebtByCreditor = element.financialDebt.split('.');
          if (composedFinancialDebtByCreditor[0].indexOf("DT") !== -1) {
            element.firstPartComposedFinancialInDebtByCreditor = composedFinancialDebtByCreditor[0].substring(0, composedFinancialDebtByCreditor[0].lastIndexOf("DT"));
            element.firstPartComposedFinancialInDebtByCreditor = element.firstPartComposedFinancialInDebtByCreditor + '000';
          }
          if (composedFinancialDebtByCreditor[1].indexOf("Mill") !== -1) {
            element.secondPartComposedFinancialInDebtByCreditor = composedFinancialDebtByCreditor[1].substring(0, composedFinancialDebtByCreditor[1].lastIndexOf("Mill"));
          }
          element.financialInDebtWithConvertByCreditor = String(Number(element.firstPartComposedFinancialInDebtByCreditor)+Number(element.secondPartComposedFinancialInDebtByCreditor));
        }
  
        this.defaultTotalInDebtsByCreditor += Number(element.financialInDebtWithConvertByCreditor);
        if (this.defaultTotalInDebtsByCreditor.toString().length > 4) {
  
          this.customTotalInDebtsByCreditor = this.defaultTotalInDebtsByCreditor / 1000;
  
          if (String(this.customTotalInDebtsByCreditor).includes(".")){
            const customTotalInDebtsByCreditor = String(this.customTotalInDebtsByCreditor).split('.');
            if (customTotalInDebtsByCreditor[1].length == 1) this.totalInDebtsByCreditor = customTotalInDebtsByCreditor[0] + "DT." + customTotalInDebtsByCreditor[1] + "00Mill";
            else if (customTotalInDebtsByCreditor[1].length == 2) this.totalInDebtsByCreditor = customTotalInDebtsByCreditor[0] + "DT." + customTotalInDebtsByCreditor[1] + "0Mill";
            else this.totalInDebtsByCreditor = customTotalInDebtsByCreditor[0] + "DT." + customTotalInDebtsByCreditor[1] + "Mill";
          } else {
            this.totalInDebtsByCreditor = String(this.customTotalInDebtsByCreditor) + "DT";
          }
        } else {
          this.totalInDebtsByCreditor = this.defaultTotalInDebtsByCreditor + "Mill";
        }
      });
    }
  }

  getTotalInDebtsByCreditor() {
    this.defaultTotalInDebtsByCreditor = 0;
    this.customTotalInDebtsByCreditor = 0;
    this.totalInDebtsByCreditor = "";

    if (this.isDesktop) {
      if (this.statusInDebtId) {
        if (this.statusInDebtId == 1) {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.creditor == this.creditorName) && (debt.toPayThisMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else if (this.statusInDebtId == 2) {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.creditor == this.creditorName) && (debt.toPayNextMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.creditor == this.creditorName) && (debt.notToPayForNow == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }   
      } else this.dataSource.data = this.filteredDebtsByPlaceAndDebtForPay
      .filter(debt => (debt.creditor == this.creditorName))
      .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
  
      this.dataSource.data.forEach(element => {
  
        if (element.financialDebt.indexOf("DT") !== -1) {
          element.financialInDebtWithConvertByCreditor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
          element.financialInDebtWithConvertByCreditor = element.financialInDebtWithConvertByCreditor + '000';
        }
        if (element.financialDebt.indexOf("Mill") !== -1) {
          element.financialInDebtWithConvertByCreditor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));
        }
        if (element.financialDebt.includes(".")){
          const composedFinancialDebtByCreditor = element.financialDebt.split('.');
          if (composedFinancialDebtByCreditor[0].indexOf("DT") !== -1) {
            element.firstPartComposedFinancialInDebtByCreditor = composedFinancialDebtByCreditor[0].substring(0, composedFinancialDebtByCreditor[0].lastIndexOf("DT"));
            element.firstPartComposedFinancialInDebtByCreditor = element.firstPartComposedFinancialInDebtByCreditor + '000';
          }
          if (composedFinancialDebtByCreditor[1].indexOf("Mill") !== -1) {
            element.secondPartComposedFinancialInDebtByCreditor = composedFinancialDebtByCreditor[1].substring(0, composedFinancialDebtByCreditor[1].lastIndexOf("Mill"));
          }
          element.financialInDebtWithConvertByCreditor = String(Number(element.firstPartComposedFinancialInDebtByCreditor)+Number(element.secondPartComposedFinancialInDebtByCreditor));
        }
  
        this.defaultTotalInDebtsByCreditor += Number(element.financialInDebtWithConvertByCreditor);
        if (this.defaultTotalInDebtsByCreditor.toString().length > 4) {
  
          this.customTotalInDebtsByCreditor = this.defaultTotalInDebtsByCreditor / 1000;
  
          if (String(this.customTotalInDebtsByCreditor).includes(".")){
            const customTotalInDebtsByCreditor = String(this.customTotalInDebtsByCreditor).split('.');
            if (customTotalInDebtsByCreditor[1].length == 1) this.totalInDebtsByCreditor = customTotalInDebtsByCreditor[0] + "DT." + customTotalInDebtsByCreditor[1] + "00Mill";
            else if (customTotalInDebtsByCreditor[1].length == 2) this.totalInDebtsByCreditor = customTotalInDebtsByCreditor[0] + "DT." + customTotalInDebtsByCreditor[1] + "0Mill";
            else this.totalInDebtsByCreditor = customTotalInDebtsByCreditor[0] + "DT." + customTotalInDebtsByCreditor[1] + "Mill";
          } else {
            this.totalInDebtsByCreditor = String(this.customTotalInDebtsByCreditor) + "DT";
          }
        } else {
          this.totalInDebtsByCreditor = this.defaultTotalInDebtsByCreditor + "Mill";
        }
      });
    }
    else {
      if (this.statusInDebtId) {
        if (this.statusInDebtId == 1) {
          this.debtsList = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.creditor == this.creditorName) && (debt.toPayThisMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else if (this.statusInDebtId == 2) {
          this.debtsList = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.creditor == this.creditorName) && (debt.toPayNextMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else {
          this.debtsList = this.filteredDebtsByPlaceAndDebtForPay
          .filter(debt => (debt.creditor == this.creditorName) && (debt.notToPayForNow == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }   
      } else this.debtsList = this.filteredDebtsByPlaceAndDebtForPay
      .filter(debt => (debt.creditor == this.creditorName))
      .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);

      this.pagedList = this.debtsList.slice(0, 6);
      this.length = this.debtsList.length;
  
      this.debtsList.forEach(element => {
  
        if (element.financialDebt.indexOf("DT") !== -1) {
          element.financialInDebtWithConvertByCreditor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
          element.financialInDebtWithConvertByCreditor = element.financialInDebtWithConvertByCreditor + '000';
        }
        if (element.financialDebt.indexOf("Mill") !== -1) {
          element.financialInDebtWithConvertByCreditor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));
        }
        if (element.financialDebt.includes(".")){
          const composedFinancialDebtByCreditor = element.financialDebt.split('.');
          if (composedFinancialDebtByCreditor[0].indexOf("DT") !== -1) {
            element.firstPartComposedFinancialInDebtByCreditor = composedFinancialDebtByCreditor[0].substring(0, composedFinancialDebtByCreditor[0].lastIndexOf("DT"));
            element.firstPartComposedFinancialInDebtByCreditor = element.firstPartComposedFinancialInDebtByCreditor + '000';
          }
          if (composedFinancialDebtByCreditor[1].indexOf("Mill") !== -1) {
            element.secondPartComposedFinancialInDebtByCreditor = composedFinancialDebtByCreditor[1].substring(0, composedFinancialDebtByCreditor[1].lastIndexOf("Mill"));
          }
          element.financialInDebtWithConvertByCreditor = String(Number(element.firstPartComposedFinancialInDebtByCreditor)+Number(element.secondPartComposedFinancialInDebtByCreditor));
        }
  
        this.defaultTotalInDebtsByCreditor += Number(element.financialInDebtWithConvertByCreditor);
        if (this.defaultTotalInDebtsByCreditor.toString().length > 4) {
  
          this.customTotalInDebtsByCreditor = this.defaultTotalInDebtsByCreditor / 1000;
  
          if (String(this.customTotalInDebtsByCreditor).includes(".")){
            const customTotalInDebtsByCreditor = String(this.customTotalInDebtsByCreditor).split('.');
            if (customTotalInDebtsByCreditor[1].length == 1) this.totalInDebtsByCreditor = customTotalInDebtsByCreditor[0] + "DT." + customTotalInDebtsByCreditor[1] + "00Mill";
            else if (customTotalInDebtsByCreditor[1].length == 2) this.totalInDebtsByCreditor = customTotalInDebtsByCreditor[0] + "DT." + customTotalInDebtsByCreditor[1] + "0Mill";
            else this.totalInDebtsByCreditor = customTotalInDebtsByCreditor[0] + "DT." + customTotalInDebtsByCreditor[1] + "Mill";
          } else {
            this.totalInDebtsByCreditor = String(this.customTotalInDebtsByCreditor) + "DT";
          }
        } else {
          this.totalInDebtsByCreditor = this.defaultTotalInDebtsByCreditor + "Mill";
        }
      });
    }
  }

  getTotalOutDebts() {
    this.defaultTotalOutDebts = 0;
    this.customTotalOutDebts = 0;
    this.totalOutDebts = "";
    this.debtors = [];

    this.dataSourceCopie.data.filter(debt => debt.debtToGet == true).forEach(element => {
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

      if (!this.debtors.includes(element.debtor)) {
        this.debtors.push(element.debtor);
      }
    });   
  }

  getTotalOutDebtsByStatus() {
    this.defaultTotalOutDebtsByDebtor = 0;
    this.customTotalOutDebtsByDebtor = 0;
    this.totalOutDebtsByDebtor = "";

    if (this.isDesktop) {
      if (this.debtorName) {
        if (this.statusOutDebtId == 1) {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.toGetThisMonth == true) && (debt.debtor == this.debtorName))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else if (this.statusOutDebtId == 2) {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.toGetNextMonth == true) && (debt.debtor == this.debtorName))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.notToGetForNow == true) && (debt.debtor == this.debtorName))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }
      } else {
        if (this.statusOutDebtId == 1) {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.toGetThisMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else if (this.statusOutDebtId == 2) {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.toGetNextMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } else {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.notToGetForNow == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }
        this.dataSource.data.forEach(res => {
          if (!this.debtors.includes(res.debtor)) {
            this.debtors.push(res.debtor);
          }
        })
      }
  
      this.dataSource.data.forEach(element => {
        if (element.financialDebt.indexOf("DT") !== -1) {
          element.financialOutDebtWithConvertByDebtor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
          element.financialOutDebtWithConvertByDebtor = element.financialOutDebtWithConvertByDebtor + '000';
        }
        if (element.financialDebt.indexOf("Mill") !== -1) {
          element.financialOutDebtWithConvertByDebtor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));
        }
  
        if (element.financialDebt.includes(".")){
          const composedFinancialDebtByDebtor = element.financialDebt.split('.');
          if (composedFinancialDebtByDebtor[0].indexOf("DT") !== -1) {
            element.firstPartComposedFinancialOutDebtByDebtor = composedFinancialDebtByDebtor[0].substring(0, composedFinancialDebtByDebtor[0].lastIndexOf("DT"));
            element.firstPartComposedFinancialOutDebtByDebtor = element.firstPartComposedFinancialOutDebtByDebtor + '000';
          }
          if (composedFinancialDebtByDebtor[1].indexOf("Mill") !== -1) {
            element.secondPartComposedFinancialOutDebtByDebtor = composedFinancialDebtByDebtor[1].substring(0, composedFinancialDebtByDebtor[1].lastIndexOf("Mill"));
          }
          element.financialOutDebtWithConvertByDebtor = String(Number(element.firstPartComposedFinancialOutDebtByDebtor)+Number(element.secondPartComposedFinancialOutDebtByDebtor));
        }
  
        this.defaultTotalOutDebtsByDebtor += Number(element.financialOutDebtWithConvertByDebtor);
  
        if (this.defaultTotalOutDebtsByDebtor.toString().length > 4) {
  
          this.customTotalOutDebtsByDebtor = this.defaultTotalOutDebtsByDebtor / 1000;
          if (String(this.customTotalOutDebtsByDebtor).includes(".")){
            const customTotalOutDebtsByDebtor = String(this.customTotalOutDebtsByDebtor).split('.');
            if (customTotalOutDebtsByDebtor[1].length == 1) this.totalOutDebtsByDebtor = customTotalOutDebtsByDebtor[0] + "DT." + customTotalOutDebtsByDebtor[1] + "00Mill";
            else if (customTotalOutDebtsByDebtor[1].length == 2) this.totalOutDebtsByDebtor = customTotalOutDebtsByDebtor[0] + "DT." + customTotalOutDebtsByDebtor[1] + "0Mill";
            else this.totalOutDebtsByDebtor = customTotalOutDebtsByDebtor[0] + "DT." + customTotalOutDebtsByDebtor[1] + "Mill";
          } else {
            this.totalOutDebtsByDebtor = String(this.customTotalOutDebtsByDebtor) + "DT";
          }
        } else {
          this.totalOutDebtsByDebtor = this.defaultTotalOutDebtsByDebtor + "Mill";
        }
      });
    }
    else {
      if (this.debtorName) {
        if (this.statusOutDebtId == 1) {
          this.debtsList = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.toGetThisMonth == true) && (debt.debtor == this.debtorName))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else if (this.statusOutDebtId == 2) {
          this.debtsList = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.toGetNextMonth == true) && (debt.debtor == this.debtorName))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else {
          this.debtsList = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.notToGetForNow == true) && (debt.debtor == this.debtorName))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }
      } else {
        if (this.statusOutDebtId == 1) {
          this.debtsList = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.toGetThisMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else if (this.statusOutDebtId == 2) {
          this.debtsList = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.toGetNextMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } else {
          this.debtsList = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.notToGetForNow == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }
        this.debtsList.forEach(res => {
          if (!this.debtors.includes(res.debtor)) {
            this.debtors.push(res.debtor);
          }
        })
      }

      this.pagedList = this.debtsList.slice(0, 6);
      this.length = this.debtsList.length;
  
      this.debtsList.forEach(element => {
        if (element.financialDebt.indexOf("DT") !== -1) {
          element.financialOutDebtWithConvertByDebtor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
          element.financialOutDebtWithConvertByDebtor = element.financialOutDebtWithConvertByDebtor + '000';
        }
        if (element.financialDebt.indexOf("Mill") !== -1) {
          element.financialOutDebtWithConvertByDebtor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));
        }
  
        if (element.financialDebt.includes(".")){
          const composedFinancialDebtByDebtor = element.financialDebt.split('.');
          if (composedFinancialDebtByDebtor[0].indexOf("DT") !== -1) {
            element.firstPartComposedFinancialOutDebtByDebtor = composedFinancialDebtByDebtor[0].substring(0, composedFinancialDebtByDebtor[0].lastIndexOf("DT"));
            element.firstPartComposedFinancialOutDebtByDebtor = element.firstPartComposedFinancialOutDebtByDebtor + '000';
          }
          if (composedFinancialDebtByDebtor[1].indexOf("Mill") !== -1) {
            element.secondPartComposedFinancialOutDebtByDebtor = composedFinancialDebtByDebtor[1].substring(0, composedFinancialDebtByDebtor[1].lastIndexOf("Mill"));
          }
          element.financialOutDebtWithConvertByDebtor = String(Number(element.firstPartComposedFinancialOutDebtByDebtor)+Number(element.secondPartComposedFinancialOutDebtByDebtor));
        }
  
        this.defaultTotalOutDebtsByDebtor += Number(element.financialOutDebtWithConvertByDebtor);
  
        if (this.defaultTotalOutDebtsByDebtor.toString().length > 4) {
  
          this.customTotalOutDebtsByDebtor = this.defaultTotalOutDebtsByDebtor / 1000;
          if (String(this.customTotalOutDebtsByDebtor).includes(".")){
            const customTotalOutDebtsByDebtor = String(this.customTotalOutDebtsByDebtor).split('.');
            if (customTotalOutDebtsByDebtor[1].length == 1) this.totalOutDebtsByDebtor = customTotalOutDebtsByDebtor[0] + "DT." + customTotalOutDebtsByDebtor[1] + "00Mill";
            else if (customTotalOutDebtsByDebtor[1].length == 2) this.totalOutDebtsByDebtor = customTotalOutDebtsByDebtor[0] + "DT." + customTotalOutDebtsByDebtor[1] + "0Mill";
            else this.totalOutDebtsByDebtor = customTotalOutDebtsByDebtor[0] + "DT." + customTotalOutDebtsByDebtor[1] + "Mill";
          } else {
            this.totalOutDebtsByDebtor = String(this.customTotalOutDebtsByDebtor) + "DT";
          }
        } else {
          this.totalOutDebtsByDebtor = this.defaultTotalOutDebtsByDebtor + "Mill";
        }
      });
    }
  }

  getTotalOutDebtsByDebtor() {
    this.defaultTotalOutDebtsByDebtor = 0;
    this.customTotalOutDebtsByDebtor = 0;
    this.totalOutDebtsByDebtor = "";

    if (this.isDesktop) {
      if (this.statusOutDebtId) {
        if (this.statusOutDebtId == 1) {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.debtor == this.debtorName) && (debt.toGetThisMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else if (this.statusOutDebtId == 2) {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.debtor == this.debtorName) && (debt.toGetNextMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else {
          this.dataSource.data = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.debtor == this.debtorName) && (debt.notToGetForNow == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }
      } else this.dataSource.data = this.filteredDebtsByPlaceAndDebtToGet
      .filter(debt => (debt.debtor == this.debtorName))
      .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
  
      this.dataSource.data.forEach(element => {
        if (element.financialDebt.indexOf("DT") !== -1) {
          element.financialOutDebtWithConvertByDebtor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
          element.financialOutDebtWithConvertByDebtor = element.financialOutDebtWithConvertByDebtor + '000';
        }
        if (element.financialDebt.indexOf("Mill") !== -1) {
          element.financialOutDebtWithConvertByDebtor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));
        }
  
        if (element.financialDebt.includes(".")){
          const composedFinancialDebtByDebtor = element.financialDebt.split('.');
          if (composedFinancialDebtByDebtor[0].indexOf("DT") !== -1) {
            element.firstPartComposedFinancialOutDebtByDebtor = composedFinancialDebtByDebtor[0].substring(0, composedFinancialDebtByDebtor[0].lastIndexOf("DT"));
            element.firstPartComposedFinancialOutDebtByDebtor = element.firstPartComposedFinancialOutDebtByDebtor + '000';
          }
          if (composedFinancialDebtByDebtor[1].indexOf("Mill") !== -1) {
            element.secondPartComposedFinancialOutDebtByDebtor = composedFinancialDebtByDebtor[1].substring(0, composedFinancialDebtByDebtor[1].lastIndexOf("Mill"));
          }
          element.financialOutDebtWithConvertByDebtor = String(Number(element.firstPartComposedFinancialOutDebtByDebtor)+Number(element.secondPartComposedFinancialOutDebtByDebtor));
        }
  
        this.defaultTotalOutDebtsByDebtor += Number(element.financialOutDebtWithConvertByDebtor);
  
        if (this.defaultTotalOutDebtsByDebtor.toString().length > 4) {
  
          this.customTotalOutDebtsByDebtor = this.defaultTotalOutDebtsByDebtor / 1000;
          if (String(this.customTotalOutDebtsByDebtor).includes(".")){
            const customTotalOutDebtsByDebtor = String(this.customTotalOutDebtsByDebtor).split('.');
            if (customTotalOutDebtsByDebtor[1].length == 1) this.totalOutDebtsByDebtor = customTotalOutDebtsByDebtor[0] + "DT." + customTotalOutDebtsByDebtor[1] + "00Mill";
            else if (customTotalOutDebtsByDebtor[1].length == 2) this.totalOutDebtsByDebtor = customTotalOutDebtsByDebtor[0] + "DT." + customTotalOutDebtsByDebtor[1] + "0Mill";
            else this.totalOutDebtsByDebtor = customTotalOutDebtsByDebtor[0] + "DT." + customTotalOutDebtsByDebtor[1] + "Mill";
          } else {
            this.totalOutDebtsByDebtor = String(this.customTotalOutDebtsByDebtor) + "DT";
          }
        } else {
          this.totalOutDebtsByDebtor = this.defaultTotalOutDebtsByDebtor + "Mill";
        }
      });
    }
    else {
      if (this.statusOutDebtId) {
        if (this.statusOutDebtId == 1) {
          this.debtsList = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.debtor == this.debtorName) && (debt.toGetThisMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else if (this.statusOutDebtId == 2) {
          this.debtsList = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.debtor == this.debtorName) && (debt.toGetNextMonth == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        } 
        else {
          this.debtsList = this.filteredDebtsByPlaceAndDebtToGet
          .filter(debt => (debt.debtor == this.debtorName) && (debt.notToGetForNow == true))
          .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
        }
      } else this.debtsList = this.filteredDebtsByPlaceAndDebtToGet
      .filter(debt => (debt.debtor == this.debtorName))
      .sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);

      this.pagedList = this.debtsList.slice(0, 6);
      this.length = this.debtsList.length;
  
      this.debtsList.forEach(element => {
        if (element.financialDebt.indexOf("DT") !== -1) {
          element.financialOutDebtWithConvertByDebtor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("DT"));
          element.financialOutDebtWithConvertByDebtor = element.financialOutDebtWithConvertByDebtor + '000';
        }
        if (element.financialDebt.indexOf("Mill") !== -1) {
          element.financialOutDebtWithConvertByDebtor = element.financialDebt.substring(0, element.financialDebt.lastIndexOf("Mill"));
        }
  
        if (element.financialDebt.includes(".")){
          const composedFinancialDebtByDebtor = element.financialDebt.split('.');
          if (composedFinancialDebtByDebtor[0].indexOf("DT") !== -1) {
            element.firstPartComposedFinancialOutDebtByDebtor = composedFinancialDebtByDebtor[0].substring(0, composedFinancialDebtByDebtor[0].lastIndexOf("DT"));
            element.firstPartComposedFinancialOutDebtByDebtor = element.firstPartComposedFinancialOutDebtByDebtor + '000';
          }
          if (composedFinancialDebtByDebtor[1].indexOf("Mill") !== -1) {
            element.secondPartComposedFinancialOutDebtByDebtor = composedFinancialDebtByDebtor[1].substring(0, composedFinancialDebtByDebtor[1].lastIndexOf("Mill"));
          }
          element.financialOutDebtWithConvertByDebtor = String(Number(element.firstPartComposedFinancialOutDebtByDebtor)+Number(element.secondPartComposedFinancialOutDebtByDebtor));
        }
  
        this.defaultTotalOutDebtsByDebtor += Number(element.financialOutDebtWithConvertByDebtor);
  
        if (this.defaultTotalOutDebtsByDebtor.toString().length > 4) {
  
          this.customTotalOutDebtsByDebtor = this.defaultTotalOutDebtsByDebtor / 1000;
          if (String(this.customTotalOutDebtsByDebtor).includes(".")){
            const customTotalOutDebtsByDebtor = String(this.customTotalOutDebtsByDebtor).split('.');
            if (customTotalOutDebtsByDebtor[1].length == 1) this.totalOutDebtsByDebtor = customTotalOutDebtsByDebtor[0] + "DT." + customTotalOutDebtsByDebtor[1] + "00Mill";
            else if (customTotalOutDebtsByDebtor[1].length == 2) this.totalOutDebtsByDebtor = customTotalOutDebtsByDebtor[0] + "DT." + customTotalOutDebtsByDebtor[1] + "0Mill";
            else this.totalOutDebtsByDebtor = customTotalOutDebtsByDebtor[0] + "DT." + customTotalOutDebtsByDebtor[1] + "Mill";
          } else {
            this.totalOutDebtsByDebtor = String(this.customTotalOutDebtsByDebtor) + "DT";
          }
        } else {
          this.totalOutDebtsByDebtor = this.defaultTotalOutDebtsByDebtor + "Mill";
        }
      });
    } 
  }

  deleteAllByPlace(contentLoading) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete all this debts!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.modalRefLodaing = this.dialogService.open(contentLoading, {
          width: '20vw',
          height:'20vw',
          maxWidth: '100vw'
        });
        this.isLoading = true;

        this.dataSourceCopie.data.filter(debt => debt.placeId == this.placeId).forEach(element => {
          this.debtService.delete(element.key);
        });
        setTimeout(() => {
          this.isLoading = false;
          this.modalRefLodaing.close();

          Swal.fire(
            'Debts has been deleted successfully',
            '',
            'success'
          ).then((res) => {
            if (res.value) {
              if (this.isDesktop) this.getAllDebtsForDesktop();
              else this.getAllDebtsForTablet();
            }
          })
        }, 5000);
      }
    })
  }

  sortByRefDebtDesc() { 
    if (this.isDesktop) {
      this.dataSource.data = this.dataSource.data.sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
    } else {
      this.pagedList = this.debtsList.sort((n1, n2) => n2.numRefDebt - n1.numRefDebt);
      this.pagedList = this.debtsList.slice(0, 6);
      this.length = this.debtsList.length;
    }
    this.sortByDesc = true;
  }

  sortByRefDebtAsc() {
    if (this.isDesktop) {
      this.dataSource.data = this.dataSource.data.sort((n1, n2) => n1.numRefDebt - n2.numRefDebt);
    } else {
      this.pagedList = this.debtsList.sort((n1, n2) => n1.numRefDebt - n2.numRefDebt);
      this.pagedList = this.debtsList.slice(0, 6);
      this.length = this.debtsList.length;
    }
    this.sortByDesc = false;
  }

  deleteDebt(debtKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this debt!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.debtService.delete(debtKey);
        Swal.fire(
          'Debt has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  viewNote(debtNote: string) {
    Swal.fire({
      text: debtNote,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Close'
    });
  }

  ngOnDestroy() {
    this.subscriptionForGetAllDebts.unsubscribe();
  }
  
}
