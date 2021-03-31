export class Invoice {
    code: string;
    date: string;
    time: string;
    supplierId: number;
    nameSupplier: string;// get name of supplier foreach invoice using supplierId

    constructor(){
      this.code = "";
      this.date = "";
      this.time = "";
    }
  }