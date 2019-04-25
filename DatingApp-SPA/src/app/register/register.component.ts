import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    @Output() cancelRegister: EventEmitter<boolean> = new EventEmitter();
    
    public model: any = {};

    private authService: AuthService;
    private alertify: AlertifyService


    public constructor(authService: AuthService, alertify: AlertifyService) { 
        this.authService = authService;
        this.alertify = alertify;
    }

    ngOnInit() {
    }

    public register(): void {
        this.authService.register(this.model).subscribe(() => {
            this.alertify.success("Registration Successful!");
        }, error => {
            this.alertify.error(error);
        });
    }

    public cancel(): void {
        this.cancelRegister.emit(false);
    }
}
