export class StockIn {
    name: string;
    quantity: number;
    date: string;
    time: string;
    note: string;
    productId: string;
    productName: string;

    constructor(){
      this.name = "";
      this.quantity = null;
      this.date = "";
      this.time = "";
      this.note = "";
      this.productId = "";
      this.productName = "";
    }
  }