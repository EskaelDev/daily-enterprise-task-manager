import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { TeamsService } from 'src/app/services/teams.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { AlertService } from 'src/app/services/alert.service';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { Role } from 'src/app/models/role.enum';

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

    // icons
    faTimes = faTimes;
    
    constructor(private teamsService: TeamsService, private fb: FormBuilder, private route: ActivatedRoute,
        private alertService: AlertService, private router: Router,
        private usersService: UserService, private authService: AuthService) { }

    ngOnInit(): void {
        this.teamForm = this.fb.group({
            teamName: [''],
            department: ['']
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
                });

                this.teamsService.error.subscribe(error => {
                    if (error !== "") {
                    this.alertService.error(error);
                    }
                });
            }
        });

        this.usersService.getAllWithRole(this.authService.currentUserValue.token, Role.Manager).subscribe(
            data => { this.managers = data.body.Items},
            error => { //TODO
            }
          );

        this.usersService.getAllWithRole(this.authService.currentUserValue.token, Role.Worker).subscribe(
            data => { this.workers = data.body.Items},
            error => { //TODO
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
}
