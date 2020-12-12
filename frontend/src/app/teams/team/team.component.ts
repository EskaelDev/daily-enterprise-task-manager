import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from 'src/app/models/task';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { TasksService } from 'src/app/services/tasks.service';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  
  @Input()
  team: Team;
  tasks: Observable<Task[]>;

  constructor(private authService: AuthService, private tasksService: TasksService) { }

  ngOnInit(): void {
    this.tasks = this.tasksService.tasks;
    this.tasksService.loadAll();

    const manager = this.authService.currentUserValue;
    
    this.team = {name: "team1", department: "department1", manager: manager, members: [new User({login: "druciak"}),new User({login: "blablabla@bla.com"}),new User({login: "haluu@bla.com"}),
    new User({login: "kasia@bla.com"}), new User({login: "dobranoc@bla.com"})]};
  }

  addTask(userLogin?: string)
  {
      this.tasksService.create(new Task({title: "added task", description: "", userLogin: userLogin, tags: [], teamName: this.team.name}));
  }

  getTasksByMembers(userLogin?: string)
  {
      return this.tasksService.getTasksOf(userLogin);
  }
}
