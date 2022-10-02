import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { Subscription } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import Swal from 'sweetalert2';
import { NgNavigatorShareService } from 'ng-navigator-share';

import { NewOrEditLinkComponent } from './new-or-edit-link/new-or-edit-link.component';

import { AuthService } from '../shared/services/auth.service';
import { LinkService } from '../shared/services/link.service';
import { UserService } from '../shared/services/user.service';

import { Link } from '../shared/models/link.model';
import { FirebaseUserModel } from '../shared/models/user.model';
import { TypesFiles, TypesLinks } from '../shared/models/file-upload.model';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})

export class FilesComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['content', 'actions'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  filteredLinks: Link[];
  allLinks: Link[];

  typeFile: TypesFiles;
  typeLink: TypesLinks;

  modalRefListFiles: any;
  modalRefListLinks: any;
  
  isMobile: boolean;
  clickShowLinks: boolean = false;

  p: number = 1;

  subscriptionForGetAllLinks: Subscription;
  subscriptionForUser: Subscription;

  user: FirebaseUserModel = new FirebaseUserModel();

  content: string = '';
  numContextFile: number;

  typesFiles: TypesFiles[] = [
    {id: 1, title: 'Pictures', type: 'Picture', icon: '/assets/pictures/picture-file.jpg'},
    {id: 2, title: 'Pdf', type: 'Pdf', icon: '/assets/pictures/pdf-file.jpg'},
    {id: 3, title: 'Excel', type: 'Excel', icon: '/assets/pictures/excel-file.png'}, 
    {id: 4, title: 'Text doc', type: 'Text document', icon: '/assets/pictures/txt-file.PNG'},
    {id: 5, title: 'Zip', type: 'Zip', icon: '/assets/pictures/zip-file.PNG'},
    {id: 6, title: 'Links', type: 'Links', icon: '/assets/pictures/links.png'},
    {id: 7, title: 'Word', type: 'Word', icon: '/assets/pictures/word-file.jpg'}
  ];

  typesLinks: TypesLinks[] = [
    {id: 1, title: 'Angular', type: 'Angular', icon: '/assets/pictures/links-angular.png'},
    {id: 2, title: 'Other', type: 'Other', icon: '/assets/pictures/other-link.png'}
  ];

  contracts: Array<Contract> = [
    { 
      Id: '1',
      Name: 'Name 1'
    },
    { 
      Id: '2',
      Name: 'Name 2'
    },
    
  ];

  constructor(
    private deviceService: DeviceDetectorService,
    protected ngNavigatorShareService: NgNavigatorShareService,
    protected modalService: NgbModal,
    private linkService: LinkService,
    public userService: UserService,
    public authService: AuthService,
    public dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    this.getAllLinks();
    this.getRolesUser();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getAllLinks() {
    this.subscriptionForGetAllLinks = this.linkService
    .getAll()
    .subscribe(links => {
      this.allLinks = links;
    });
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
                this.userService
                  .get(user.uid)
                  .valueChanges()
                  .subscribe(dataUser=>{
                    this.user = dataUser;
                });
              }
          });   
        }
    })
  }

  openListFiles(contentListFiles, contentLinks, typeFile: TypesFiles) {
    this.clickShowLinks = false;
    this.typeFile = typeFile;
    this.numContextFile = null;
    if (this.typeFile.id == 6) {
      this.modalRefListLinks = this.modalService.open(contentLinks as Component, { size: 'lg', centered: true});
    } else this.modalRefListFiles = this.modalService.open(contentListFiles as Component, { size: 'lg', centered: true});
  }

  showListTypeLinks(typeLink: TypesLinks) {
    this.clickShowLinks = true;
    this.content = '';
    this.typeLink = typeLink;
    this.getFilteredLinks();
  }

  getFilteredLinks() {   
    this.dataSource.data = this.content ? this.allLinks.filter(link => (link.typeLinkId == this.typeLink.id) && (link.content.toLowerCase().includes(this.content.toLowerCase()))) : this.allLinks.filter(link => link.typeLinkId == this.typeLink.id);     
  }

  newLink() {
    const dialogRef = this.dialogService.open(NewOrEditLinkComponent, {
      width: '25vw',
      height:'33vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.typeLinkId = this.typeLink.id;
    dialogRef.componentInstance.modalRef = dialogRef;

    dialogRef.componentInstance.passEntry.subscribe((receivedEntry: boolean) => {
      if (receivedEntry) {
        this.subscriptionForGetAllLinks = this.linkService
        .getAll()
        .subscribe(links => {
          this.filteredLinks = links.filter(link => link.typeLinkId == this.typeLink.id);
        });
      }   
    })
  }

  editLink(link?: Link) {
    const dialogRef = this.dialogService.open(NewOrEditLinkComponent, {
      width: '25vw',
      height:'33vh',
      maxWidth: '100vw'
    });
    dialogRef.componentInstance.link = link;
    dialogRef.componentInstance.modalRef = dialogRef;
  }

  deleteLink(linkId) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'delete this link!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.linkService.delete(linkId);
        Swal.fire(
          'Link has been deleted successfully',
          '',
          'success'
        );
        this.subscriptionForGetAllLinks = this.linkService
        .getAll()
        .subscribe(links => {
          this.filteredLinks = links.filter(link => link.typeLinkId == this.typeLink.id);
        });
      }
    })
  }

  backToListTypeLinks() {
    this.clickShowLinks = false;
    this.content = '';
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
}

export interface Contract {
  Id: string;
  Name: string;
}

export interface PeriodicElement {
  name: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Hydrogen'},
  {name: 'Hydrogen'},
  {name: 'Hydrogen'}
];
