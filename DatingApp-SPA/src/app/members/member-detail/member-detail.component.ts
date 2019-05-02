import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

    public user: User;
    public galleryOptions: NgxGalleryOptions[];
    public galleryImages: NgxGalleryImage[];

    private userService: UserService;
    private alertify: AlertifyService;
    private route: ActivatedRoute;

    //Using route resolver to get user
    public constructor(userService: UserService, alertify: AlertifyService, route: ActivatedRoute) { 
        this.userService = userService;
        this.alertify = alertify;
        this.route = route;
    }

    public ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.user = data['user'];
        });

        this.galleryOptions = [
            {
                width: '500px',
                height: '500px',
                imagePercent: 100,
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                preview: false
            }
        ];

        this.galleryImages = this.getImages();
    }

    private getImages(): NgxGalleryImage[] {
        const imageUrls: NgxGalleryImage[] = [];

        for (let i = 0; i < this.user.photos.length; i++) {
            imageUrls.push({
                small: this.user.photos[i].url,
                medium: this.user.photos[i].url,
                big: this.user.photos[i].url,
                description: this.user.photos[i].description
            });
        }

        return imageUrls;
    }
}
