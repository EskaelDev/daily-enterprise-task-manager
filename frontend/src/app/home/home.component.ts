import {Component, OnInit} from '@angular/core';
import {IUser} from '../models/iuser';
import {AuthService} from '../services/auth.service';
import {faTrash, faEdit, faBell, faTasks, faUserCog, faUser} from '@fortawesome/free-solid-svg-icons';
import {Role} from "../models/role.enum";
import {User} from "../models/user";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  faEdit = faEdit;
  faTasks = faTasks;
  faUserCog = faUserCog;
  faUser = faUser;


  constructor(public authService: AuthService) {
    this.authService.currentUser.subscribe(
      (currentUser: User) => {
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

  get isWorker() {
    return this.currentUser && Number(this.currentUser.userRole) === Role.Worker;
  }
}
