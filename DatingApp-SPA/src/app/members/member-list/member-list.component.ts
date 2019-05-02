import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

    public users: User[];

    private userService: UserService;
    private alertify: AlertifyService;
    private route: ActivatedRoute;

    //Using route resolver to get users
    public constructor(userService: UserService, alertify: AlertifyService, route: ActivatedRoute) { 
        this.userService = userService;
        this.alertify = alertify;
        this.route = route;
    }

    public ngOnInit() {
        this.route.data.subscribe(data => {
            this.users = data['users'];
        });
    }
}
