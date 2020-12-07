import App from './app';
import UsersController from './api/users/users.controller'

const port = process.env.PORT || 5000;

const app = new App(+port);

app.listen();