import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './services/auth-guard.service';
import { TeamComponent } from './teams/team/team.component';
import { TeamsComponent } from './teams/teams.component';

const routes: Routes = [
{
    // path: '',
    // data: {
    //     breadcrumb: 'Home'
    // },
    // children: [
    //     {
    //         path: 'team',
    //         data: {
    //             breadcrumb: 'Team'
    //         },
    //         children: [
    //             {
    //                 path: '',
    //                 data: {
    //                     breadcrumb: null
    //                 },
    //                 component: TeamComponent
    //             }
    //         ]
    //     }
    // ],
    // component: HomeComponent,
    // canActivate: [ AuthGuardService ]
    path: '',
    component: HomeComponent,
    data: {
        breadcrumb: "Home"
    },
    canActivate: [ AuthGuardService ]
},
{
    path: 'teams',
    component: TeamsComponent,
    data: {
        breadcrumb: "Teams"
    },
    canActivate: [ AuthGuardService ]
},
{
    path: 'teams/team_tasks/:teamId',
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
