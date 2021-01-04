import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from 'src/app/models/task';
import { Team } from 'src/app/models/team';
import { AuthService } from 'src/app/services/auth.service';
import { TasksService } from 'src/app/services/tasks.service';
import { faTrash, faEdit, faBell } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Language } from 'src/app/models/language.enum';
import { TeamsService } from 'src/app/services/teams.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AlertService } from 'src/app/services/alert.service';
import { UserService } from 'src/app/services/user.service';

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
    teamDepartmentForm: FormGroup;
    teamLanguageControl: FormControl;

    tmpTags = [];
    submitted = false;
    loadingDepartment = false;
    isLoading = true;
    isLanguageLoading = false;
    isUpdating = false;

    searchText;

    @ViewChild('modalCloseButton') modalCloseButton;

    // icons
    faTrash = faTrash;
    faEdit = faEdit;
    faBell = faBell;

    constructor(private authService: AuthService, private tasksService: TasksService, 
        private teamsService: TeamsService, private fb: FormBuilder, private route: ActivatedRoute,
        private cdRef: ChangeDetectorRef, private alertService: AlertService,
        private userService: UserService) { }

    ngAfterViewChecked() {
        this.cdRef.detectChanges();
    }

    ngOnInit(): void {
        const manager = this.authService.currentUserValue;

        this.route.params.pipe(map(p => p.teamName)).subscribe(teamName => {
                this.teamsService.load(teamName);
                this.teamsService.teams.subscribe(teams => {
                    this.team = teams.find(t => t.teamName === teamName);

                    if (this.team && !this.loadingDepartment)
                    {
                        this.tasksService.tasksByMembers.subscribe(tasksByMembers =>
                            {
                                this.tasksByMembers = tasksByMembers;
                                this.team.Members.forEach(member => 
                                    {
                                        if (!this.tasksByMembers.has(member.login))
                                            this.tasksByMembers.set(member.login, []);
                                    });
                                if (!this.tasksByMembers.has('unassigned'))
                                    this.tasksByMembers.set('unassigned', []);
                                this.isLoading = false;
                                this.isLanguageLoading = false;
                                this.isUpdating = false;
                            }
                        );
                        this.isLoading = true;
                        this.tasksService.loadAll(this.team.teamName, manager.userLanguage);

                        this.teamLanguageControl = new FormControl(manager.userLanguage);
        
                        this.teamLanguageControl.valueChanges.subscribe((language: any) => {
                            this.onLanguageChange(language);
                        });
                
                        this.teamDepartmentForm = this.fb.group({
                            departmentName: [this.team.department, Validators.required]
                        });
                    }

                    if (this.loadingDepartment){
                        this.loadingDepartment = false;
                    }
                });

                this.teamsService.error.subscribe(error => {
                    if (error !== "") {
                      this.alertService.error(error);
                      this.isLoading = false;
                      this.loadingDepartment = false;
                    }
                  });

                this.tasksService.error.subscribe(error => {
                    if (error !== "") {
                      this.alertService.error(error);
                      this.isLoading = false;
                    }
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
            description: [task.description ? task.description.translation ? task.description.translation : task.description : ''], 
            user: [task.userLogin ? task.userLogin : 'unassigned'],
            taskDuration: [task.taskDuration ? task.taskDuration : ''],
            taskStatus: [task.taskStatus]
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
                task.taskDuration = this.currentTaskForm.get('taskDuration').value;
                task.taskStatus = this.currentTaskForm.get('taskStatus').value;
                task.taskLanguage = this.teamLanguageControl.value;
                this.tasksService.update(task, this.teamLanguageControl.value);
            } else {
                const nTask = new Task({
                    title: this.currentTaskForm.get('title').value, 
                    description: this.currentTaskForm.get('description').value, 
                    userLogin: this.currentTaskForm.get('user').value === "unassigned" ? null :
                        this.currentTaskForm.get('user').value, 
                    tags: [], 
                    taskDuration: this.currentTaskForm.get('taskDuration').value,
                    teamName: this.team.teamName,
                    taskStatus: this.currentTaskForm.get('taskStatus').value,
                    taskLanguage: this.teamLanguageControl.value
                });
                this.tmpTags.forEach(t => nTask.tags.push(t.value));
                this.tasksService.create(nTask, this.teamLanguageControl.value);
            }
            this.modalCloseButton.nativeElement.click();
        }
    }

    onLanguageChange(language: Language)
    {
        let currentUser = this.authService.currentUserValue;
        this.isLanguageLoading = true;

        if (currentUser.userLanguage !== language) {
            this.userService.update(currentUser, language).subscribe(
                data => {
                    this.authService.changeLanguage(language);
                    this.isUpdating = true;
                    this.tasksService.loadAll(this.team.teamName, language);},
                error => {
                    this.teamLanguageControl.setValue(currentUser.userLanguage);
                    this.alertService.error("Can not change display language.");} 
            );
        }
    }

    onTeamDepartmentChange()
    {
        if (this.teamDepartmentForm.get('departmentName').valid)
        {
            let val = this.teamDepartmentForm.get('departmentName').value;
            if (val !== this.team.department)
            {
                this.loadingDepartment = true;
                this.team.department = val;
                this.teamsService.update(this.team);
            }
        }
        else {
            this.alertService.error("Department name can not be empty!");
            this.teamDepartmentForm.setValue({departmentName: this.team.department});
        }
    }

    onNotifyClicked()
    {
        this.wasNotifyClicked = true;
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
            this.tasksService.update(task, this.teamLanguageControl.value);
            this.tasksService.updatePriorities(event.previousContainer.id);
            this.tasksService.updatePriorities(event.container.id);
        }
    }

    get columnsIds(): string[] {
        let logins = this.team.Members.map(member => member.login);
        logins.push('unassigned');
        return logins;
    }
}
