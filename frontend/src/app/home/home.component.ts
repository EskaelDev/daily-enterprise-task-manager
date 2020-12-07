import { Component, OnInit } from '@angular/core';
import { IUser } from '../models/iuser';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    currentUser: IUser;
    constructor(private authenticationService: AuthService) { 
            this.currentUser = this.authenticationService.currentUserValue;
        }

    ngOnInit(): void {
    }

    logout()
    {
        this.authenticationService.logout("/login");
    }
}
