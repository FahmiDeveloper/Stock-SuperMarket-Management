export class Debt {
  key: string;
  date: string;
  time: string;
  debtor: string;
  creditor: string;
  financialDebt:string;
  note: string;
  placeId: number;
  numRow: number;
  restMoney: string;
  place: string;

  isRestMoney: boolean;

  debtForPay: boolean;
  financialInDebtWithConvert:string;
  financialInDebtInModalWithConvert:string;
  toPayThisMonth: boolean;
  toPayNextMonth: boolean;
  notToPayForNow: boolean;


  debtToGet: boolean;
  financialOutDebtWithConvert:string; 
  financialOutDebtInModalWithConvert:string;  
  toGetThisMonth: boolean;
  toGetNextMonth: boolean;
  notToGetForNow: boolean;

  constructor(){
    this.date = "";
    this.time = "";
    this.debtor = "";
    this.creditor = "";
    this.financialDebt = null;
    this.note = "";
    this.placeId = null;
    this.numRow = null;
    this.restMoney = "";
    this.place = "";
  }
}