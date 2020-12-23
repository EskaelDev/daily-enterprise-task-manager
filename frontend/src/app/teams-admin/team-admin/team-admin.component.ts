import { Component, OnInit } from '@angular/core';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-team-admin',
  templateUrl: './team-admin.component.html',
  styleUrls: ['./team-admin.component.scss']
})
export class TeamAdminComponent implements OnInit {

    team: Team = new Team({members: [
        new User({surname: "Druciak", name: "Aleksandra", login: "sialalla"}),
        new User({surname: "Druciak", name: "Aleksandra", login: "sialalla1"}),
        new User({surname: "Druciak", name: "Aleksandra", login: "sialalla2"}),
        new User({surname: "Druciak", name: "Aleksandra", login: "sialalla3"}),
        new User({surname: "Druciak", name: "Aleksandra", login: "sialalla4"}),
        new User({surname: "Druciak", name: "Aleksandra", login: "sialalla5"}),
    ]});;

    // icons
    faTimes = faTimes;
    
    constructor() { }

    ngOnInit(): void {
    }

    onDeleteMemberClicked(idx: number)
    {
        this.team.members.splice(idx, 1);
    }
}
