import { Service } from "typedi";
import crypto from 'crypto'
import User from '../api/users/user.service'
import UserService from "../api/users/user.service";
import jwt from 'jsonwebtoken'
@Service()
export default class AuthorizationService {

    /**
     *
     */
    constructor(private userService: UserService) {

    }
    public GenerateToken() {
        crypto.randomBytes(64).toString('hex')
    }


    public async Login(login: string, password: string) {

        let valid = await this.userService.IsPasswordValid(login, password)
        if (!valid)
            return Error('Wrong password');

        let user = await this.userService.GetUser(login);
        user.password = '';

        let token = jwt.sign(user, process.env.TOKEN_SECRET as string, { expiresIn: '2h' })
        return token;
    }
}
