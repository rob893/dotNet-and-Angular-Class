import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { Pagination, PaginatedResults } from '../_models/pagination';
import { AuthService } from '../_services/auth.service';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
    public users: User[];
    public pagination: Pagination;
    public likesParam: string;
    
    private authService: AuthService;
    private userService: UserService;
    private alertify: AlertifyService;
    private route: ActivatedRoute;


    public constructor(authService: AuthService, userService: UserService, alertify: AlertifyService, route: ActivatedRoute) { 
        this.authService = authService;
        this.userService = userService;
        this.alertify = alertify;
        this.route = route;
    }

    public ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.users = data['users'].result;
            this.pagination = data['users'].pagination;
        });

        this.likesParam = 'Likers';
    }

    public pageChanged(event: any): void {
        this.pagination.currentPage = event.page;
        this.loadUsers();
    }

    private loadUsers(): void {
        this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, null, this.likesParam).subscribe((res: PaginatedResults<User[]>) => {
            this.users = res.results;
            this.pagination = res.pagination;
        }, error => {
            this.alertify.error(error);
        });
    }
}
