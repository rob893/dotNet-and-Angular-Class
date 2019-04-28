import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

    public users: User[];

    private userService: UserService;
    private alertify: AlertifyService;


    public constructor(userService: UserService, alertify: AlertifyService) { 
        this.userService = userService;
        this.alertify = alertify;
    }

    public ngOnInit() {
        this.loadUsers();
    }

    public loadUsers(): void {
        this.userService.getUsers().subscribe((users: User[]) => {
            this.users = users;
        }, error => {
            this.alertify.error(error);
        });
    }
}
