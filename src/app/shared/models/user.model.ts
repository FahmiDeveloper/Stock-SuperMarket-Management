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
    roleAdd: boolean;
    roleUpdate: boolean;
    roleDelete: boolean;
  
    constructor(){
      this.image = "";
      this.name = "";
      this.provider = "";
    }
  }