import { Component, OnInit } from '@angular/core';
import { Team } from '../models/team';
import { User } from '../models/user';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit {
  teams: Team[];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const manager = this.authService.currentUserValue;

    this.teams = [
      {name: "team1", department: "department1", manager: manager, members: [new User({login: "nanan@bla.com"}),new User({login: "blablabla@bla.com"}),
      new User({login: "haluu@bla.com"}), new User({login: "kasia@bla.com"})]},
      {name: "team2", department: "department2", manager: manager, members: [new User({login: "dobranoc@bla.com"})]}
    ];
  }

}
