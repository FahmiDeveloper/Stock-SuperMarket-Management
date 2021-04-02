export class StockOut {
    name: string;
    quantity: number;
    date: string;
    time: string;
    description: string;
    productId: string;
    productName: string;

    constructor(){
      this.name = "";
      this.quantity = null;
      this.date = "";
      this.time = "";
      this.description = "";
      this.productId = "";
      this.productName = "";
    }
  }