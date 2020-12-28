import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Team } from '../models/team';
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
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    
    this.http.post<any>(`${environment.apiUrl}/teams/filter`, {field: "manager", value: managerLogin ? managerLogin : "admin"}, { headers: headers}).subscribe(data => {
      this.dataStore.teams = data.body.Items;
      this._teams.next(Object.assign({}, this.dataStore).teams);
    }, error => console.log(error));
  }

  load(name: string) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    })
    this.http.post<any>(`${environment.apiUrl}/teams/filter`, {field: "teamName", value: name}, { headers: headers}).subscribe(data => {
      let notFound = true;
      let team = data.body.Items[0];

      this.dataStore.teams.forEach((item, index) => {
        if (item.teamName === team.teamName) {
          this.dataStore.teams[index] = team;
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
      if (t.teamName === team.teamName) { this.dataStore.teams[i] = team; }
    });
    this._teams.next(Object.assign({}, this.dataStore).teams);
  }

  getTeamsOf(managerLogin: string) {
      return this.dataStore.teams.filter(team => team.manager === managerLogin);
  }

  getTeam(teamName: string) {
      return this.dataStore.teams.filter(team => team.teamName === teamName)[0];
  }

  remove(teamName: string) {
    // this.http.delete(`${environment.apiUrl}/teams/${teamId}`).subscribe(response => {
    //   this.dataStore.teams.forEach((t, i) => {
    //     if (t.id === teamId) { this.dataStore.teams.splice(i, 1); }
    //   });

    //   this._teams.next(Object.assign({}, this.dataStore).teams);
    // }, error => console.log('Could not delete team.'));
    this.dataStore.teams.forEach((t, i) => {
          if (t.teamName === teamName) { this.dataStore.teams.splice(i, 1); }
        });
  
        this._teams.next(Object.assign({}, this.dataStore).teams);
  }
}
