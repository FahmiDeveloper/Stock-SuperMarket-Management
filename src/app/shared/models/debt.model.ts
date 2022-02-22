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
    }
  }