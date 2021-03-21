export class FirebaseUserModel {
    image: string;
    name: string;
    provider: string;
    isAdmin: boolean;
  
    constructor(){
      this.image = "";
      this.name = "";
      this.provider = "";
    }
  }