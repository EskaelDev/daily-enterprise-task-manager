import { Component, Input, OnInit } from '@angular/core';
import { Task } from 'src/app/models/task';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  
  @Input()
  team: Team;
  tasks: Task[];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const manager = this.authService.currentUserValue;
    
    this.team = {id: 1, name: "team1", manager: manager, members: [new User({login: "nanan@bla.com"}),new User({login: "blablabla@bla.com"}),new User({login: "haluu@bla.com"}),
    new User({login: "kasia@bla.com"})]};
    this.tasks = [
      {title: "title1", description: "", user: this.team.members[0], tags: ["tag1", "ta2", "tag5"]},
      {title: "title2", description: "", user: this.team.members[0], tags: ["tag1"]}];
  }

  addTask()
  {
      this.tasks.push({title: "added task", description: "", user: this.team.members[0], tags: []});
  }
}
