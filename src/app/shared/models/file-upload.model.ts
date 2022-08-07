export class FileUpload {

  key!: string;
  name!: string;
  url!: string;
  file: File;
  typeFileId: number;
  fileNameWithoutType: string;
  contextFile: number;
  
  constructor(file: File, typeFileId: number, contextFile: number) {
    this.file = file;
    this.typeFileId = typeFileId;
    this.contextFile = contextFile;
  }
  
}