import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Team } from '../models/team';
import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private _teams = new BehaviorSubject<Team[]>([]);
  private dataStore: { teams: Team[] } = { teams: [] };
  readonly teams = this._teams.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  loadAll(managerLogin?: string) {
    // const headers = new Headers({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${auth_token}`
    // })
    // return this.http.get(apiUrl, { headers: headers })
    // this.http.post<Team[]>(`${environment.apiUrl}/api/teams/filter`, {field: "manager", value: managerLogin}).subscribe(data => {
    //   this.dataStore.teams = data;
    //   this._teams.next(Object.assign({}, this.dataStore).teams);
    // }, error => console.log('Could not load teams.'));
    const manager = this.authService.currentUserValue;
    let teams = [
      {name: "team1", department: "department1", manager: manager, members: [new User({login: "druciak", name: "Aleksandra", surname: "Druciak"}),new User({login: "blablabla@bla.com"}),
      new User({login: "haluu@bla.com"}), new User({login: "kasia@bla.com"})]},
      {name: "team2", department: "department2", manager: manager, members: [new User({login: "dobranoc@bla.com"})]}
    ];
    this.dataStore.teams = teams.filter(team => team.manager.login === managerLogin);
    this._teams.next(Object.assign({}, this.dataStore).teams);
  }

  load(name: string) {
    this.http.get<Team>(`${environment.apiUrl}/teams/${name}`).subscribe(data => {
      let notFound = true;

      this.dataStore.teams.forEach((item, index) => {
        if (item.name === data.name) {
          this.dataStore.teams[index] = data;
          notFound = false;
        }
      });

      if (notFound) {
        this.dataStore.teams.push(data);
      }

      this._teams.next(Object.assign({}, this.dataStore).teams);
    }, error => console.log('Could not load team.'));
  }

  create(team: Team) {
    // this.http.post<Team>(`${environment.apiUrl}/teams`, JSON.stringify(team)).subscribe(data => {
    //   this.dataStore.teams.push(data);
    //   this._teams.next(Object.assign({}, this.dataStore).teams);
    // }, error => console.log('Could not create team.'));
    this.dataStore.teams.push(team);
    this._teams.next(Object.assign({}, this.dataStore).teams);
  }

  update(team: Team) {
    // this.http.put<Team>(`${environment.apiUrl}/teams/${team.id}`, JSON.stringify(team)).subscribe(data => {
    //   this.dataStore.teams.forEach((t, i) => {
    //     if (t.name === data.name) { this.dataStore.teams[i] = data; }
    //   });

    //   this._teams.next(Object.assign({}, this.dataStore).teams);
    // }, error => console.log('Could not update team.'));
    this.dataStore.teams.forEach((t, i) => {
      if (t.name === team.name) { this.dataStore.teams[i] = team; }
    });
    this._teams.next(Object.assign({}, this.dataStore).teams);
  }

  getTeamsOf(managerLogin: string) {
      return this.dataStore.teams.filter(team => team.manager.login === managerLogin);
  }

  getTeam(teamName: string) {
      return this.dataStore.teams.filter(team => team.name === teamName)[0];
  }

  remove(teamName: string) {
    // this.http.delete(`${environment.apiUrl}/teams/${teamId}`).subscribe(response => {
    //   this.dataStore.teams.forEach((t, i) => {
    //     if (t.id === teamId) { this.dataStore.teams.splice(i, 1); }
    //   });

    //   this._teams.next(Object.assign({}, this.dataStore).teams);
    // }, error => console.log('Could not delete team.'));
    this.dataStore.teams.forEach((t, i) => {
          if (t.name === teamName) { this.dataStore.teams.splice(i, 1); }
        });
  
        this._teams.next(Object.assign({}, this.dataStore).teams);
  }
}
