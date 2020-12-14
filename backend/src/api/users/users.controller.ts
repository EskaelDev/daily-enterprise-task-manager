// import * as express from 'express';
import { JsonController, Body, Get, Post, HttpError, Param, Controller, HttpCode, BodyParam, UseBefore } from "routing-controllers";
import User from './user.interface'
import UserService from "./user.service";
import { Response } from 'express'
import ApiResponse from "../../utils/api-response";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import AuthorizationService from "../../services/auth.service";

@JsonController("/users")
export default class UsersController {
    private users: User[] = [
        {
            login: 'usr01',
            password: 'halko'
        },
        {
            login: 'usr02',
            password: 'halko2'
        }
    ];

    constructor(private userService: UserService, private authService:AuthorizationService) {

    }

    @Get()
    public async getAll() {
        return this.users;
    }

    @Get('/:userLogin')
    public async getById(@Param('userLogin') userLogin: string) {
        return this.users.find(u => u.login == userLogin);
    }


    @UseBefore(AuthMiddleware)
    @Post()
    public async AddUser(@Body({ required: true }) user: User, @BodyParam('password',{required:true}) password:string) {

        return await new Promise(async (result) => {
            let request = await this.userService.Create(user);

            request
                .on('error', res => {
                    let response: ApiResponse = {
                        statusCode: 400,
                        caller: {
                            class: 'TablesController',
                            method: 'createUsers'
                        },
                        body: res.message,
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        statusCode: 200,
                        caller: {
                            class: 'TablesController',
                            method: 'createUsers'
                        },
                        body: res.data
                    }
                    result(response)
                });
        }).catch(error => console.log(error));

    }

    @Post('/login')
    public async Login(@Body({ required: true }) body: { login: string, password: string }) {
        return this.authService.Login(body.login, body.password)
    }


}
