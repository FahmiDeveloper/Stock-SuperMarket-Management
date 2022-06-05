export class FileUpload {
    key!: string;
    name!: string;
    url!: string;
    file: File;
    typeFileId: number;
    fileNameWithoutType: string;
    
    constructor(file: File, typeFileId: number) {
      this.file = file;
      this.typeFileId = typeFileId;
    }
}