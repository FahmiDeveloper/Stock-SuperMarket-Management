export class Product {
    nameProduct: string;
    price: number;
    date: string;
    time: string;
    categoryId: number;
    imageUrl: string;

    constructor(){
      this.nameProduct = "";
      this.price = null;
      this.date = "";
      this.time = "";
      this.categoryId = null;
      this.imageUrl = "";
    }
  }