import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/message';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
    
    private userService: UserService;
    private authService: AuthService;
    private alertify: AlertifyService;
    private router: Router;
    private pageNumer = 1;
    private pageSize = 5;
    private messageContainer = 'Unread';

    
    public constructor(userService: UserService, alertify: AlertifyService, router: Router, authService: AuthService) {
        this.userService = userService;
        this.alertify = alertify;
        this.router = router;
        this.authService = authService;
    }

    public resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
        return this.userService.getMessages(this.authService.decodedToken.nameid, this.pageNumer, this.pageSize, this.messageContainer).pipe(
            catchError(error => {
                this.alertify.error('Problem getting data.');
                this.router.navigate(['/home']);
                return of(null);
            })
        );
    }
}