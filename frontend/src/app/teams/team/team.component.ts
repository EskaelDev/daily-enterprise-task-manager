import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from 'src/app/models/task';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { TasksService } from 'src/app/services/tasks.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
  
    @Input()
    team: Team;
    tasks: Observable<Task[]>;
    wasTrashClicked = false;
    clickedTask: Task = null;
    taskForm: FormGroup;

    items = ['Pizza', 'Pasta', 'Parmesan'];

    // icons
    faTrash = faTrash;

    constructor(private authService: AuthService, private tasksService: TasksService, private fb: FormBuilder,) { }

    ngOnInit(): void {
        this.tasks = this.tasksService.tasks;
        this.tasksService.loadAll();

        const manager = this.authService.currentUserValue;

        this.taskForm = this.fb.group({
            title: ['', Validators.required]
        });
        
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

    onTrashClicked(taskId: number)
    {
        this.wasTrashClicked = true;
        console.log("On trash")
    }

    onTaskClicked(taskId: number)
    {
        this.tasks.subscribe(tasks => this.clickedTask = tasks.find(task => task.id == taskId));
        console.log("On task")
    }

    closeModal()
    {
        this.wasTrashClicked = false;
        this.clickedTask = null;
    }

    deleteClickedTask()
    {
        this.tasksService.remove(this.clickedTask.id);
        this.closeModal();
    }

    onSubmit()
    {

    }
}
