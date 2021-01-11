import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { CommonModule } from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {Language} from '../models/language.enum';
import {Task} from '../models/task';
import {User} from '../models/user';
import {AlertService} from '../services/alert.service';
import {AuthService} from '../services/auth.service';
import {TasksService} from '../services/tasks.service';
import {UserService} from '../services/user.service';
import { faTrash, faEdit, faBell } from '@fortawesome/free-solid-svg-icons';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from "@angular/cdk/drag-drop";
import {any} from "codelyzer/util/function";
import {Team} from "../models/team";

@Component({
  selector: 'app-worker-tasks',
  templateUrl: './worker-tasks.component.html',
  styleUrls: ['./worker-tasks.component.scss']
})
export class WorkerTasksComponent implements OnInit {

  user: User;
  tasksByUser: Task[];
  userTeams: Task[];
  clickedTask: BehaviorSubject<Task> = new BehaviorSubject<Task>(new Task());
  currentTaskForm: FormGroup;

  tmpTags = [];

  isLoading = true;
  isLanguageLoading = false;
  isUpdating = false;
  searchText = '';
  submitted = false;
  userLanguageControl: FormControl;

  faTrash = faTrash;
  faEdit = faEdit;
  faBell = faBell;

  wasTrashClicked = false;
  wasNotifyClicked = false;

  @ViewChild('modalCloseButton') modalCloseButton;

  constructor(private authService: AuthService, private tasksService: TasksService,
              private fb: FormBuilder, private route: ActivatedRoute, private alertService: AlertService, private userService: UserService) {
  }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;

    this.tasksService.tasksByUser.subscribe(
      data => {
        this.tasksByUser = data;
        this.isLoading = false;
      }
    );

    this.tasksService.error.subscribe(error => {
      if (error !== "") {
        this.alertService.error(error);
        this.isLoading = false;
        this.isLanguageLoading = false;
      }
    });

    this.isLoading = true;
    this.tasksService.loadForUser(this.user.login, this.user.userLanguage);
    this.getUsersTeams();

    this.userLanguageControl = new FormControl(this.user.userLanguage);

    this.userLanguageControl.valueChanges.subscribe((language: any) => {
      this.onLanguageChange(language);
    });
  }

  onLanguageChange(language: Language) {
      let currentUser = this.authService.currentUserValue;
      this.isLanguageLoading = true;

      if (currentUser.userLanguage !== language) {
        this.isUpdating = true;
        this.tasksService.loadForUser(this.user.login, language);
      }
    }

  drop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.tasksService.updatePriorities(event.container.id);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
      let task = event.container.data[event.currentIndex];
      task.userLogin = event.container.id === "unassigned" ? null : event.container.id;
      // this.isUpdating = true;
      // this.tasksService.update(task, this.teamLanguageControl.value);
      this.tasksService.updatePriorities(event.previousContainer.id);
      this.tasksService.updatePriorities(event.container.id);
    }
  }

  onTaskClicked(userLogin: string, taskId: number)
  {
    this.clickedTask.next(this.tasksByUser.find(task => task.id === taskId));
    this.setCurrentForm();
  }

  setCurrentForm()
  {
    const task = this.clickedTask.value;

    this.currentTaskForm = this.fb.group({
      title: [task.title ? task.title : '', Validators.required],
      description: [task.description ? task.description : ''],
      user: [task.userLogin ? task.userLogin : 'unassigned'],
      taskDuration: [task.taskDuration ? task.taskDuration : ''],
      taskStatus: [task.taskStatus],
      teamName: [task.teamName ? task.teamName : '', Validators.required]
    });

    this.tmpTags = [];

    task.tags.forEach(t => this.tmpTags.push({display: t, value: t}));
  }

  onTrashClicked()
  {
    this.wasTrashClicked = true;
  }

  onNotifyClicked()
  {
    this.wasNotifyClicked = true;
  }

  addTask(userLogin?: string)
  {
    this.clickedTask.next(new Task({userLogin: userLogin}));
    this.setCurrentForm();
  }

  get f() { return this.currentTaskForm.controls; }


  closeModal()
  {
    this.wasTrashClicked = false;
    this.wasNotifyClicked = false;
    this.clickedTask.next(null);
    this.submitted = false;
  }

  onSave() {
    this.submitted = true;
    if (this.currentTaskForm.valid)
    {
      let task = this.clickedTask.value;
      if (task.id)
      {
        task.title = this.currentTaskForm.get('title').value;
        task.description = this.currentTaskForm.get('description').value;
        task.userLogin = this.currentTaskForm.get('user').value === "unassigned" ? null :
          this.currentTaskForm.get('user').value;
        task.tags = [];
        this.tmpTags.forEach(t => task.tags.push(t.value));
        task.taskDuration = this.currentTaskForm.get('taskDuration').value;
        task.taskStatus = this.currentTaskForm.get('taskStatus').value;
        task.taskLanguage = this.userLanguageControl.value;
        this.tasksService.update(task, this.userLanguageControl.value);
      } else {
        const nTask = new Task({
          title: this.currentTaskForm.get('title').value,
          description: this.currentTaskForm.get('description').value,
          userLogin: this.currentTaskForm.get('user').value === "unassigned" ? null :
            this.currentTaskForm.get('user').value,
          tags: [],
          taskDuration: this.currentTaskForm.get('taskDuration').value,
          teamName: this.currentTaskForm.get('teamName').value,
          taskStatus: this.currentTaskForm.get('taskStatus').value,
          taskLanguage: this.userLanguageControl.value
        });
        this.tmpTags.forEach(t => nTask.tags.push(t.value));
        this.tasksService.create(nTask, this.userLanguageControl.value);
      }
      this.modalCloseButton.nativeElement.click();
    }
  }

  getUsersTeams(){
    this.userTeams = this.tasksByUser.filter(task => task.teamName);
  }
  deleteClickedTask()
  {
    this.tasksService.remove(this.clickedTask.value);
    this.closeModal();
  }
}
