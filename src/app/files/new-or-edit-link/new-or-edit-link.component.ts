import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import Swal from 'sweetalert2';

import { LinkService } from 'src/app/shared/services/link.service';

import { Link } from 'src/app/shared/models/link.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'new-or-edit-link',
  templateUrl: './new-or-edit-link.component.html',
  styleUrls: ['./new-or-edit-link.scss']
})

export class NewOrEditLinkComponent implements OnInit {

  link: Link = new Link();
  typeLinkId: number;
  modalRef: any;

  @Output() passEntry: EventEmitter<any> = new EventEmitter();

  formControl = new FormControl('', [Validators.required]);

  constructor(private linkService: LinkService) {}

  ngOnInit() {}

  save(link) {
    if (this.link.key) {
      this.linkService.update(this.link.key, link);
      Swal.fire(
        'Link data has been Updated successfully',
        '',
        'success'
      );
    } else {
      link.typeLinkId = this.typeLinkId;
      this.linkService.create(link);
      Swal.fire(
      'New Link added successfully',
      '',
      'success'
      );
      this.passEntry.emit(true);
    }
    this.modalRef.close();
  }

  getErrorMessage() {
    return this.formControl.hasError('required') ? 'Required field' :'';
  }
}
