import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from 'src/app/models/task';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { TasksService } from 'src/app/services/tasks.service';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
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
    clickedTask: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
    currentTaskForm: FormGroup;
    tmpTags = [];
    submitted = false;

    @ViewChild('modalCloseButton') modalCloseButton;

    // icons
    faTrash = faTrash;
    faEdit = faEdit;

    constructor(private authService: AuthService, private tasksService: TasksService, private fb: FormBuilder,) { }

    ngOnInit(): void {
        this.tasks = this.tasksService.tasks;
        this.tasksService.loadAll();

        const manager = this.authService.currentUserValue;
        
        this.team = {name: "team1", department: "department1", manager: manager, members: [new User({login: "druciak"}),new User({login: "blablabla@bla.com"}),new User({login: "haluu@bla.com"}),
        new User({login: "kasia@bla.com"}), new User({login: "dobranoc@bla.com"})]};
    }

    get f() { return this.currentTaskForm.controls; }

    addTask(userLogin?: string)
    {
        this.clickedTask.next(new Task({userLogin: userLogin}));
        this.setCurrentForm();
    }

    setCurrentForm()
    {
        const task = this.clickedTask.value;

        this.currentTaskForm = this.fb.group({
            title: [task.title ? task.title : '', Validators.required],
            description: [task.description ? task.description : ''], 
            user: [task.userLogin ? task.userLogin : 'unassigned'],
            duration: [task.duration ? task.duration : '']
        });
        
        this.tmpTags = task.tags;
    }

    getTasksByMembers(userLogin?: string)
    {
        return this.tasksService.getTasksOf(userLogin);
    }

    onTrashClicked(taskId: number)
    {
        this.wasTrashClicked = true;
    }

    onTaskClicked(taskId: number)
    {
        this.tasks.subscribe(tasks => this.clickedTask.next(tasks.find(task => task.id === taskId)));
        this.setCurrentForm();
    }

    closeModal()
    {
        this.wasTrashClicked = false;
        this.clickedTask.next(null);
        this.submitted = false;
        this.tmpTags = [];
    }

    deleteClickedTask()
    {
        this.tasksService.remove(this.clickedTask.value.id);
        this.closeModal();
    }

    onSave()
    {
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
                task.tags = this.tmpTags;
                task.duration = this.currentTaskForm.get('duration').value;

                this.tasksService.update(task);
            } else {
                const nTask = new Task({
                    title: this.currentTaskForm.get('title').value, 
                    description: this.currentTaskForm.get('description').value, 
                    userLogin: this.currentTaskForm.get('user').value === "unassigned" ? null :
                        this.currentTaskForm.get('user').value, 
                    tags: this.tmpTags, 
                    duration: this.currentTaskForm.get('duration').value,
                    teamName: this.team.name
                });
                this.tasksService.create(nTask);
            }
            this.modalCloseButton.nativeElement.click();
        }
    }

    onTeamEditClicked()
    {
        //TODO
    }
}
