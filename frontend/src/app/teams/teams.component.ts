import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { AlertService } from '../services/alert.service';
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
  searchText;

  constructor(private authService: AuthService, private teamsService: TeamsService, private alertService: AlertService) { }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;

    this.teamsService.teams.subscribe(
      teams => {
        this.teams = teams;
        this.isLoading =  false;
      }
    );
    this.teamsService.error.subscribe(error => {
      if (error !== "") {
        this.alertService.error(error);
        this.isLoading = false;
      }
    });
    this.isLoading = true;
    this.teamsService.loadAll(user.login);
  }
}
