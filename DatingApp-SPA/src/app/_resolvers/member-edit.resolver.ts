import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
    
    private userService: UserService;
    private alertify: AlertifyService;
    private router: Router;
    private authService: AuthService

    
    public constructor(userService: UserService, alertify: AlertifyService, router: Router, authService: AuthService) {
        this.userService = userService;
        this.alertify = alertify;
        this.router = router;
        this.authService = authService;
    }

    public resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
            catchError(error => {
                this.alertify.error('Problem getting your data.');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
    }
}