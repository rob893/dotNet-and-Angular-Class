import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from  'rxjs/operators';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public baseUrl: string = 'http://localhost:5000/auth/';
    public decodedToken: any;
    
    private http: HttpClient;
    private jwtHelper = new JwtHelperService();

    public constructor(http: HttpClient) {
        this.http = http;
    }

    public login(model: any): Observable<void> {
        return this.http.post(this.baseUrl + 'login', model).pipe(
            map((response: any) => {
                const user = response;

                if (user) {
                    localStorage.setItem('token', user.token);
                    this.decodedToken = this.jwtHelper.decodeToken(user.token);
                }
            })
        );
    }

    public register(model: any): Observable<Object> {
        return this.http.post(this.baseUrl + 'register', model);
    }

    public loggedIn(): boolean {
        const token = localStorage.getItem('token');

        return !this.jwtHelper.isTokenExpired(token);
    }

    public decodeToken(): void {
        const token = localStorage.getItem('token');

        if (token) {
            this.decodedToken = this.jwtHelper.decodeToken(token);
        }
    }
}
