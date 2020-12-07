import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../models/iuser';
import { User } from '../models/user';
import { map } from 'rxjs/operators';
import { UserService } from './user.service';

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

    login(username, password) {
        return this.userService.getUser().pipe(map(user => {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            // if (username === user.login && password === user.password)
            localStorage.setItem('currentUser', JSON.stringify(user));
            console.log("udalo sie");
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

    // async checkAuthenticated() {
    //     // const authenticated = await this.authClient.session.exists();
    //     // this.isAuthenticated.next(authenticated);
    //     return this.isAuthenticated.getValue();
    // }

    // async login(username: string, password: string) {
    //     if (this.password !== password || this.email !== username) {
    //         throw Error('We cannot handle the status');
    //     }
    //     this.isAuthenticated.next(true);

    //     // this.authClient.session.setCookieAndRedirect(transaction.sessionToken);
    // }

    // async logout(redirect: string) {
    //     try {
    //         this.isAuthenticated.next(false);
    //         this.router.navigate([redirect]);
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }
}
