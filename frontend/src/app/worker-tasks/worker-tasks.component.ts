import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CommonModule} from '@angular/common';
import {BehaviorSubject} from 'rxjs';
import {Language} from '../models/language.enum';
import {Task} from '../models/task';
import {User} from '../models/user';
import {AlertService} from '../services/alert.service';
import {AuthService} from '../services/auth.service';
import {TasksService} from '../services/tasks.service';
import {UserService} from '../services/user.service';
import {faTrash, faEdit, faBell} from '@fortawesome/free-solid-svg-icons';
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
        let setLanguage = true;
        let isUserLanguageUpdating = false;

        if (this.isUpdating && this.tasksByUser.length !== 0 && setLanguage) {

          // changed languge corectlly
          let tasks = this.tasksByUser;
          if (this.user.userLanguage !== tasks[0].taskLanguage) {
            isUserLanguageUpdating = true;
            this.userService.update(this.user, tasks[0].taskLanguage).subscribe(
              data => {
                this.authService.changeLanguage(tasks[0].taskLanguage);
                setLanguage = false;
              },
              error => {
                this.userLanguageControl.setValue(this.user.userLanguage);
                this.alertService.error("Can not change display language.");
              }
            );
          }

        }
        if (this.isLanguageLoading && setLanguage && !isUserLanguageUpdating) {
          this.userLanguageControl.setValue(this.user.userLanguage);
          this.alertService.error("Can not change display language.");
        }
        this.isLoading = false;
        this.isLanguageLoading = false;
        this.isUpdating = false;
      }
    );

    this.isLoading = true;
    this.tasksService.loadForUser(this.user.login, this.user.userLanguage);

    this.userLanguageControl = new FormControl(this.user.userLanguage);

    this.userLanguageControl.valueChanges.subscribe((language: any) => {
      this.onLanguageChange(language);
    });

    this.catchError();
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
      this.isUpdating = true;
      this.tasksService.update(task, this.userLanguageControl.value);
      this.tasksService.updatePriorities(event.previousContainer.id);
      this.tasksService.updatePriorities(event.container.id);
    }
  }

  onTaskClicked(userLogin: string, taskId: number) {
    this.clickedTask.next(this.tasksByUser.find(task => task.id === taskId));
    this.setCurrentForm();
  }

  setCurrentForm() {
    const task = this.clickedTask.value;

    this.currentTaskForm = this.fb.group({
      teamName: [{value: task.teamName, disabled: true}, Validators.required],
      title: [{value: task.title, disabled: true}, Validators.required],
      description: [{value: task.description , disabled: true}],
      user: [{value: task.userLogin , disabled: true}],
      taskDuration: [task.taskDuration],
      taskStatus: [task.taskStatus]
    });

    this.tmpTags = [];

    task.tags.forEach(t => this.tmpTags.push({display: t, value: t}));
  }

  onTrashClicked() {
    this.wasTrashClicked = true;
  }

  get f() {
    return this.currentTaskForm.controls;
  }

  closeModal() {
    this.wasTrashClicked = false;
    this.wasNotifyClicked = false;
    this.clickedTask.next(null);
    this.submitted = false;
  }

  onSave() {
    this.submitted = true;
    if (this.currentTaskForm.valid) {
      let task = this.clickedTask.value;
      if (task.id) {
        task.title = this.currentTaskForm.get('title').value;
        task.description = this.currentTaskForm.get('description').value;
        task.userLogin = this.currentTaskForm.get('user').value === "unassigned" ? null :
          this.currentTaskForm.get('user').value,
        task.tags = [];
        this.tmpTags.forEach(t => task.tags.push(t.value));
        task.taskDuration = this.currentTaskForm.get('taskDuration').value;
        task.taskStatus = this.currentTaskForm.get('taskStatus').value;
        task.taskLanguage = this.userLanguageControl.value;
        task.teamName = this.currentTaskForm.get('teamName').value;
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

  deleteClickedTask() {
    this.tasksService.remove(this.clickedTask.value);
    this.closeModal();
  }

  catchError(){
    this.tasksService.error.subscribe(error => {
      if (error !== "") {
        this.alertService.error(error);
        this.isLoading = false;
        this.isLanguageLoading = false;
        this.isUpdating = false;
      }
    });
  }
}
