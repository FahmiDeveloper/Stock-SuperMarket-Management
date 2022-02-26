import { Component, OnInit } from '@angular/core';

import Swal from 'sweetalert2';

import { Link } from 'src/app/shared/models/link.model';
import { LinkService } from 'src/app/shared/services/link.service';

@Component({
  selector: 'new-or-edit-link',
  templateUrl: './new-or-edit-link.component.html',
  styleUrls: ['./new-or-edit-link.scss']
})

export class NewOrEditLinkComponent implements OnInit {

  link: Link = new Link();
  modalRef: any;

 

  constructor(private linkService: LinkService) {}

  ngOnInit() {}

  save(link) {
    if (this.link.key) {
      this.linkService.update(this.link.key, link);
      Swal.fire(
        'Link data has been Updated successfully',
        '',
        'success'
      )
    } else {
      this.linkService.create(link);
      Swal.fire(
      'New Link added successfully',
      '',
      'success'
      )
    }
    this.modalRef.close();
  }
}
