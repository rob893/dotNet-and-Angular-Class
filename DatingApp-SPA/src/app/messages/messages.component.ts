import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination, PaginatedResults } from '../_models/pagination';
import { UserService } from '../_services/user.service';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
    public messages: Message[];
    public pagination: Pagination;
    public messageContainer = "Unread";

    private userService: UserService;
    private authService: AuthService;
    private alertify: AlertifyService;
    private route: ActivatedRoute;


    public constructor(userService: UserService, authService: AuthService, alertify: AlertifyService, route: ActivatedRoute) { 
        this.userService = userService;
        this.authService = authService;
        this.alertify = alertify;
        this.route = route;
    }

    public ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.messages = data['messages'].result;
            this.pagination = data['messages'].pagination;
        })
    }

    public loadMessages(): void {
        this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage, this.pagination.itemsPerPage, this.messageContainer)
            .subscribe((res: PaginatedResults<Message[]>) => {
                this.messages = res.results;
                this.pagination = res.pagination;
            }, error => {
                this.alertify.error(error);
            });
    }

    public pageChanged(event: any): void {
        this.pagination.currentPage = event.page;
        this.loadMessages();
    }
}
