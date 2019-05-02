import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from '@angular/router';
import { User } from '../_models/user';
import { UserService } from '../_services/user.service';
import { AlertifyService } from '../_services/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberDetailResolver implements Resolve<User> {
    
    private userService: UserService;
    private alertify: AlertifyService;
    private router: Router;

    
    public constructor(userService: UserService, alertify: AlertifyService, router: Router) {
        this.userService = userService;
        this.alertify = alertify;
        this.router = router;
    }

    public resolve(route: ActivatedRouteSnapshot): Observable<User> {
        return this.userService.getUser(route.params['id']).pipe(
            catchError(error => {
                this.alertify.error('Problem getting data.');
                this.router.navigate(['/members']);
                return of(null);
            })
        );
    }
}