export class Invoice {
    code: string;
    date: string;
    time: string;
    supplierId: string;
    nameSupplier: string;// get name of supplier foreach invoice using supplierId
    note: string;

    constructor(){
      this.code = "";
      this.date = "";
      this.time = "";
      this.supplierId = "";
      this.nameSupplier = "";
      this.note = "";
    }
  }