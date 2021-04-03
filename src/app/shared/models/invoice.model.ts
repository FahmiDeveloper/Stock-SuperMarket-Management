export class Invoice {
    code: string;
    date: string;
    time: string;
    supplierId: string;
    nameSupplier: string;// get name of supplier foreach invoice using supplierId

    constructor(){
      this.code = "";
      this.date = "";
      this.time = "";
      this.supplierId = "";
      this.nameSupplier = "";
    }
  }