import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
    @ViewChild('editForm') public editForm: NgForm;

    public user: User;
    public photoUrl: string;

    private route: ActivatedRoute;
    private alertify: AlertifyService;
    private userService: UserService;
    private authService: AuthService;


    public constructor(route: ActivatedRoute, alertify: AlertifyService, userService: UserService, authService: AuthService) { 
        this.route = route;
        this.alertify = alertify;
        this.authService = authService;
        this.userService = userService;
    }

    public ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.user = data['user'];
        });
        this.authService.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl);
    }

    @HostListener('window:beforeunload', ['$event'])
    public unloadNotification($event: any): void {
        if (this.editForm.dirty) {
            $event.returnValue = true;
        }
    }

    public updateUser(): void {
        this.userService.updateUser(this.authService.decodedToken.nameid, this.user).subscribe(next => {
            this.editForm.reset(this.user);
            this.alertify.success('Profile updated successfully!');
        }, error => {
            this.alertify.error(error);
        });
    }

    public updateMainPhoto(photoUrl: string): void {
        this.user.photoUrl = photoUrl;
    }
}
