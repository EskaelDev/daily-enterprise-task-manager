// import * as express from 'express';
import { JsonController, Body, Get, Post, HttpError, Param, Controller, HttpCode, BodyParam, UseBefore, HeaderParam, BadRequestError, UnauthorizedError, Res } from "routing-controllers";
import { Response } from 'express'
import ApiResponse from "../../utils/api-response";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import AuthService from "../../services/auth.service";
import TaskService from "./task.service";
import Filter from '../models/filter.model'
import Task from "./task.interface";
import jwt_decode from "jwt-decode";
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode, } from 'http-status-codes';
import User from "../users/user.interface";
import TranslationService from "./translation.service";
@JsonController("/tasks")
export default class TasksController {

    constructor(private taskService: TaskService, private authService: AuthService, private translationService: TranslationService) {

    }


    @UseBefore(AuthMiddleware)
    @Post()
    public async AddTask(@Res() res: Response, @Body({ required: true }) task: Task, @HeaderParam("Authorization") token: string) {
        if (this.authService.NotAdmin(token) && this.authService.NotManager(token)) {

            throw new UnauthorizedError();
        }

        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.taskService.Put(task);

            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'TablesController',
                            method: 'AddTask'
                        },
                        body: res.message
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        successful: true,
                        caller: {
                            class: 'TablesController',
                            method: 'AddTask'
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
    @Get('/:taskId')
    public async GetById(@Res() res: Response, @Param('taskId') taskId: string, @HeaderParam("Authorization") token: string) {
        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.taskService.GetByKey(taskId);
            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'TasksController',
                            method: 'GetById'
                        },
                        body: res.message
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        successful: true,
                        caller: {
                            class: 'TasksController',
                            method: 'GetById'
                        },
                        body: res.data
                    }
                    result(response)
                });
        });

        if (response.successful) {
            let user: User = this.authService.ExtractUserFromToken(jwt_decode(token));
            response.body.Item.description = await this.taskService.Translate(response.body.Item.description, 'en', this.translationService.EnumToCode(user.language));
            return res.status(StatusCodes.OK).send(response);
        }

        throw new BadRequestError(response.body);

    }

    @UseBefore(AuthMiddleware)
    @Post('/filter')
    public async Filter(@Res() res: Response, @Body({ required: true }) filter: Filter, @HeaderParam("Authorization") token: string) {
        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.taskService.Filter(filter);
            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'TasksController',
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
                            class: 'TasksController',
                            method: 'Filter'
                        },
                        body: res.data
                    }
                    result(response)
                });
        });

        if (response.successful) {
            let user: User = this.authService.ExtractUserFromToken(jwt_decode(token));
            response.body.Item.description = await this.taskService.Translate(response.body.Item.description, 'en', this.translationService.EnumToCode(user.language));
            return res.status(StatusCodes.OK).send(response);
        }

        throw new BadRequestError(response.body);
    }
}
