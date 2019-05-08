import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user.service';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResults } from 'src/app/_models/pagination';

@Component({
    selector: 'app-member-list',
    templateUrl: './member-list.component.html',
    styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {

    public users: User[];
    public user: User = JSON.parse(localStorage.getItem('user'));
    public genderList = [{value: 'male', display: 'Males'}, {value: 'female', display: 'Females'}];
    public userParams: any = {};
    public pagination: Pagination;

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
            this.users = data['users'].results;
            this.pagination = data['users'].pagination;
        });

        this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
        this.userParams.minAge = 18;
        this.userParams.maxAge = 99;
    }

    public resetFilters(): void {
        this.userParams.gender = this.user.gender === 'female' ? 'male' : 'female';
        this.userParams.minAge = 18;
        this.userParams.maxAge = 99;
        this.loadUsers();
    }

    public pageChanged(event: any): void {
        this.pagination.currentPage = event.page;
        this.loadUsers();
    }

    private loadUsers(): void {
        this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userParams).subscribe((res: PaginatedResults<User[]>) => {
            this.users = res.results;
            this.pagination = res.pagination;
        }, error => {
            this.alertify.error(error);
        });
    }
}
