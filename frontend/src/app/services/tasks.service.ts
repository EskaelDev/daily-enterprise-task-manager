import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Task } from '../models/task';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private _tasksByMembers = new BehaviorSubject<Map<string, Task[]>>(new Map());
  private dataStore: { tasksByMembers: Map<string, Task[]>} = { tasksByMembers: new Map() };
  readonly tasksByMembers = this._tasksByMembers.asObservable();
  private _error = new BehaviorSubject<string>("");
  readonly error = this._error.asObservable();

  constructor(private http: HttpClient, private authService: AuthService) { }

  loadAll(teamName: string) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post<any>(`${environment.apiUrl}/tasks/filter/`, {field: "teamName", value: teamName}, { headers: headers}).subscribe(data => {
      let tasks = data.body.Items;
      this.dataStore.tasksByMembers = new Map<string, Task[]>();
      tasks.forEach(t => {
        let userLogin = t.userLogin ? t.userLogin : 'unassigned';
        if(this.dataStore.tasksByMembers.has(userLogin))
          this.dataStore.tasksByMembers.get(userLogin).push(t);
        else
          this.dataStore.tasksByMembers.set(userLogin, [t])
      });
      this._tasksByMembers.next(Object.assign({}, this.dataStore).tasksByMembers);
    }, error => this._error.next('Could not load tasks.'));
  }

  // load(id: number | string) {
  //   this.http.get<Task>(`${environment.apiUrl}/tasks/${id}`).subscribe(data => {
  //     let notFound = true;

  //     this.dataStore.tasksByMembers.forEach((item, index) => {
  //       if (item.id === data.id) {
  //         this.dataStore.tasks[index] = data;
  //         notFound = false;
  //       }
  //     });

  //     if (notFound) {
  //       this.dataStore.tasks.push(data);
  //     }

  //     this._tasks.next(Object.assign({}, this.dataStore).tasks);
  //   }, error => console.log('Could not load task.'));
  // }

  create(task: Task) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    task.id = uuidv4();

    this.dataStore.tasksByMembers.get(task.userLogin ? task.userLogin : 'unassigned').push(task);
    console.log(JSON.stringify(task));

    this.http.post<Task>(`${environment.apiUrl}/tasks`, JSON.stringify(task), {headers: headers}).subscribe(data => {
      this.loadAll(task.teamName);
    }, error => this._error.next('Could not create task.'));
  }

  update(task: Task) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let taskToUpdate = Task.createToUpdate(task);

    console.log(JSON.stringify(taskToUpdate));

    this.http.post<Task>(`${environment.apiUrl}/tasks`, JSON.stringify(taskToUpdate), {headers: headers}).subscribe(data => {
      this.loadAll(task.teamName);
    }, error => this._error.next('Could not update task.'));
  }

  remove(task: Task) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(`${environment.apiUrl}/tasks/${task.id}`, {headers: headers}).subscribe(response => {
      this.dataStore.tasksByMembers.get(task.userLogin ? task.userLogin : 'unassigned').forEach((t, i) => {
        if (t.id === task.id) { this.dataStore.tasksByMembers.get(task.userLogin ? task.userLogin : 'unassigned').splice(i, 1); }
      });

      this._tasksByMembers.next(Object.assign({}, this.dataStore).tasksByMembers);
    }, error => this._error.next('Could not delete task.'));
  }
}
