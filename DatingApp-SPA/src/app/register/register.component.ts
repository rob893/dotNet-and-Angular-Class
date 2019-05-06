import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
    @Output() cancelRegister: EventEmitter<boolean> = new EventEmitter();
    
    public model: any = {};
    public registerForm: FormGroup;

    private authService: AuthService;
    private alertify: AlertifyService;
    private formBuilder: FormBuilder;


    public constructor(authService: AuthService, alertify: AlertifyService, formBuilder: FormBuilder) { 
        this.authService = authService;
        this.alertify = alertify;
        this.formBuilder = formBuilder;
    }

    public ngOnInit(): void {
        this.createRegisterForm();
    }

    private createRegisterForm(): void {
        this.registerForm = this.formBuilder.group({
            gender: ['male'],
            username: ['', Validators.required],
            knownAs: ['', Validators.required],
            dateOfBirth: [null, Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
            confirmPassword: ['', Validators.required]
        }, {
            validator: this.passwordMatchValidator
        });
    }

    //custom validator
    private passwordMatchValidator(g: FormGroup) {
        return g.get('password').value === g.get('confirmPassword').value ? null : { 'mismatch': true };
    }

    public register(): void {
        // this.authService.register(this.model).subscribe(() => {
        //     this.alertify.success("Registration Successful!");
        // }, error => {
        //     this.alertify.error(error);
        // });
        console.log(this.registerForm.value);
    }

    public cancel(): void {
        this.cancelRegister.emit(false);
    }
}
