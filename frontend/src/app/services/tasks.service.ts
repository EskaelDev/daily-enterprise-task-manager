import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Language } from '../models/language.enum';
import { Task } from '../models/task';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private _tasksByMembers = new BehaviorSubject<Map<string, Task[]>>(new Map());
  private dataStore: { tasksByMembers: Map<string, Task[]>} = { tasksByMembers: new Map() };
  readonly tasksByMembers = this._tasksByMembers.asObservable();

  constructor(private http: HttpClient) { }

  loadAll(teamName: string, language: Language) {
    // this.http.get<Task[]>(`${environment.apiUrl}/tasks`).subscribe(data => {
    //   this.dataStore.tasks = data;
    //   this._tasks.next(Object.assign({}, this.dataStore).tasks);
    // }, error => console.log('Could not load tasks.'));
    const tasks: Task[] = [
      new Task({id:1, title: "title1", description: "", userLogin: "druciak", tags: ["tag1", "ta2", "tag5"], teamName: 'team1'}),
      new Task({id:2, title: "title2", description: "", userLogin: "druciak", tags: ["tag1"], teamName: 'team2'}),
      new Task({id:3, title: "title", description: "desc", tags: ["tag", "tagg"], teamName: 'team1'}),
      new Task({id:4, title: "title5", description: "desc", tags: ["tag"], teamName: 'team1'}),];

    tasks.forEach(t => {
      if (t.teamName === teamName) {
        let userLogin = t.userLogin ? t.userLogin : 'unassigned';
        if(this.dataStore.tasksByMembers.has(userLogin))
          this.dataStore.tasksByMembers.get(userLogin).push(t);
        else
          this.dataStore.tasksByMembers.set(userLogin, [t])
      }
    });
    this._tasksByMembers.next(Object.assign({}, this.dataStore).tasksByMembers);
  }

//   load(id: number | string) {
//     this.http.get<Task>(`${environment.apiUrl}/tasks/${id}`).subscribe(data => {
//       let notFound = true;

//       this.dataStore.tasksByMembers.forEach((item, index) => {
//         if (item.id === data.id) {
//           this.dataStore.tasks[index] = data;
//           notFound = false;
//         }
//       });

//       if (notFound) {
//         this.dataStore.tasks.push(data);
//       }

//       this._tasks.next(Object.assign({}, this.dataStore).tasks);
//     }, error => console.log('Could not load task.'));
//   }

  create(task: Task) {
    // this.http.post<Task>(`${environment.apiUrl}/tasks`, JSON.stringify(task)).subscribe(data => {
    //   this.dataStore.tasks.push(data);
    //   this._tasks.next(Object.assign({}, this.dataStore).tasks);
    // }, error => console.log('Could not create task.'));
    task.id = uuidv4();
    this.dataStore.tasksByMembers.get(task.userLogin ? task.userLogin : 'unassigned').push(task);
    this._tasksByMembers.next(Object.assign({}, this.dataStore).tasksByMembers);
  }

  update(task: Task) {
    // this.http.put<Task>(`${environment.apiUrl}/tasks/${task.id}`, JSON.stringify(task)).subscribe(data => {
    //   this.dataStore.tasks.forEach((t, i) => {
    //     if (t.id === data.id) { this.dataStore.tasks[i] = data; }
    //   });

    //   this._tasks.next(Object.assign({}, this.dataStore).tasks);
    // }, error => console.log('Could not update task.'));
    this.dataStore.tasksByMembers.get(task.userLogin ? task.userLogin : 'unassigned').forEach((t, i) => {
      if (t.id === task.id) { this.dataStore.tasksByMembers.get(task.userLogin ? task.userLogin : 'unassigned')[i] = task; }
    });
    this._tasksByMembers.next(Object.assign({}, this.dataStore).tasksByMembers);
  }

  remove(task: Task) {
    // this.http.delete(`${environment.apiUrl}/tasks/${taskId}`).subscribe(response => {
    //   this.dataStore.tasks.forEach((t, i) => {
    //     if (t.id === taskId) { this.dataStore.tasks.splice(i, 1); }
    //   });

    //   this._tasks.next(Object.assign({}, this.dataStore).tasks);
    // }, error => console.log('Could not delete task.'));
    this.dataStore.tasksByMembers.get(task.userLogin ? task.userLogin : 'unassigned').forEach((t, i) => {
          if (t.id === task.id) { this.dataStore.tasksByMembers.get(task.userLogin ? task.userLogin : 'unassigned').splice(i, 1); }
        });
  
        this._tasksByMembers.next(Object.assign({}, this.dataStore).tasksByMembers);
  }
}
