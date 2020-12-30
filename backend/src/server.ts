import 'reflect-metadata';
import App from './app';
import UsersController from './api/users/users.controller'
import dotenv from 'dotenv'
import Container from 'typedi';
import { getMetadataArgsStorage, useContainer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';

dotenv.config();
const port = process.env.PORT || 5000;

useContainer(Container);

const app = new App(+port);

app.listen();
