import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

    public user: User;

    private userService: UserService;
    private alertify: AlertifyService;
    private route: ActivatedRoute;


    public constructor(userService: UserService, alertify: AlertifyService, route: ActivatedRoute) { 
        this.userService = userService;
        this.alertify = alertify;
        this.route = route;
    }

    public ngOnInit(): void {
        this.loadUser();
    }

    public loadUser(): void {
        this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user :User) => {
            this.user = user;
        }, error => {
            this.alertify.error(error);
        });
    }
}
