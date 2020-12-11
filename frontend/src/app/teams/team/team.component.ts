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
    
    this.team = {id: 1, name: "team1", manager: manager, members: [new User({id: 1, login: "nanan@bla.com"}),new User({id:2,login: "blablabla@bla.com"}),new User({id:3, login: "haluu@bla.com"}),
    new User({id:7,login: "kasia@bla.com"})]};
  }

  addTask(userId: number)
  {
      this.tasksService.create(new Task({title: "added task", description: "", userId: userId, tags: []}));
  }

  getTasksByMembers(userId: number)
  {
      return this.tasksService.getTasksOf(userId);
      //filter(task => task.userId == userId);
  }
}
