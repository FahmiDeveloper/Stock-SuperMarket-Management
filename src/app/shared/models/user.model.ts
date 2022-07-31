export class FirebaseUserModel {
  key: string;
  email: string;
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
  roleMovies: boolean;
  roleAnimes: boolean;
  roleSeries: boolean;
  roleFiles: boolean;
  roleDebts: boolean;
  roleUsers: boolean;

  constructor(){
    this.image = "";
    this.name = "";
    this.provider = "";
  }
}