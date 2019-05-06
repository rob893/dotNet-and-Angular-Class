import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    baseUrl: string = environment.apiUrl;

    private http: HttpClient;


    public constructor(http: HttpClient) { 
        this.http = http;
    }

    public getUsers(): Observable<User[]> {
        return this.http.get<User[]>(this.baseUrl + 'users');
    }

    public getUser(id: number): Observable<User> {
        return this.http.get<User>(this.baseUrl + 'users/' + id);
    }

    public updateUser(id: number, user: User): Observable<User> {
        return this.http.put<User>(this.baseUrl + 'users/' + id, user);
    }

    public setMainPhoto(userId: number, photoId: number): Observable<object> {
        return this.http.post(this.baseUrl + 'users/' + userId + '/photos/' + photoId + '/setMain', {});
    }

    public deletePhoto(userId: number, photoId: number): Observable<object> {
        return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + photoId);
    }
}
