export class Product {
    nameProduct: string;
    price: number;
    date: string;
    time: string;
    categoryId: string;
    nameCategory: string;// get name of category foreach product using categoryId
    imageUrl: string;

    constructor(){
      this.nameProduct = "";
      this.price = null;
      this.date = "";
      this.time = "";
      this.categoryId = "";
      this.nameCategory = "";
      this.imageUrl = "";
    }
  }