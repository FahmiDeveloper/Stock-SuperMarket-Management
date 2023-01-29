import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

import { LinkService } from 'src/app/shared/services/link.service';

import { Link } from 'src/app/shared/models/link.model';

@Component({
  selector: 'new-or-edit-link',
  templateUrl: './new-or-edit-link.component.html',
  styleUrls: ['./new-or-edit-link.scss']
})

export class NewOrEditLinkComponent implements OnInit {

  link: Link = new Link();
  arrayLinks: Link[];
  typeLinkId: number;
  modalRef: any;
  isMobile: boolean;

  formControl = new FormControl('', [Validators.required]);

  constructor(private linkService: LinkService) {}

  ngOnInit() {}

  save(link) {
    if (this.link.key) {
      this.linkService.update(this.link.key, link);
      Swal.fire(
        'Link data has been updated successfully',
        '',
        'success'
      );
    } else {
      link.typeLinkId = this.typeLinkId;
      if (this.arrayLinks[0].numRefLink) link.numRefLink = this.arrayLinks[0].numRefLink + 1;

      this.linkService.create(link);
      Swal.fire(
      'New Link added successfully',
      '',
      'success'
      );
    }
    this.modalRef.close();
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :'';
  }
}
