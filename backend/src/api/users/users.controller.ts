// import * as express from 'express';
import { JsonController, Body, Get, Post, HttpError, Param, Controller, HttpCode, BodyParam, UseBefore, HeaderParam, UnauthorizedError, Res, BadRequestError, Delete, NotFoundError, Put } from "routing-controllers";
import User, { Role } from './user.interface'
import UserService from "./user.service";
import { Response } from 'express'
import ApiResponse from "../../utils/api-response";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import AuthService from "../../services/auth.service";
import jwt_decode from "jwt-decode";
import { HttpResponse } from "aws-sdk";
import { StatusCodes } from "http-status-codes";
import { STATUS_CODES } from "http";
import Filter from '../models/filter.model'

@JsonController("/users")
export default class UsersController {

    constructor(private userService: UserService, private authService: AuthService) {

    }

    // @Get()
    // public async getAll() {
    //     return this.users;
    // }



    @UseBefore(AuthMiddleware)
    @Get('/all')
    public async GetAll(@Res() res: Response,  @HeaderParam("Authorization") token: string) {

        if (this.authService.NotAdmin(token)) {

            throw new UnauthorizedError();
        }
        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.userService.GetAll();
            if (request) {
                let response: ApiResponse = {
                    successful: true,
                    caller: {
                        class: 'UserController',
                        method: 'GetAll'
                    },
                    body: request
                }
                result(response)
            }
            else {
                let response: ApiResponse = {
                    successful: false,
                    caller: {
                        class: 'UserController',
                        method: 'GetAll'
                    },
                    body: "Empty"
                }
                result(response)
            }
        });

        if (response.successful) {
            for (let index = 0; index < response.body.length; index++) {
                response.body[index].password = '';
            }
            return res.status(StatusCodes.OK).send(response);
        }

        throw new BadRequestError(response.body);

    }


    @UseBefore(AuthMiddleware)
    @Get('/:userLogin')
    public async GetById(@Res() res: Response, @Param('userLogin') userLogin: string, @HeaderParam("Authorization") token: string) {

        if (this.authService.NotAdmin(token)) {

            throw new UnauthorizedError();
        }

        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.userService.GetUser(userLogin);
            request.password = "";

            let response: ApiResponse = {
                successful: true,
                caller: {
                    class: 'UsersController',
                    method: 'GetById'
                },
                body: request,
            }
            result(response)
        });

        if (response.successful) {
            return res.status(StatusCodes.OK).send(response);
        }

        throw new BadRequestError(response.body);

    }

    @UseBefore(AuthMiddleware)
    @Post()
    public async AddUser(@Res() res: Response, @Body({ required: true }) user: User, @BodyParam('password', { required: true }) password: string, @HeaderParam("Authorization") token: string) {
        if (this.authService.NotAdmin(token)) {

            throw new UnauthorizedError();
        }

        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.userService.Put(user);

            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'UsersController',
                            method: 'AddUser'
                        },
                        body: res.message,
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        successful: true,
                        caller: {
                            class: 'UsersController',
                            method: 'AddUser'
                        },
                        body: res.data
                    }
                    result(response)
                });
        });

        if (response.successful) {

            return res.status(StatusCodes.CREATED).send(response);
        }

        throw new BadRequestError(response.body);

    }

    @Post('/login')
    public async Login(@Body({ required: true }) body: { login: string, password: string }) {
        return this.authService.Login(body.login, body.password)
    }




    @Post('/admin')
    public async AddAdmin(@Res() res: Response, @Body({ required: true }) user: User, @BodyParam('password', { required: true }) password: string, @HeaderParam("Authorization") token: string) {
        if (this.authService.NotAdmin(token)) {

            throw new UnauthorizedError();
        }

        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.userService.Put(user);

            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'UsersController',
                            method: 'AddAdmin'
                        },
                        body: res.message,
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        successful: true,
                        caller: {
                            class: 'UsersController',
                            method: 'AddAdmin'
                        },
                        body: res.data
                    }
                    result(response)
                });
        });

        if (response.successful) {

            return res.status(StatusCodes.CREATED).send(response);
        }

        throw new BadRequestError(response.body);

    }


    @UseBefore(AuthMiddleware)
    @Delete('/:login')
    public async Delete(@Param('login') login: string, @Res() res: Response, @HeaderParam("Authorization") token: string) {
        if (this.authService.NotAdmin(token)) {

            throw new UnauthorizedError();
        }

        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.userService.Delete('login', login);

            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'UserController',
                            method: 'DeleteUser'
                        },
                        body: res.message
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        successful: true,
                        caller: {
                            class: 'UserController',
                            method: 'DeleteUser'
                        },
                        body: res.data
                    }
                    result(response)
                });
        });

        if (response.successful) {
            return res.status(StatusCodes.OK).send(response);
        }
        throw new NotFoundError(response.body);

    }


    @UseBefore(AuthMiddleware)
    @Post('/filter')
    public async Filter(@Res() res: Response, @Body({ required: true }) filter: Filter, @HeaderParam("Authorization") token: string) {
        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.userService.Filter(filter);
            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'UsersController',
                            method: 'Filter'
                        },
                        body: res.message
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        successful: true,
                        caller: {
                            class: 'UsersController',
                            method: 'Filter'
                        },
                        body: res.data
                    }
                    result(response)
                });
        });

        if (response.successful) {
            return res.status(StatusCodes.OK).send(response);
        }

        throw new NotFoundError(response.body);
    }


    
    @UseBefore(AuthMiddleware)
    @Put()
    public async UpdateUser(@Res() res: Response, @Body({ required: true }) user: User, @HeaderParam("Authorization") token: string) {

        let userDb: User = await new Promise(async (result) => {
            let request = await this.userService.GetUser(user.login);
            result(request)
        });

        if(user==null)
            throw new NotFoundError();
            
        user.password = userDb.password;

        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.userService.Put(user);

            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'UsersController',
                            method: 'UpdateUser'
                        },
                        body: res.message,
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        successful: true,
                        caller: {
                            class: 'UsersController',
                            method: 'UpdateUser'
                        },
                        body: res.data
                    }
                    result(response)
                });
        });

        if (response.successful) {

            return res.status(StatusCodes.CREATED).send(response);
        }

        throw new BadRequestError(response.body);

    }
}
