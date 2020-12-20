import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { TeamComponent } from './teams/team/team.component';
import { TeamsComponent } from './teams/teams.component';

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
        }
    ],
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
