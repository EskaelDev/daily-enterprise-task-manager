import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../models/team';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';
import { TeamsService } from '../services/teams.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: Observable<Team[]>;

  constructor(private authService: AuthService, private teamsService: TeamsService) { }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;

    this.teams = this.teamsService.teams;
    this.teamsService.loadAll(user.login);
  }
}
