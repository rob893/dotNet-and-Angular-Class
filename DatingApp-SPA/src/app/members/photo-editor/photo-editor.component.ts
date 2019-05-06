import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
    @Input()
    public photos: Photo[];

    @Output()
    public getMemberPhotoChange = new EventEmitter<string>();

    public uploader: FileUploader;
    public hasBaseDropZoneOver: boolean = false;

    private baseUrl = environment.apiUrl;
    private authService: AuthService;
    private userService: UserService;
    private alertify: AlertifyService;
    private currentMainPhoto: Photo;


    public constructor(authService: AuthService, userService: UserService, alertify: AlertifyService) { 
        this.authService = authService;
        this.userService = userService;
        this.alertify = alertify;
    }

    public ngOnInit(): void {
        this.initializeUploader();
    }

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    public setMainPhoto(photo: Photo): void {
        this.userService.setMainPhoto(this.authService.decodedToken.nameid, photo.id).subscribe(() => {
            this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
            this.currentMainPhoto.isMain = false;
            photo.isMain = true;
            this.authService.changeMemberPhoto(photo.url);
            this.authService.currentUser.photoUrl = photo.url;
            localStorage.setItem('user', JSON.stringify(this.authService.currentUser));
        }, error => {
            this.alertify.error(error);
        });
    }

    public deletePhoto(photoId: number): void {
        this.alertify.confirm('Are you sure you want to delete this photo?', () => {
            this.userService.deletePhoto(this.authService.decodedToken.nameid, photoId).subscribe(() => {
                this.photos.splice(this.photos.findIndex(p => p.id === photoId), 1);
                this.alertify.success('Photo has been deleted!');
            }, error => {
                this.alertify.error(error);
            });
        });
    }

    private initializeUploader() {
        this.uploader = new FileUploader({
            url: this.baseUrl + 'users/' + this.authService.decodedToken.nameid + '/photos',
            authToken: 'Bearer ' + localStorage.getItem('token'),
            isHTML5: true,
            allowedFileType: ['image'],
            removeAfterUpload: true,
            autoUpload: false,
            maxFileSize: 10 * 1024 * 1024
        });

        this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; }

        this.uploader.onSuccessItem = (item, response, status, headers) => {
            if (response) {
                const res: Photo = JSON.parse(response);
                const photo = {
                    id: res.id,
                    url: res.url,
                    dateAdded: res.dateAdded,
                    description: res.description,
                    isMain: res.isMain
                };

                this.photos.push(photo);
            }
        }
    }
}
