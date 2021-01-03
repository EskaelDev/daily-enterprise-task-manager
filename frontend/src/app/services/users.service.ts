import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {environment} from 'src/environments/environment';
import {User} from '../models/user';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class UsersService {
  private _users = new BehaviorSubject<User[]>([]);
  private dataStore: { users: User[] } = {users: []};
  readonly users = this._users.asObservable();
  private _error = new BehaviorSubject<string>("");
  readonly error = this._error.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) {
  }

  loadAll(adminLogin?: string) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(`${environment.apiUrl}/users/all`, {headers: headers}).subscribe(
      data => {
        this.dataStore.users = data.body;
        this._users.next(Object.assign({}, this.dataStore).users);
      }, () => this._error.next("Cannot load users"));
  }

  create(user: User) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<User>(`${environment.apiUrl}/users`, JSON.stringify(user), {headers: headers}).subscribe(() => {
      this.dataStore.users.push(user);
      this._users.next(Object.assign({}, this.dataStore).users);
    }, () => this._error.next('Could not create user.'));
  }

  update(user: User) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let userToUpdate = User.prepareToUpdate(user);
    console.log(JSON.stringify(userToUpdate));
    this.http.put<User>(`${environment.apiUrl}/users/`, JSON.stringify(userToUpdate), {headers: headers}).subscribe(() => {
      this.load(user.login);
    }, () => this._error.next('Could not edit user.'));
    //TODO
  }

  load(login: string) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(`${environment.apiUrl}/users/${login}`, { headers: headers}).subscribe(data => {
      let notFound = true;
      let user: User = data.body;

      this.dataStore.users.forEach((item, index) => {
        if (item.login === user.login) {
          this.dataStore.users[index] = user;
          notFound = false;
        }
      });

      if (notFound) {
        this.dataStore.users.push(user);
      }

      this._users.next(Object.assign({}, this.dataStore).users);
    }, () => this._error.next('Could not load user.'));
  }

  remove(userLogin: string) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete<string>(`${environment.apiUrl}/users/${userLogin}`, {headers: headers}).subscribe(() => {
      this.dataStore.users.forEach((u, i) => {
        if (u.login === userLogin) {
          this.dataStore.users.splice(i, 1);
        }
      });
      this._users.next(Object.assign({}, this.dataStore).users);
    }, () => this._error.next('Could not delete user.'));
  }
}
