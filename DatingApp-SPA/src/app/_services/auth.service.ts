import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from  'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    public baseUrl: string = 'http://localhost:5000/auth/';
    
    private http: HttpClient;

    public constructor(http: HttpClient) {
        this.http = http;
    }

    public login(model: any): Observable<void> {
        return this.http.post(this.baseUrl + 'login', model).pipe(
            map((response: any) => {
                const user = response;

                if (user) {
                    localStorage.setItem('token', user.token);
                }
            })
        );
    }

    public register(model: any): Observable<Object> {
        return this.http.post(this.baseUrl + 'register', model);
    }
}
