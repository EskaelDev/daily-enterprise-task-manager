// import * as express from 'express';
import { JsonController, Body, Get, Post, HttpError, Param, Controller, HttpCode } from "routing-controllers";
import User from './user.interface'

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

    @Get()
    public async getAll() {
        return this.users;
    }

    @Get('/:userLogin')
    public async getById(@Param('userLogin') userLogin: string) {
        return this.users.find(u => u.login == userLogin);
    }

    @Post()
    public async AddUser(@Body({ required: true }) user: User) {
        this.users.push(user)
        return this.users;
    }
}
