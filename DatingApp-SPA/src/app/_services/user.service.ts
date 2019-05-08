import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResults } from '../_models/pagination';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class UserService {
    baseUrl: string = environment.apiUrl;

    private http: HttpClient;


    public constructor(http: HttpClient) { 
        this.http = http;
    }

    public getUsers(page?: number, itemsPerPage?: number, userParams?: any): Observable<PaginatedResults<User[]>> {
        const paginatedResult: PaginatedResults<User[]> = new PaginatedResults<User[]>();

        let params: HttpParams = new HttpParams();

        if (page != null && itemsPerPage != null) {
            params = params.append('pageNumber', page.toString());
            params = params.append('pageSize', itemsPerPage.toString());
        }

        if (userParams != null) {
            params = params.append('minAge', userParams.minAge);
            params = params.append('maxAge', userParams.maxAge);
            params = params.append('gender', userParams.gender);
            params = params.append('orderBy', userParams.orderBy);
        }

        return this.http.get<User[]>(this.baseUrl + 'users', {observe: 'response', params})
            .pipe( //pipe gets us access to the rxjs operators 
                map(response => {
                    paginatedResult.results = response.body;

                    if (response.headers.get('Pagination') != null) {
                        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
                    }

                    return paginatedResult;
                })
            );
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
