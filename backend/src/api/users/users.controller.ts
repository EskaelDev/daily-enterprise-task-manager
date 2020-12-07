// import * as express from 'express';
import { JsonController, Body, Get, Post, HttpError, Param, Controller, HttpCode } from "routing-controllers";
import User from './users.interface'

@JsonController("/users")
export default class UsersController {
    private users: User[] = [
        {
            id: 1,
            login: 'usr01',
            password: 'halko'
        },
        {
            id: 2,
            login: 'usr02',
            password: 'halko2'
        }
    ];

    @HttpCode(200)
    @Get()
    public async getAll() {
        return this.users;
    }

    @Get('/:userId')
    public async getById(@Param('userId') userId: number) {
        return this.users.find(u => u.id == userId);
    }

    @Post()
    public async AddUser(@Body({ required: true }) user: User) {
        this.users.push(user)
        return this.users;
    }
}
