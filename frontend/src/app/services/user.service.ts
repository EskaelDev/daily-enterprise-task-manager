import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/iuser';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getAll() {
      return this.http.get<IUser[]>(`${environment.apiUrl}/users`);
  }

  getUser(id: number = 1) {
    return this.http.get<IUser>(`${environment.apiUrl}/users/${id}`);
  }

  register(user: IUser) {
      return this.http.post(`${environment.apiUrl}/users`, user);
  }

  delete(id: number) {
      return this.http.delete(`${environment.apiUrl}/users/${id}`);
  }
}
