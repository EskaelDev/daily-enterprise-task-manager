import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/iuser';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';
import jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private userService: UserService, private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(login, password) {
        return this.userService.getUser(login, password).pipe(map(token => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            let decoded: IUser = jwt_decode(token);
            let user = new User(decoded);
            user.token = token;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            return user;
        }));
    }

    logout(redirect: string) {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        this.router.navigate([redirect]);
    }
}
