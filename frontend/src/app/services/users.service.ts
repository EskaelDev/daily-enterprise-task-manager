import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private _users = new BehaviorSubject<User[]>([]);
  private dataStore: { users: User[] } = { users: [] };
  readonly users = this._users.asObservable();
  private _error = new BehaviorSubject<string>("");
  readonly error = this._error.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  loadAll(adminLogin?: string) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>(`${environment.apiUrl}/users/all`, {headers: headers}).subscribe(
      data => {
        this.dataStore.users = data.body.Items;
        this._users.next(Object.assign({}, this.dataStore).users);
      }, () => this._error.next("Cannot load users"));
  }
}


