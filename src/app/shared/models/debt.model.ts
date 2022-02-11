export class Debt {
    key: string;
    date: string;
    time: string;
    debtor: string;
    creditor: string;
    financialDebt:number;
    note: string;
  
    constructor(){
      this.date = "";
      this.time = "";
      this.debtor = "";
      this.creditor = "";
      this.financialDebt = null;
      this.note = "";
    }
  }