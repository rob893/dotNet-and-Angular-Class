import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    @Output() cancelRegister: EventEmitter<boolean> = new EventEmitter();
    
    public model: any = {};

    private authService: AuthService;


    public constructor(authService: AuthService) { 
        this.authService = authService;
    }

    ngOnInit() {
    }

    public register(): void {
        this.authService.register(this.model).subscribe(() => {
            console.log("Registration successful");
        }, error => {
            console.log(error);
        });
    }

    public cancel(): void {
        this.cancelRegister.emit(false);
    }
}
