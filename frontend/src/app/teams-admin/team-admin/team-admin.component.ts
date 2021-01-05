import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { TeamsService } from 'src/app/services/teams.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Role } from 'src/app/models/role.enum';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-team-admin',
  templateUrl: './team-admin.component.html',
  styleUrls: ['./team-admin.component.scss'],
})
export class TeamAdminComponent implements OnInit {

    team: Team;
    managers: User[];
    workers: User[];
    
    teamForm: FormGroup;

    isNewTeam = false;
    isUpdating = false;
    isDeleting = false;
    submitted = false;
    isPosted = false;

    formatter = (user: User) => `${user.surname} ${user.userName}`;
    searchManagers = (text$: Observable<string>) =>
        text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term => term === '' ? []
            : this.managers.filter(m => (`${m.surname} ${m.userName}`).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
        );

    searchMembers = (text$: Observable<string>) =>
        text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        map(term => term === '' ? []
            : this.workers.filter(w => (`${w.surname} ${w.userName}`).toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
        );
    chosenManager: User;
    chosenWorker: User;

    // icons
    faTimes = faTimes;

    get f() { return this.teamForm.controls; }
    
    constructor(private teamsService: TeamsService, private fb: FormBuilder, private route: ActivatedRoute,
        private alertService: AlertService, private router: Router,
        private usersService: UserService, private authService: AuthService) { }

    ngOnInit(): void {
        this.teamForm = this.fb.group({
            teamName: ['', Validators.required],
            department: ['', Validators.required]
        });

        this.route.params.pipe(map(p => p.teamName)).subscribe(teamName => {
            if (!teamName) {
                this.team = new Team();
                this.isNewTeam = true;
            }
            else {
                this.teamsService.load(teamName);
                this.teamsService.teams.subscribe(teams => {
                    this.team = teams.find(t => t.teamName === teamName);

                    if (this.team)
                    {
                        this.teamForm.setValue({
                            teamName: this.team.teamName,
                            department: this.team.department ? this.team.department : ''
                        });
                    }

                    if (this.isUpdating && !this.isNewTeam)
                    {
                        this.isUpdating = false;
                        this.isPosted = true;
                        this.alertService.success("Team successfully updated.");
                    } else if (this.isUpdating)
                    {
                        this.isUpdating = false;
                        this.alertService.success("Team successfully created.");
                    }
                });

                this.teamsService.error.subscribe(error => {
                    if (error !== "") {
                        this.alertService.error(error);
                        this.isUpdating = false;
                    }
                });
            }
        });

        this.usersService.getAllWithRole(this.authService.currentUserValue.token, Role.Manager).subscribe(
            data => { this.managers = data.body.Items},
            error => { this.alertService.error("Can not load managers...");
            }
          );

        this.usersService.getAllWithRole(this.authService.currentUserValue.token, Role.Worker).subscribe(
            data => { this.workers = data.body.Items},
            error => { this.alertService.error("Can not load workers...");
            }
          );
    }

    onDeleteMemberClicked(idx: number)
    {
        this.team.members.splice(idx, 1);
        this.team.Members.splice(idx, 1);
    }

    onDeleteManagerClicked()
    {
        this.team.Manager = null;
        this.team.manager = "";
    }

    onCancelClicked()
    {
        this.router.navigate(["teams-admin"]);
    }

    selectedManager(event, inputManager) {
        event.preventDefault();
        if (event.item.login !== this.team.manager) {
            this.team.Manager = event.item;
            this.team.manager = event.item.login;
            this.chosenManager = null;
            inputManager.value = '';
        } else {
            this.alertService.info("Can not add the same manager to the team!");
        }
    }

    selectedWorker(event, inputWorker) {
        event.preventDefault();
        if (!this.team.members.includes(event.item.login)) {
            this.team.Members.push(event.item);
            this.team.members.push(event.item.login);
            this.chosenWorker = null;
            inputWorker.value = '';
        } else {
            this.alertService.info("Can not add the same member to the team!");
        }
    }

    onSaveClicked()
    {
        this.submitted = true;

        if (this.isNewTeam && this.teamForm.valid)
        {
            this.isUpdating = true;
            this.team.teamName = this.teamForm.get("teamName").value;
            this.team.department = this.teamForm.get("department").value;

            this.teamsService.teams.subscribe(teams => {
                let team = teams.find(t => t.teamName === this.team.teamName);

                if (team)
                {
                    this.isUpdating = false;
                    this.alertService.success("Team successfully created.");
                    this.isPosted = true;
                }
            });

            this.teamsService.create(this.team);
        } else if (!this.isNewTeam && this.teamForm.valid){
            this.isUpdating = true;
            this.team.department = this.teamForm.get("department").value;
            this.teamsService.update(this.team);
        } else {
            this.isUpdating = false;
        }
    }

    onDeleteClicked()
    {
        this.isDeleting = true;
        this.teamsService.teams.subscribe(teams => {
            let team = teams.find(t => t.teamName === this.team.teamName);

            if (!team)
            {
                this.isDeleting = false;
                this.alertService.success("Team successfully deleted.");
                this.isPosted = true;
            }
        });
        this.teamsService.remove(this.team.teamName);
    }
}
