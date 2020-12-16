// import * as express from 'express';
import { JsonController, Body, Get, Post, HttpError, Param, Controller, HttpCode, BodyParam, UseBefore, HeaderParam, UnauthorizedError } from "routing-controllers";
import User, { Role } from './user.interface'
import UserService from "./user.service";
import { Response } from 'express'
import ApiResponse from "../../utils/api-response";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import AuthorizationService from "../../services/auth.service";
import jwt_decode from "jwt-decode";
import { HttpResponse } from "aws-sdk";

@JsonController("/users")
export default class UsersController {

    constructor(private userService: UserService, private authService: AuthorizationService) {

    }

    // @Get()
    // public async getAll() {
    //     return this.users;
    // }

    @UseBefore(AuthMiddleware)
    @Get('/:userLogin')
    public async GetById(@Param('userLogin') userLogin: string, @HeaderParam("Authorization") token: string) {

        if (this.authService.NotAdmin(token)) {

            throw new UnauthorizedError();
        }

        return await new Promise(async (result) => {
            let request = await this.userService.GetUser(userLogin);
            request.password = "";

            let response: ApiResponse = {
                statusCode: 200,
                caller: {
                    class: 'TablesController',
                    method: 'createUsers'
                },
                body: request,
            }
            result(response)


        }).catch(error => console.log(error));
    }


    @UseBefore(AuthMiddleware)
    @Post()
    public async AddUser(@Body({ required: true }) user: User, @BodyParam('password', { required: true }) password: string, @HeaderParam("Authorization") token: string) {
        if (this.authService.NotAdmin(token)) {

            throw new UnauthorizedError();
        }

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
