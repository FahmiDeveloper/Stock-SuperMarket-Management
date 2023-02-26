import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

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

  linksList: Link[]= [];
  pagedList: Link[]= [];
  arrayLinksForNewLink: Link[]= [];
  length: number = 0;

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
    if (this.isMobile) {document.body.scrollTop = document.documentElement.scrollTop = 0;}
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

    let configMobile: MatDialogConfig = {
      panelClass: "dialog-responsive",
      width: '98vw',
      maxWidth: '100vw'
    }

    if (this.typeFile.id == 6) {
      this.content = '';
      this.angularContext = false;
      this.otherContext = false;
      this.getAllLinks();
      if (this.isMobile) {
        this.dialogService.open(contentLinks, configMobile);
      } else {
        this.dialogService.open(contentLinks, {width: '500px'});
      }
    } else {
      if (this.isMobile) {
        this.dialogService.open(contentListFiles, configMobile);
      } else {
        this.dialogService.open(contentListFiles, {width: '500px'});
      }   
    } 
  }

  getAllLinks() {
    this.subscriptionForGetAllLinks = this.linkService
    .getAll()
    .subscribe(links => {
      this.arrayLinksForNewLink = links.sort((n1, n2) => n2.numRefLink - n1.numRefLink);

      if (this.angularContext && this.content) {
        this.linksList = links.filter(link => (link.typeLinkId == 1) && (link.content.toLowerCase().includes(this.content.toLowerCase()))).sort((n1, n2) => n2.numRefLink - n1.numRefLink);
      } 
      else if (this.angularContext && !this.content) {
        this.linksList = links.filter(link => (link.typeLinkId == 1)).sort((n1, n2) => n2.numRefLink - n1.numRefLink);
      } 
      else if (this.otherContext && this.content) {
        this.linksList = links.filter(link => (link.typeLinkId == 2) && (link.content.toLowerCase().includes(this.content.toLowerCase()))).sort((n1, n2) => n2.numRefLink - n1.numRefLink);
      } 
      else if (this.otherContext && !this.content) {
        this.linksList = links.filter(link => (link.typeLinkId == 2)).sort((n1, n2) => n2.numRefLink - n1.numRefLink);
      } 
      else this.linksList = links.sort((n1, n2) => n2.numRefLink - n1.numRefLink);
      
      this.pagedList = this.linksList.slice(0, 6);
      this.length = this.linksList.length;
    });
  }

  OnPageChange(event: PageEvent){
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if(endIndex > this.length){
      endIndex = this.length;
    }
    this.pagedList = this.linksList.slice(startIndex, endIndex);
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  }

  newLink() {
    if (this.isMobile) {
      let config: MatDialogConfig = {
        panelClass: "dialog-responsive",
        width: '98vw',
        maxWidth: '100vw'
      }
      const dialogRef = this.dialogService.open(NewOrEditLinkComponent, config);

      dialogRef.componentInstance.typeLinkId = this.angularContext ? 1 : 2;
      dialogRef.componentInstance.arrayLinks = this.arrayLinksForNewLink;
      dialogRef.componentInstance.isMobile = this.isMobile;
      dialogRef.componentInstance.modalRef = dialogRef;
    } else {
      let config: MatDialogConfig = {panelClass: "dialog-responsive"}
      const dialogRef = this.dialogService.open(NewOrEditLinkComponent, config);

      dialogRef.componentInstance.typeLinkId = this.angularContext ? 1 : 2;
      dialogRef.componentInstance.arrayLinks = this.arrayLinksForNewLink;
      dialogRef.componentInstance.isMobile = this.isMobile;
      dialogRef.componentInstance.modalRef = dialogRef;
    }
  }

  editLink(link?: Link) {
    if (this.isMobile) {
      let config: MatDialogConfig = {
        panelClass: "dialog-responsive",
        width: '98vw',
        maxWidth: '100vw'
      }
      const dialogRef = this.dialogService.open(NewOrEditLinkComponent, config);

      dialogRef.componentInstance.link = link;
      dialogRef.componentInstance.isMobile = this.isMobile;
      dialogRef.componentInstance.modalRef = dialogRef;
      
    } else {
      let config: MatDialogConfig = {panelClass: "dialog-responsive"}
      const dialogRef = this.dialogService.open(NewOrEditLinkComponent, config);

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

  deleteLink(linkKey) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Delete this link!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.linkService.delete(linkKey);
        Swal.fire(
          'Link has been deleted successfully',
          '',
          'success'
        )
      }
    })
  }

  viewLinkContent(linkContent: string) {
    Swal.fire({
      text: linkContent,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Close'
    });
  }
  
}
