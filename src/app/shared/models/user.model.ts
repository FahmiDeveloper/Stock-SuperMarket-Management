export class FirebaseUserModel {
    image: string;
    name: string;
    provider: string;
    isAdmin: boolean;
    roleEmployee: boolean;
    roleProduct: boolean;
    roleCategory: boolean;
    roleStock: boolean;
    roleSupplier: boolean;
    roleInvoice: boolean;
  
    constructor(){
      this.image = "";
      this.name = "";
      this.provider = "";
    }
  }