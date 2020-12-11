import App from './app';
import UsersController from './api/users/users.controller'
import dotenv from 'dotenv'

dotenv.config();
const port = process.env.PORT || 5000;

const app = new App(+port);

app.listen();