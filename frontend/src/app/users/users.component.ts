import {Component, Injectable, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {Role} from '../models/role.enum';
import {Language} from '../models/language.enum';
import {User} from '../models/user';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { AlertService } from '../services/alert.service';

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
    // = [
  //   {
  //     login: 'alicjamakota',
  //     password: 'Makota',
  //     userRole: 0,
  //     userName: 'Alicja',
  //     surname: 'Makota',
  //     userLanguage: 1,
  //     token: 'adfgdghfg'
  //   },
  //   {
  //     login: 'markotto',
  //     password: 'Otto',
  //     userRole: 1,
  //     userName: 'Mark',
  //     surname: 'Otto',
  //     userLanguage: 0,
  //     token: 'adfgdghfg'
  //   },
  //   {
  //     login: 'jacobhornton',
  //     password: 'Thornton',
  //     userRole: 2,
  //     userName: 'Jacob',
  //     surname: 'Thornton',
  //     userLanguage: 0,
  //     token: 'adfgdghfg'
  //   },
  //   {
  //     login: 'larrybird',
  //     password: 'Bird',
  //     userRole: 1,
  //     userName: 'Larry',
  //     surname: 'Bird',
  //     userLanguage: 1,
  //     token: 'adfgdghfg'
  //   },
  // ];

  constructor(private usersService: UsersService, private userService: UserService, private alertService: AlertService) {
  }

  ngOnInit(): void {
    this.usersService.users.subscribe(
      users => {
        this.users = users;
        this.isLoading =  false;
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

    // this.usersService.getAllWithRole(this.authService.currentUserValue.token, Role.Manager).subscribe(
    //   data => { this.users = data.body.Items},
    //   error => { //TODO
    //   }
    // );
  }

  onDeleteUserClicked(idx: number) {
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
    this.newUser.userLanguage = Language.ENG;
    this.userService.register(this.newUser)
  }
}
