import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Task } from '../models/task';
import { v4 as uuidv4 } from 'uuid';
import { AuthService } from './auth.service';
import { Language } from '../models/language.enum';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private _tasksByMembers = new BehaviorSubject<Map<string, Task[]>>(new Map());
  private dataStore: { tasksByMembers: Map<string, Task[]>} = { tasksByMembers: new Map() };
  readonly tasksByMembers = this._tasksByMembers.asObservable();
  private _error = new BehaviorSubject<string>("");
  readonly error = this._error.asObservable();
  private sorter = (a: Task, b: Task) => a.priority - b.priority;

  constructor(private http: HttpClient, private authService: AuthService) { }

  loadAll(teamName: string, language: Language) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.http.post<any>(`${environment.apiUrl}/tasks/filter/`, {field: "teamName", value: teamName, language: `${language}`},
      { headers: headers}).subscribe(data => {
      let tasks = data.body.Items;
      this.dataStore.tasksByMembers = new Map<string, Task[]>();
      tasks.forEach(t => {
        let userLogin = t.userLogin ? t.userLogin : 'unassigned';
        if(this.dataStore.tasksByMembers.has(userLogin))
          this.dataStore.tasksByMembers.get(userLogin).push(t);
        else
          this.dataStore.tasksByMembers.set(userLogin, [t])
      });
      this.dataStore.tasksByMembers.forEach((val, key) => val.sort(this.sorter));
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

  create(task: Task, language: Language) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let tasks = this.dataStore.tasksByMembers.get(task.userLogin ? task.userLogin : 'unassigned');

    task.id = uuidv4();
    task.priority = tasks.length == 0 ? 1 : tasks[tasks.length-1].priority+1;
    tasks.push(task);
    tasks.sort(this.sorter);

    this.http.post<Task>(`${environment.apiUrl}/tasks`, JSON.stringify(task), {headers: headers}).subscribe(data => {
      this.loadAll(task.teamName, language);
    }, error => this._error.next('Could not create task.'));
  }

  update(task: Task, language: Language) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    let taskToUpdate = Task.createToUpdate(task);

    this.http.post<Task>(`${environment.apiUrl}/tasks`, JSON.stringify(taskToUpdate), {headers: headers}).subscribe(data => {
      this.loadAll(task.teamName, language);
    }, error => this._error.next('Could not update task.'));
  }

  updatePriorities(userLogin: string) {
    const token = this.authService.currentUserValue.token;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    this.prepareTasksToUpdatePriority(userLogin)

    let tasks = this.dataStore.tasksByMembers.get(userLogin);
    if (tasks.length !== 0)
    {
        this.http.post<any>(`${environment.apiUrl}/tasks/updatepriority`, JSON.stringify(tasks), {headers: headers}).subscribe(data => {}, error => this._error.next('Could not update task.'));
    }
  }

  private prepareTasksToUpdatePriority(userLogin: string)
  {
    let tasks = this.dataStore.tasksByMembers.get(userLogin);
    tasks.forEach((val, idx) => val.priority = idx);
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
