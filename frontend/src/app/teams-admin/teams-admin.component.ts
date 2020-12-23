import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { TeamsService } from '../services/teams.service';

@Component({
  selector: 'app-teams-admin',
  templateUrl: './teams-admin.component.html',
  styleUrls: ['./teams-admin.component.scss']
})
export class TeamsAdminComponent implements OnInit {

  teams: Team[];

  constructor(private teamsService: TeamsService) { }

  ngOnInit(): void {
    this.teamsService.teams.subscribe(teams => this.teams = teams);
    this.teamsService.loadAll();
  }

  addNewTeam()
  {

  }
}
