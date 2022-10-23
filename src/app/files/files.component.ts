import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { DeviceDetectorService } from 'ngx-device-detector';
import { NgNavigatorShareService } from 'ng-navigator-share';

import { NewOrEditLinkComponent } from './new-or-edit-link/new-or-edit-link.component';

import { AuthService } from '../shared/services/auth.service';
import { LinkService } from '../shared/services/link.service';
import { UserService } from '../shared/services/user.service';
import { UsersListService } from '../shared/services/list-users.service';

import { Link } from '../shared/models/link.model';
import { FirebaseUserModel } from '../shared/models/user.model';
import { FileUpload, TypesFiles } from '../shared/models/file-upload.model';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})

export class FilesComponent implements OnInit, OnDestroy {

  dataSource = new MatTableDataSource<Link>();
  dataSourceCopie = new MatTableDataSource<Link>();
  displayedColumns: string[] = ['content', 'star'];

  linkToDelete: Link = new Link();

  content: string = '';
  numContextFile: number;
  typeFile: TypesFiles;
  isMobile: boolean;
  defaultArrayFiles: FileUpload[] = [];
  angularContext: boolean = false;
  otherContext: boolean = false;

  subscriptionForGetAllLinks: Subscription;
  subscriptionForUser: Subscription;
  subscriptionForGetAllUsers: Subscription;

  modalRefDeleteLink: any;

  dataUserConnected: FirebaseUserModel = new FirebaseUserModel();

  @ViewChild(MatPaginator) paginator: MatPaginator;

  typesFiles: TypesFiles[] = [
    {id: 1, title: 'Pictures', type: 'Picture', icon: '/assets/pictures/picture-file.jpg'},
    {id: 2, title: 'Pdf', type: 'Pdf', icon: '/assets/pictures/pdf-file.jpg'},
    {id: 3, title: 'Excel', type: 'Excel', icon: '/assets/pictures/excel-file.png'}, 
    {id: 4, title: 'Text doc', type: 'Text document', icon: '/assets/pictures/txt-file.PNG'},
    {id: 5, title: 'Zip', type: 'Zip', icon: '/assets/pictures/zip-file.PNG'},
    {id: 6, title: 'Links', type: 'Links', icon: '/assets/pictures/links.png'},
    {id: 7, title: 'Word', type: 'Word', icon: '/assets/pictures/word-file.jpg'}
  ];

  constructor(
    private deviceService: DeviceDetectorService,
    protected ngNavigatorShareService: NgNavigatorShareService,
    private linkService: LinkService,
    public userService: UserService,
    public usersListService: UsersListService,
    public authService: AuthService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    this.getRolesUser();
  }

  getRolesUser() {
    this.subscriptionForUser = this.authService
      .isConnected
      .subscribe(res=>{
        if(res) {
          this.userService
            .getCurrentUser()
            .then(user=>{
              if(user) {
                let connectedUserFromList: FirebaseUserModel = new FirebaseUserModel();

                this.subscriptionForGetAllUsers = this.usersListService
                .getAll()
                .subscribe((users: FirebaseUserModel[]) => { 
                  connectedUserFromList = users.find(element => element.email == user.email);

                  this.usersListService
                  .get(connectedUserFromList.key)
                  .valueChanges()
                  .subscribe(dataUser=>{
                    this.dataUserConnected = dataUser;
                  });
                });
              }
          });   
        }
    })
  }

  openListFiles(contentListFiles, contentLinks, typeFile: TypesFiles) {
    this.typeFile = typeFile;
    this.numContextFile = null;
    if (this.typeFile.id == 6) {
      this.content = '';
      this.angularContext = false;
      this.otherContext = false;
      this.getAllLinks()
      if (this.isMobile) {
        this.dialogService.open(contentLinks, {
          width: '98vw',
          height:'85vh',
          maxWidth: '100vw'
        });
      } else {
        this.dialogService.open(contentLinks, {
          width: '30vw',
          height:'85vh',
          maxWidth: '100vw'
        });
      }
    } else {
      if (this.isMobile) {
        this.dialogService.open(contentListFiles, {
          width: '98vw',
          height:'81vh',
          maxWidth: '100vw'
        });
      } else {
        this.dialogService.open(contentListFiles, {
          width: '30vw',
          height:'80vh',
          maxWidth: '100vw'
        });
      }
    } 
  }

  getAllLinks() {
    this.subscriptionForGetAllLinks = this.linkService
    .getAll()
    .subscribe(links => {
      this.dataSourceCopie.data = links.sort((n1, n2) => n2.numRefLink - n1.numRefLink);
      if (this.angularContext && this.content) {
        this.dataSource.data = links.filter(link => (link.typeLinkId == 1) && (link.content.toLowerCase().includes(this.content.toLowerCase()))).sort((n1, n2) => n2.numRefLink - n1.numRefLink);
      } 
      else if (this.angularContext && !this.content) {
        this.dataSource.data = links.filter(link => (link.typeLinkId == 1)).sort((n1, n2) => n2.numRefLink - n1.numRefLink);
      } 
      else if (this.otherContext && this.content) {
        this.dataSource.data = links.filter(link => (link.typeLinkId == 2) && (link.content.toLowerCase().includes(this.content.toLowerCase()))).sort((n1, n2) => n2.numRefLink - n1.numRefLink);
      } 
      else if (this.otherContext && !this.content) {
        this.dataSource.data = links.filter(link => (link.typeLinkId == 2)).sort((n1, n2) => n2.numRefLink - n1.numRefLink);
      } 
      else this.dataSource.data = links.sort((n1, n2) => n2.numRefLink - n1.numRefLink);
      
      this.dataSource.paginator = this.paginator;
    });
  }

  newLink() {
    if (this.isMobile) {
      const dialogRef = this.dialogService.open(NewOrEditLinkComponent, {
        width: '98vw',
        height:'40vh',
        maxWidth: '100vw'
      });

      dialogRef.componentInstance.typeLinkId = this.angularContext ? 1 : 2;
      dialogRef.componentInstance.arrayLinks = this.dataSourceCopie.data;
      dialogRef.componentInstance.isMobile = this.isMobile;
      dialogRef.componentInstance.modalRef = dialogRef;
    } else {
      const dialogRef = this.dialogService.open(NewOrEditLinkComponent, {
        width: '25vw',
        height:'33vh',
        maxWidth: '100vw'
      });

      dialogRef.componentInstance.typeLinkId = this.angularContext ? 1 : 2;
      dialogRef.componentInstance.arrayLinks = this.dataSourceCopie.data;
      dialogRef.componentInstance.isMobile = this.isMobile;
      dialogRef.componentInstance.modalRef = dialogRef;
    }
  }

  editLink(link?: Link) {
    if (this.isMobile) {
      const dialogRef = this.dialogService.open(NewOrEditLinkComponent, {
        width: '98vw',
        height:'40vh',
        maxWidth: '100vw'
      });
      
      dialogRef.componentInstance.link = link;
      dialogRef.componentInstance.isMobile = this.isMobile;
      dialogRef.componentInstance.modalRef = dialogRef;

    } else {
      const dialogRef = this.dialogService.open(NewOrEditLinkComponent, {
        width: '25vw',
        height:'33vh',
        maxWidth: '100vw'
      });

      dialogRef.componentInstance.link = link;
      dialogRef.componentInstance.isMobile = this.isMobile;
      dialogRef.componentInstance.modalRef = dialogRef;
    }
  }

  shareLink(link: Link) {
    if (this.isMobile) {
      if (!this.ngNavigatorShareService.canShare()) {
        alert(`This service/api is not supported in your Browser`);
        return;
      }

      this.ngNavigatorShareService.share({
        title: link.content,
        text: '',
        url: link.path
      }).then( (response) => {
        console.log(response);
      })
      .catch( (error) => {
        console.log(error);
      });
    } else
    window.open("https://web.whatsapp.com/send?text=" + link.path,'_blank');
  }

  getRefContextFile(refContextFile: number) {
    this.numContextFile = refContextFile;
  }

  getDefaultArrayFiles(defaultArrayFiles:FileUpload[]) {
    this.defaultArrayFiles = defaultArrayFiles;
  }

  ngOnDestroy() {
    if (this.subscriptionForGetAllLinks) this.subscriptionForGetAllLinks.unsubscribe();
    this.subscriptionForUser.unsubscribe();
    this.subscriptionForGetAllUsers.unsubscribe();
  }

  checkAngularContext() {
    if (this.angularContext == true) this.otherContext = false;
    if (this.content) this.content = '';
    this.getAllLinks();
  }

  checkotherContext() {
    if (this.otherContext == true) this.angularContext = false;
    if (this.content) this.content = '';
    this.getAllLinks();
  }

  openDeleteLinkModal(link: Link, contentDeleteLink) {
    this.linkToDelete = link;
    if (this.isMobile) {
      this.modalRefDeleteLink =  this.dialogService.open(contentDeleteLink, {
        width: '98vw',
       height:'40vh',
       maxWidth: '100vw'
     });
   } else {
    this.modalRefDeleteLink =  this.dialogService.open(contentDeleteLink, {
      width: '30vw',
      height:'30vh',
      maxWidth: '100vw'
    }); 
   }
  }

  confirmDelete() {
    this.linkService.delete(this.linkToDelete.key);
  }

  close() {
    this.modalRefDeleteLink.close();
  }

}
