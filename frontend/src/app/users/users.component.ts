import {Component, Injectable, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {Role} from '../models/role.enum';
import {Language} from '../models/language.enum';
import {User} from '../models/user';
import {AuthService} from '../services/auth.service';
import {UsersService} from '../services/users.service';
import {AlertService} from '../services/alert.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  newUser: User = new User();
  users: User[];
  searchText = '';
  isLoading = true;

  constructor(private usersService: UsersService, private userService: UserService, private alertService: AlertService, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.usersService.users.subscribe(
      data => {
        this.users = data;
        this.isLoading = false;
      }
    );

    this.usersService.error.subscribe(error => {
      if (error !== "") {
        this.alertService.error(error);
        this.isLoading = false;
      }
    });
    this.isLoading = true;
    this.usersService.loadAll();
  }

  onDeleteUserClicked(userToDelete: User) {
    this.usersService.remove(userToDelete);
  }

  getRoleName(userRole: Role): string {
    if (userRole === 0) {
      return 'Admin';
    } else if (userRole === 1) {
      return 'Manager';
    } else if (userRole === 2) {
      return 'Worker';
    }
  }

  setUserRole(role: Role): void {
    this.newUser.userRole = role;
  }

  editUser(i: number) {

  }

  addNewUser() {
    this.usersService.create(this.newUser);
  }
}
