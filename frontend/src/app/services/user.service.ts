import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/iuser';
import { Role } from '../models/role.enum';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  getAllWithRole(currUserToken: string, userRole: Role) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currUserToken}`
      });

      return this.http.post<any>(`${environment.apiUrl}/users/filter`, {field: "userRole", value: `${userRole}`}, {headers: headers});
  }

  getUser(login: string, password: string) {
      return this.http.post<string>(`${environment.apiUrl}/users/login`, {login, password});
  }

  register(user: IUser) {
      return this.http.post(`${environment.apiUrl}/users`, user);
  }
}
