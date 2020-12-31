import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {Role} from '../models/role.enum';
import {User} from '../models/user';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  searchText = '';
  newUser: User = new User();
  users: User[] = [
    {
      login: 'alicjamakota',
      password: 'Makota',
      userRole: 0,
      userName: 'Alicja',
      surname: 'Makota',
      userLanguage: 1,
      token: 'adfgdghfg'
    },
    {
      login: 'markotto',
      password: 'Otto',
      userRole: 1,
      userName: 'Mark',
      surname: 'Otto',
      userLanguage: 0,
      token: 'adfgdghfg'
    },
    {
      login: 'jacobhornton',
      password: 'Thornton',
      userRole: 2,
      userName: 'Jacob',
      surname: 'Thornton',
      userLanguage: 0,
      token: 'adfgdghfg'
    },
    {
      login: 'larrybird',
      password: 'Bird',
      userRole: 1,
      userName: 'Larry',
      surname: 'Bird',
      userLanguage: 1,
      token: 'adfgdghfg'
    },
  ];

  constructor(private usersService: UserService, private authService: AuthService) {
  }

  ngOnInit(): void {

    this.usersService.getAll(this.authService.currentUserValue.token, Role.Manager).subscribe(
      data => {
        this.users = data.body.Items;
      },
      error => {
      }
    );

    this.usersService.getAll(this.authService.currentUserValue.token, Role.Worker).subscribe(
      data => {
        this.users = data.body.Items;
      },
      error => {
      }
    );

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

  addNewUser(){
    //TODO wysłać użytkownika newUser do bazy
  }
}
