import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/iuser';
import { Language } from '../models/language.enum';
import { Role } from '../models/role.enum';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  authService: any;
  constructor(private http: HttpClient) { }

  getAllWithRole(currUserToken: string, userRole: Role) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currUserToken}`
      });

      return this.http.post<any>(`${environment.apiUrl}/users/filter`, {field: "userRole", value: `${userRole}`}, {headers: headers});
  }

  update(user: User, language: Language) {
    const token = user.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let userToUpdate = User.prepareToUpdate(user);
    userToUpdate.userLanguage = language;
    
    return this.http.put<any>(`${environment.apiUrl}/users/`, JSON.stringify(userToUpdate), {headers: headers});
  }

  getUser(login: string, password: string) {
      return this.http.post<string>(`${environment.apiUrl}/users/login`, {login, password});
  }

  register(user: IUser) {
      return this.http.post(`${environment.apiUrl}/users`, user);
  }
}
