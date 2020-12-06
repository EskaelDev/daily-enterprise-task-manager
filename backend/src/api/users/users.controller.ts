import * as express from 'express';
import User from './users.interface'

export default class UsersController {
    public path = '/users';
    public router = express.Router();

    private users: User[] = [
        {
            login: 'usr01',
            password: 'halko'
        }
    ];

    constructor() {
        this.intializeRoutes();
    }

    public intializeRoutes() {
        this.router.get(this.path, this.getAllUsers);
        this.router.post(this.path, this.createUser);
    }

    getAllUsers = (request: express.Request, response: express.Response) => {
        response.send(this.users);
    }

    createUser = (request: express.Request, response: express.Response) => {
        const user: User = request.body;
        this.users.push(user);
        response.send(user);
    }
}
