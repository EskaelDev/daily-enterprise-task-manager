import App from './app';
import UsersController from './api/users/users.controller'

const app = new App(
    [
        new UsersController(),
    ],
    5000,
);

app.listen();