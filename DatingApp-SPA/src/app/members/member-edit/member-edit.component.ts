import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

    public user: User;

    private route: ActivatedRoute;


    public constructor(route: ActivatedRoute) { 
        this.route = route;
    }

    public ngOnInit() {
        this.route.data.subscribe(data => {
            this.user = data['user'];
        });
    }
}
