import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
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
  teams: Team[];
  isLoading = true;

  constructor(private authService: AuthService, private teamsService: TeamsService) { }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;

    this.teamsService.teams.subscribe(
      teams => {
        this.teams = teams;
        this.isLoading =  false;
      }
    );
    this.isLoading = true;
    this.teamsService.loadAll(user.login);
  }
}
