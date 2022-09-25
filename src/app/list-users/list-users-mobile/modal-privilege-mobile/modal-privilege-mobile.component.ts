import { Component, OnInit } from '@angular/core';

import { UserService } from 'src/app/shared/services/user.service';

import { FirebaseUserModel } from 'src/app/shared/models/user.model';

@Component({
    selector: 'modal-privilege-mobile',
    templateUrl: './modal-privilege-mobile.component.html',
    styleUrls: ['./modal-privilege-mobile.scss']
})

export class ModalPrivilegeMobileComponent implements OnInit{

    currentUser: FirebaseUserModel;
    dialogRef: any;

    constructor(public userService: UserService) {}

    ngOnInit() {}

    changePrivliegeStatus(currentUser: FirebaseUserModel) {
        this.userService.update(currentUser.key, currentUser);
    }

}
