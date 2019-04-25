import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-nav',
    templateUrl: './nav.component.html',
    styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

    model: any = {};

    private authService: AuthService;


    public constructor(authService: AuthService) {
        this.authService = authService;
    }

    ngOnInit() {
    }


    login(): void {
        this.authService.login(this.model).subscribe(next => {
            console.log('Logged in successfully');
        }, error => {
            console.log(error);
        });
    }

    loggedIn(): boolean {
        const token: string = localStorage.getItem('token');

        return !!token;
    }

    logout(): void {
        localStorage.removeItem('token');
        console.log("logged out");
    }
}
