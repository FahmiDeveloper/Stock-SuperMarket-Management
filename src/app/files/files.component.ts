import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';

import { NewOrEditLinkComponent } from './new-or-edit-link/new-or-edit-link.component';

import { AuthService } from '../shared/services/auth.service';
import { LinkService } from '../shared/services/link.service';
import { UserService } from '../shared/services/user.service';

import { Link } from '../shared/models/link.model';
import { FirebaseUserModel } from '../shared/models/user.model';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})

export class FilesComponent implements OnInit {

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

  typesFiles: TypesFiles[] = [
    {id: 1, type: 'PICTURE', icon: '/assets/pictures/picture-file.jpg'},
    {id: 2, type: 'PDF', icon: '/assets/pictures/pdf-file.jpg'},
    {id: 3, type: 'EXCEL', icon: '/assets/pictures/excel-file.png'}, 
    {id: 4, type: 'TXT', icon: '/assets/pictures/txt-file.PNG'},
    {id: 5, type: 'ZIP', icon: '/assets/pictures/zip-file.PNG'},
    {id: 6, type: 'LINKS', icon: '/assets/pictures/links.png'},
    {id: 7, type: 'WORD', icon: '/assets/pictures/word-file.jpg'}
  ];

  typesLinks: TypesLinks[] = [
    {id: 1, type: 'ANGULAR', icon: '/assets/pictures/links-angular.png'},
    {id: 2, type: 'Other Contents', icon: '/assets/pictures/other-link.png'}
  ];

  constructor(
    private deviceService: DeviceDetectorService, 
    protected modalService: NgbModal,
    private linkService: LinkService,
    public userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.isMobile = this.deviceService.isMobile();
    this.getAllLinks();
    this.getRolesUser();
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

  openListFiles(contentDetOutDebt, contentLinks, typeFile: TypesFiles) {
    this.typeFile = typeFile;
    if (this.typeFile.id == 6) {
      this.modalRefListLinks = this.modalService.open(contentLinks as Component, { size: 'lg', centered: true});
    } else this.modalRefListFiles = this.modalService.open(contentDetOutDebt as Component, { size: 'lg', centered: true});
  }

  showListTypeLinks(typeLink: TypesLinks) {
    this.clickShowLinks = true;
    this.typeLink = typeLink;
    this.getFilteredLinks();
  }

  getFilteredLinks() {   
    this.filteredLinks = this.content ? this.allLinks.filter(link => (link.typeLinkId == this.typeLink.id) && (link.content.toLowerCase().includes(this.content.toLowerCase()))) : this.allLinks.filter(link => link.typeLinkId == this.typeLink.id);     
  }

  newLink() {
    const modalRef = this.modalService.open(NewOrEditLinkComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.typeLinkId = this.typeLink.id;
    modalRef.componentInstance.modalRef = modalRef;

    modalRef.componentInstance.passEntry.subscribe((receivedEntry: boolean) => {
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
    const modalRef = this.modalService.open(NewOrEditLinkComponent as Component, { size: 'lg', centered: true });

    modalRef.componentInstance.modalRef = modalRef;
    modalRef.componentInstance.link = link;
  }

  delete(linkId) {
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
