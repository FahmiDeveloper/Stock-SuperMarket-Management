export class Debt {

  key: string;
  date: string;
  time: string;
  debtor: string;
  creditor: string;
  financialDebt:string;
  note: string;
  placeId: number;
  restMoney: string;
  place: string;
  isRestMoney: boolean;
  numRefDebt: number;

  debtForPay: boolean;
  financialInDebtWithConvert:string;
  financialInDebtInModalWithConvert:string;
  toPayThisMonth: boolean;
  toPayNextMonth: boolean;
  notToPayForNow: boolean;
  firstPartComposedFinancialInDebt:string;
  secondPartComposedFinancialInDebt:string;
  financialInDebtWithConvertByCreditor:string;
  firstPartComposedFinancialInDebtByCreditor:string;
  secondPartComposedFinancialInDebtByCreditor:string;


  debtToGet: boolean;
  financialOutDebtWithConvert:string; 
  financialOutDebtInModalWithConvert:string;  
  toGetThisMonth: boolean;
  toGetNextMonth: boolean;
  notToGetForNow: boolean;
  firstPartComposedFinancialOutDebt:string;
  secondPartComposedFinancialOutDebt:string;
  financialOutDebtWithConvertByDebtor:string;
  firstPartComposedFinancialOutDebtByDebtor:string;
  secondPartComposedFinancialOutDebtByDebtor:string;

  constructor(){
    this.date = "";
    this.time = "";
    this.debtor = "";
    this.creditor = "";
    this.financialDebt = null;
    this.note = "";
    this.placeId = null;
    this.restMoney = "";
    this.place = "";
  }
  
}

export interface PlacesMoney {
  id: number,
  place: string
}

export interface StatusOutDebts {
  id: number,
  status: string
}

export interface StatusInDebts{
  id: number,
  status: string
}

export interface Unit {
  unitName: string
}

