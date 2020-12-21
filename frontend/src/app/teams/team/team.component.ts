import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from 'src/app/models/task';
import { Team } from 'src/app/models/team';
import { AuthService } from 'src/app/services/auth.service';
import { TasksService } from 'src/app/services/tasks.service';
import { faTrash, faEdit, faBell, faTintSlash } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Language } from 'src/app/models/language.enum';
import { TeamsService } from 'src/app/services/teams.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { logWarnings } from 'protractor/built/driverProviders';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {
    team: Team;
    tasksByMembers: Map<string, Task[]>;
    clickedTask: BehaviorSubject<Task> = new BehaviorSubject<Task>(null);
    
    wasTrashClicked = false;
    wasNotifyClicked = false;
    
    currentTaskForm: FormGroup;
    teamNameForm: FormGroup;
    teamDepartmentForm: FormGroup;
    teamLanguageControl: FormControl;

    tmpTags = [];
    submitted = false;
    loadingName = false;
    loadingDepartment = false;

    @ViewChild('modalCloseButton') modalCloseButton;

    // icons
    faTrash = faTrash;
    faEdit = faEdit;
    faBell = faBell;

    constructor(private authService: AuthService, private tasksService: TasksService, 
        private teamsService: TeamsService, private fb: FormBuilder, private route: ActivatedRoute,
        private cdRef: ChangeDetectorRef) { }

    ngAfterViewChecked() {
            this.cdRef.detectChanges();
    }

    ngOnInit(): void {
        const manager = this.authService.currentUserValue;

        this.route.params.pipe(map(p => p.teamName)).subscribe(teamName => {
                this.teamsService.loadAll(manager.login);
                this.team = this.teamsService.getTeam(teamName);

                // this.tasks = this.tasksService.tasks;
                this.tasksService.tasksByMembers.subscribe(tasksByMembers =>
                    {
                        this.tasksByMembers = tasksByMembers
                        this.team.members.forEach(member => 
                            {
                                if (!this.tasksByMembers.has(member.login))
                                    this.tasksByMembers.set(member.login, []);
                            });
                    }
                );
                this.tasksService.loadAll(this.team.name, manager.language);
        
                this.teamLanguageControl = new FormControl(manager.language);
        
                this.teamLanguageControl.valueChanges.subscribe((language: any) => {
                    this.onLanguageChange(language);
                });
        
                this.teamNameForm = this.fb.group({
                    teamName: [this.team.name, Validators.required]
                });
        
                this.teamDepartmentForm = this.fb.group({
                    departmentName: [this.team.department, Validators.required]
                });
        });
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
            duration: [task.duration ? task.duration : ''],
            status: [task.status]
        });

        this.tmpTags = [];
        
        task.tags.forEach(t => this.tmpTags.push({display: t, value: t}));
    }

    onTrashClicked()
    {
        this.wasTrashClicked = true;
    }

    onTaskClicked(userLogin: string, taskId: number)
    {
        this.clickedTask.next(this.tasksByMembers.get(userLogin).find(task => task.id === taskId));
        this.setCurrentForm();
    }

    closeModal()
    {
        this.wasTrashClicked = false;
        this.wasNotifyClicked = false;
        this.clickedTask.next(null);
        this.submitted = false;
    }

    deleteClickedTask()
    {
        this.tasksService.remove(this.clickedTask.value);
        this.closeModal();
    }

    notifyClickedTask()
    {
        // TODO make notifying
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
                task.tags = [];
                this.tmpTags.forEach(t => task.tags.push(t.value));
                task.duration = this.currentTaskForm.get('duration').value;
                task.status = this.currentTaskForm.get('status').value;
                this.tasksService.update(task);
            } else {
                const nTask = new Task({
                    title: this.currentTaskForm.get('title').value, 
                    description: this.currentTaskForm.get('description').value, 
                    userLogin: this.currentTaskForm.get('user').value === "unassigned" ? null :
                        this.currentTaskForm.get('user').value, 
                    tags: [], 
                    duration: this.currentTaskForm.get('duration').value,
                    teamName: this.team.name,
                    status: this.currentTaskForm.get('status').value
                });
                this.tmpTags.forEach(t => nTask.tags.push(t.value));
                this.tasksService.create(nTask);
            }
            this.modalCloseButton.nativeElement.click();
        }
    }

    onLanguageChange(language: Language)
    {
        this.tasksService.loadAll(this.team.name, language);
    }

    onTeamNameChange()
    {
        // TODO
        this.loadingName = true;
        console.log(`Change team name to: ${this.teamNameForm.get('teamName').value}`);
        this.loadingName = false;
        // this.teamService.changeName(this.team.name, name);
    }

    onTeamDepartmentChange()
    {
        // TODO
        this.loadingDepartment = true;
        console.log(`Change team department to: ${this.teamDepartmentForm.get('departmentName').value}`);
        this.loadingDepartment = false;
        // this.teamService.changeDepartment(this.team.department, name);
    }

    onNotifyClicked()
    {
        this.wasNotifyClicked = true;
    }

    drop(event: CdkDragDrop<Task[]>) {
        if (event.previousContainer === event.container) {
          moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
            let task = event.container.data[event.currentIndex];
            task.userLogin = event.container.id;
            this.tasksService.update(task);
        }
    }

    get columnsIds(): string[] {
        let logins = this.team.members.map(member => member.login);
        logins.push('unassigned');
        return logins;
    }
}
