import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/shared/services/user.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
    selector: 'modal-privilege',
    templateUrl: './modal-privilege.component.html',
    styleUrls: ['./modal-privilege.scss']
})

export class ModalPrivilegeComponent implements OnInit{

    currentUser: FirebaseUserModel;

    constructor(public userService: UserService) {}

    ngOnInit() {}

    changePrivliegeStatus(currentUser: FirebaseUserModel) {
        this.userService.update(currentUser.key, currentUser);
    }

}
