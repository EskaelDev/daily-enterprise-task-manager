import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Task Manager';
  isAuthenticated: boolean = false;

  constructor() {
    // this.authService.isAuthenticated.subscribe(
    //   (isAuthenticated: boolean)  => this.isAuthenticated = isAuthenticated
    // );
  }

  async ngOnInit() {
    // this.isAuthenticated = await this.authService.checkAuthenticated();
  }

  logout() {
    // this.authService.logout('/');
  }
}
