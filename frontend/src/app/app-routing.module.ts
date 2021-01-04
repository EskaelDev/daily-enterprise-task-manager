import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { TeamsAdminComponent } from './teams-admin/teams-admin.component';
import { TeamComponent } from './teams/team/team.component';
import { TeamsComponent } from './teams/teams.component';
import { UsersComponent } from './users/users.component';
import {TeamAdminComponent} from './teams-admin/team-admin/team-admin.component';
import { WorkerTasksComponent } from './worker-tasks/worker-tasks.component';

const routes: Routes = [
{
    path: '',
    data: {
        breadcrumb: 'Home'
    },
    children: [
        {
            path: '',
            component: HomeComponent
        },
        {
            path: 'teams',
            data: {
                breadcrumb: 'Teams'
            },
            children: [
                {
                    path: '',
                    component: TeamsComponent
                },
                {
                    path: ':teamName',
                    data: {
                        breadcrumb: null
                    },
                    component: TeamComponent
                }
            ]
        },
        {
            path: 'teams-admin',
            data: {
                breadcrumb: 'Teams'
            },
            children: [
                {
                    path: '',
                    component: TeamsAdminComponent
                },
                {
                    path: 'new',
                    data: {
                        breadcrumb: 'New team'
                    },
                    component: TeamAdminComponent
                },
                {
                    path: ':teamName',
                    data: {
                        breadcrumb: null
                    },
                    component: TeamAdminComponent
                }
            ]
        },
      {
        path: 'tasks',
        data: {
          breadcrumb: 'My tasks'
        },
        component: WorkerTasksComponent,
        // canActivate: [ AuthGuardService ]
      },
      {
        path: 'users',
        data: {
          breadcrumb: 'Users'
        },
        component: UsersComponent,
        canActivate: [ AuthGuardService ]
      }
    ],
    canActivate: [ AuthGuardService ]
},
{
    path: 'teams',
    component: TeamsComponent,
    data: {
        breadcrumb: 'Teams'
    },
    canActivate: [ AuthGuardService ]
},
{
    path: 'teams/team/:teamId',
    component: TeamComponent,
    data: {
        breadcrumb: null
    },
    canActivate: [ AuthGuardService ]
},
{
    path: 'login',
    data: {
        breadcrumb: null
    },
    component: LoginComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
