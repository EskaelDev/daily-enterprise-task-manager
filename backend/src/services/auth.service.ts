import { Service } from "typedi";
import crypto from 'crypto'
import User, { Role } from '../api/users/user.interface'
import UserService from "../api/users/user.service";
import jwt from 'jsonwebtoken'
import jwt_decode from "jwt-decode";
@Service()
export default class AuthService {

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

    public ExtractUserFromToken(decodedToken: any): User {
        return {
            login: decodedToken.login,
            password: decodedToken.password,
            userRole: decodedToken.userRole,
            userLanguage: decodedToken.userLanguage,
            userName: decodedToken.userName,
            surname: decodedToken.surname
        }
    }

    public IsAdmin(token: string) {
        let user: User = this.ExtractUserFromToken(jwt_decode(token));
        return user.userRole == Role.Admin
    }
    public NotAdmin(token: string) {
        let user: User = this.ExtractUserFromToken(jwt_decode(token));
        return user.userRole != Role.Admin
    }


    public IsManager(token: string) {
        let user: User = this.ExtractUserFromToken(jwt_decode(token));
        return user.userRole == Role.Manager
    }

    public NotManager(token: string) {
        let user: User = this.ExtractUserFromToken(jwt_decode(token));
        return user.userRole != Role.Manager
    }

    public IsWorker(token: string) {
        let user: User = this.ExtractUserFromToken(jwt_decode(token));
        return user.userRole == Role.Worker
    }
    public NotWorker(token: string) {
        let user: User = this.ExtractUserFromToken(jwt_decode(token));
        return user.userRole != Role.Worker
    }
}
