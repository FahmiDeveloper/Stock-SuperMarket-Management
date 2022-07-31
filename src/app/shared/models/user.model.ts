export class FirebaseUserModel {
  key: string;
  image: string;
  name: string;
  email: string;
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
  roleAddMovie: boolean;
  roleUpdateMovie: boolean;
  roleDeleteMovie: boolean;
  roleAddAnime: boolean;
  roleUpdateAnime: boolean;
  roleDeleteAnime: boolean;
  roleAddSerie: boolean;
  roleUpdateSerie: boolean;
  roleDeleteSerie: boolean;
  roleAddFile: boolean;
  roleUpdateFile: boolean;
  roleDeleteFile: boolean;
  roleAddDebt: boolean;
  roleUpdateDebt: boolean;
  roleDeleteDebt: boolean;

  constructor(){
    this.image = "";
    this.name = "";
    this.provider = "";
  }
}