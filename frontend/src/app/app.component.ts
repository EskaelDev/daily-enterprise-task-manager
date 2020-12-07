import { Component, OnInit } from '@angular/core';
import { IUser } from './models/iuser';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Task Manager';
  currentUser: IUser;

    constructor(public authService: AuthService) {
        this.authService.currentUser.subscribe(
            (currentUser: IUser)  => this.currentUser = currentUser
        );
    }

    async ngOnInit() {
        this.currentUser = await this.authService.currentUserValue;
    }
    
    logout() {
        this.authService.logout('/');
    }
}
