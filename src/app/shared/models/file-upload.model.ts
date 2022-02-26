export class FileUpload {
    key!: string;
    name!: string;
    url!: string;
    file: File;
    typeFileId: number;
    
    constructor(file: File, typeFileId: number) {
      this.file = file;
      this.typeFileId = typeFileId;
    }
}