import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-value',
    templateUrl: './value.component.html',
    styleUrls: ['./value.component.css']
})
export class ValueComponent implements OnInit {

    public values: any;

    private http: HttpClient;


    public constructor(http: HttpClient) {
        this.http = http;
    }

    public ngOnInit() {
        this.getValues();
    }

    private getValues() {
        this.http.get('http://localhost:5000/api/values').subscribe(response => {
            this.values = response;
        }, error => {
            console.log(error);
        });
    }
}
