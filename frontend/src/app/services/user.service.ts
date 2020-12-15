import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/iuser';
import { Role } from '../models/role.enum';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  user: IUser = new User({login: "druciak", role: Role.Manager, name: "Aleksandra", surname: "Druciak", language: "EN"});
  constructor(private http: HttpClient) { }

  getAll() {
      return this.http.get<IUser[]>(`${environment.apiUrl}/users`);
  }

  getUser(login: string, password: string) {
      return this.http.post<string>(`${environment.apiUrl}/users/login`, {login, password});
    // return this.user;
  }

  register(user: IUser) {
      return this.http.post(`${environment.apiUrl}/users`, user);
  }

  delete(id: number) {
      return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
