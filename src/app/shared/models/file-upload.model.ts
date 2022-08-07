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

export interface TypesFiles {
  id: number,
  type: string,
  icon: string
}

export interface TypesLinks {
  id: number,
  type: string,
  icon: string
}

export interface ZipFile {
  readonly name: string;
  readonly dir: boolean;
  readonly date: Date;
  readonly data: any;
  fileName: string;
}