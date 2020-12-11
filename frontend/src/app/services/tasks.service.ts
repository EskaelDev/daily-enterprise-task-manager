import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private _tasks = new BehaviorSubject<Task[]>([]);
  private dataStore: { tasks: Task[] } = { tasks: [] };
  readonly tasks = this._tasks.asObservable();

  constructor(private http: HttpClient) { }

  loadAll() {
    // this.http.get<Task[]>(`${environment.apiUrl}/tasks`).subscribe(data => {
    //   this.dataStore.tasks = data;
    //   this._tasks.next(Object.assign({}, this.dataStore).tasks);
    // }, error => console.log('Could not load tasks.'));
    const tasks: Task[] = [
      {id:1, title: "title1", description: "", userId: 1, tags: ["tag1", "ta2", "tag5"]},
      {id:2, title: "title2", description: "", userId: 1, tags: ["tag1"]}];
    this.dataStore.tasks = tasks;
    this._tasks.next(Object.assign({}, this.dataStore).tasks);
  }

  load(id: number | string) {
    this.http.get<Task>(`${environment.apiUrl}/tasks/${id}`).subscribe(data => {
      let notFound = true;

      this.dataStore.tasks.forEach((item, index) => {
        if (item.id === data.id) {
          this.dataStore.tasks[index] = data;
          notFound = false;
        }
      });

      if (notFound) {
        this.dataStore.tasks.push(data);
      }

      this._tasks.next(Object.assign({}, this.dataStore).tasks);
    }, error => console.log('Could not load task.'));
  }

  create(task: Task) {
    // this.http.post<Task>(`${environment.apiUrl}/tasks`, JSON.stringify(task)).subscribe(data => {
    //   this.dataStore.tasks.push(data);
    //   this._tasks.next(Object.assign({}, this.dataStore).tasks);
    // }, error => console.log('Could not create task.'));
    this.dataStore.tasks.push(task);
    this._tasks.next(Object.assign({}, this.dataStore).tasks);
  }

  update(task: Task) {
    // this.http.put<Task>(`${environment.apiUrl}/tasks/${task.id}`, JSON.stringify(task)).subscribe(data => {
    //   this.dataStore.tasks.forEach((t, i) => {
    //     if (t.id === data.id) { this.dataStore.tasks[i] = data; }
    //   });

    //   this._tasks.next(Object.assign({}, this.dataStore).tasks);
    // }, error => console.log('Could not update task.'));
    this.dataStore.tasks.forEach((t, i) => {
      if (t.id === task.id) { this.dataStore.tasks[i] = task; }
    });
    this._tasks.next(Object.assign({}, this.dataStore).tasks);
  }

  getTasksOf(userId: number) {
    return this.dataStore.tasks.filter(task => task.userId == userId);
  }

  remove(taskId: number) {
    this.http.delete(`${environment.apiUrl}/tasks/${taskId}`).subscribe(response => {
      this.dataStore.tasks.forEach((t, i) => {
        if (t.id === taskId) { this.dataStore.tasks.splice(i, 1); }
      });

      this._tasks.next(Object.assign({}, this.dataStore).tasks);
    }, error => console.log('Could not delete task.'));
  }
}
