import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    public model: any = {};
    public authService: AuthService;

    private alertify: AlertifyService;
    private router: Router;


    public constructor(authService: AuthService, alertify: AlertifyService, router: Router) {
        this.authService = authService;
        this.alertify = alertify;
        this.router = router;
    }

    ngOnInit() {
    }


    public login(): void {
        this.authService.login(this.model).subscribe(next => {
            this.alertify.success('Logged in successfully!');
        }, error => {
            this.alertify.error(error);
        }, () => {
            this.router.navigate(['/members']);
        });
    }

    public loggedIn(): boolean {
        return this.authService.loggedIn();
    }

    public logout(): void {
        localStorage.removeItem('token');
        this.alertify.message("Logged Out");
        this.router.navigate(['/home']);
    }
}
