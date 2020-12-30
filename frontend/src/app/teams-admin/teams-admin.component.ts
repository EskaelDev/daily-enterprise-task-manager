import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { AlertService } from '../services/alert.service';
import { TeamsService } from '../services/teams.service';

@Component({
  selector: 'app-teams-admin',
  templateUrl: './teams-admin.component.html',
  styleUrls: ['./teams-admin.component.scss']
})
export class TeamsAdminComponent implements OnInit {

  teams: Team[];
  isLoading = true;
  searchText;

  constructor(private teamsService: TeamsService, private alertService: AlertService) { }

  ngOnInit(): void {
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
    this.teamsService.loadAll();
  }

  addNewTeam()
  {

  }
}
