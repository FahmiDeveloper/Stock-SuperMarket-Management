export class FirebaseUserModel {
  
  key: string;
  image: string;
  name: string;
  email: string;
  provider: string;
  isAdmin: boolean;

  roleMovies: boolean;
  roleAddMovie: boolean;
  roleUpdateMovie: boolean;
  roleDeleteMovie: boolean;

  roleAnimes: boolean;
  roleAddAnime: boolean;
  roleUpdateAnime: boolean;
  roleDeleteAnime: boolean;

  roleSeries: boolean;
  roleAddSerie: boolean;
  roleUpdateSerie: boolean;
  roleDeleteSerie: boolean;

  roleFiles: boolean;
  roleAddFile: boolean;
  roleUpdateFile: boolean;
  roleDeleteFile: boolean;

  roleDebts: boolean;
  roleAddDebt: boolean;
  roleUpdateDebt: boolean;
  roleDeleteDebt: boolean;

  //old roles
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
    this.image = '';
    this.name = '';
    this.provider = '';
  }

}

export interface Roles {
  id: number,
  roleName: string
}