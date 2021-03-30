export class Product {
    nameProduct: string;
    price: number;
    date: string;
    time: string;
    categoryId: number;
    nameCategory: string;// get name of category foreach product using categoryId
    imageUrl: string;

    constructor(){
      this.nameProduct = "";
      this.price = null;
      this.date = "";
      this.time = "";
      this.categoryId = null;
      this.nameCategory = "";
      this.imageUrl = "";
    }
  }