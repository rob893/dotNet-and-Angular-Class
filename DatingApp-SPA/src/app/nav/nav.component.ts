import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    public model: any = {};
    public authService: AuthService;

    private alertify: AlertifyService;


    public constructor(authService: AuthService, alertify: AlertifyService) {
        this.authService = authService;
        this.alertify = alertify;
    }

    ngOnInit() {
    }


    public login(): void {
        this.authService.login(this.model).subscribe(next => {
            this.alertify.success('Logged in successfully!');
        }, error => {
            this.alertify.error(error);
        });
    }

    public loggedIn(): boolean {
        return this.authService.loggedIn();
    }

    public logout(): void {
        localStorage.removeItem('token');
        this.alertify.message("Logged Out");
    }
}
