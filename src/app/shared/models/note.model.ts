export class Note {
  key: string;
  contentNote: string;
  remark: string;
  numRefNote: number;
  urlFile: string;
  fileName: string;
  testWorkInMaster: boolean;
  testWorkInERP: boolean;
  noteToDo: boolean;
  noteForNotif: boolean;
}

export interface SubjectList {
  id: number;
  subjectName: string;
}