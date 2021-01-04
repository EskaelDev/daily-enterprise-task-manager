import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {BehaviorSubject} from 'rxjs';
import { Language } from '../models/language.enum';
import {Task} from '../models/task';
import { User } from '../models/user';
import {AlertService} from '../services/alert.service';
import {AuthService} from '../services/auth.service';
import {TasksService} from '../services/tasks.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-worker-tasks',
  templateUrl: './worker-tasks.component.html',
  styleUrls: ['./worker-tasks.component.scss']
})
export class WorkerTasksComponent implements OnInit {

  user: User;
  tasks: Task[];
  clickedTask: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
  currentTaskForm: FormGroup;
  userTasksForm: FormGroup;
  userTasks: FormGroup;

  isLoading = true;
  searchText = '';
  submitted = false;
  userLanguageControl: FormControl;

  constructor(private authService: AuthService, private tasksService: TasksService,
              private fb: FormBuilder, private route: ActivatedRoute, private alertService: AlertService, private userService: UserService) {
  }

  ngOnInit(): void {
    const user = this.authService.currentUserValue;

    this.tasksService.tasksByUser.subscribe(
      data => {
        this.tasks = data;
        this.isLoading = false;
      }
    );

    this.tasksService.error.subscribe(error => {
      if (error !== "") {
        this.alertService.error(error);
        this.isLoading = false;
      }
    });
    this.isLoading = true;
    this.tasksService.loadForUser(user.login);

    this.userLanguageControl = new FormControl(user.userLanguage);

    this.userLanguageControl.valueChanges.subscribe((language: any) => {
      this.onLanguageChange(language);
    });
  }

  onLanguageChange(language: Language)
  {
    this.tasksService.loadForUser(this.user.login); // TODO
  }


}
