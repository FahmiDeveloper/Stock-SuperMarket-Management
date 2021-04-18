import { Observable } from "rxjs";

export class Supplier {
    key: string;
    name: string;
    date: string;
    time: string;
    phone: number;
    mobile: number;
    address: string;
    note: string;
    nbrInvoicesForEachSupplier: Observable<number>;

    constructor(){
      this.name = "";
      this.date = "";
      this.time = "";
      this.phone = null;
      this.mobile = null;
      this.address = "";
      this.note = "";
    }
  }