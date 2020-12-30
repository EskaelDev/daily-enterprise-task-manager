import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { Role } from './models/role.enum';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Task Manager';
  currentUser: User;

    constructor(public authService: AuthService) {
        this.authService.currentUser.subscribe(
            (currentUser: User)  => {
                this.currentUser = currentUser;
            }
        );
    }

    async ngOnInit() {
        this.currentUser = await this.authService.currentUserValue;
    }
    
    get isAdmin() {
        return this.currentUser && Number(this.currentUser.userRole) === Role.Admin;
    }

    get isManager() {
        return this.currentUser && Number(this.currentUser.userRole) === Role.Manager;
    }

    logout() {
        this.authService.logout('/');
    }
}
