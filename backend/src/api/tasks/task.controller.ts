// import * as express from 'express';
import { JsonController, Body, Get, Post, HttpError, Param, Controller, HttpCode, BodyParam, UseBefore, HeaderParam, BadRequestError, UnauthorizedError, Res, Delete, NotFoundError } from "routing-controllers";
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
import { Language } from "../../enums/languages.enum";
import SnsService from "../../services/sns.service";
import { ok } from "assert";
@JsonController("/tasks")
export default class TasksController {

    constructor(private taskService: TaskService,
        private authService: AuthService,
        private snsService: SnsService,
        private translationService: TranslationService) {

    }


    @UseBefore(AuthMiddleware)
    @Post()
    public async AddTask(@Res() res: Response, @Body({ required: true }) task: Task, @HeaderParam("Authorization") token: string) {
        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.taskService.Put(task);

            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'TaskController',
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
                            class: 'TaskController',
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
    @Post('/remind')
    public async Remind(@Res() res: Response, @Body({ required: false }) message: {message:string}, @HeaderParam("Authorization") token: string) {
        this.snsService.Send(message.message);
        return res.status(StatusCodes.OK);
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
            for (let index = 0; index < response.body.Items.length; index++) {
                let desc = response.body.Items[index].description;
                desc = await this.taskService.Translate(desc, 'en', this.translationService.EnumToCode(filter.language));
                if (desc.successful)
                {
                    response.body.Items[index].description = desc.translation.TranslatedText;
                    response.body.Items[index].taskLanguage = filter.language;
                }

                if (response.body.Items[index].userLogin) {
                    response.body.Items[index]['User'] = await this.taskService.GetUser(response.body.Items[index].userLogin);
                    response.body.Items[index]['User'].password = '';
                }
            }


            return res.status(StatusCodes.OK).send(response);
        }

        throw new BadRequestError(response.body);
    }



    @UseBefore(AuthMiddleware)
    @Get('/:taskId')
    public async GetById(@Res() res: Response, @Param('taskId') taskId: string, @Param('taskId') lang: Language, @HeaderParam("Authorization") token: string) {
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
            let desc = response.body.Item.description;
            desc = await this.taskService.Translate(desc, 'en', this.translationService.EnumToCode(lang));
            response.body.Item.description = desc.translation.TranslatedText;
            return res.status(StatusCodes.OK).send(response);
        }

        throw new BadRequestError(response.body);

    }


    @UseBefore(AuthMiddleware)
    @Delete('/:id')
    public async DeleteTask(@Param('id') id: string, @Res() res: Response, @HeaderParam("Authorization") token: string) {

        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.taskService.Delete('id', id);

            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'TaskController',
                            method: 'DeleteTask'
                        },
                        body: res.message
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        successful: true,
                        caller: {
                            class: 'TaskController',
                            method: 'DeleteTask'
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
    @Post('/updatepriority')
    public async UpdatePriority(@Res() res: Response, @Body({ required: true }) tasks: Task[], @HeaderParam("Authorization") token: string) {
        if (this.authService.NotAdmin(token) && this.authService.NotManager(token)) {

            throw new UnauthorizedError();
        }
        let response: any;

        for (let index = 0; index < tasks.length; index++) {
            response = await this.updateTask(tasks[index])
            if (response.successful) {
                continue;
            }
            else {
                throw new BadRequestError(response.body);
            }
        }

        if ((response as ApiResponse)?.successful) {
            return res.status(StatusCodes.OK).send(response);
        }
        throw new BadRequestError(response.body);

    }

    private async updateTask(task: Task) {

        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.taskService.Put(task);

            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'TaskController',
                            method: 'updateTask'
                        },
                        body: res.message
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        successful: true,
                        caller: {
                            class: 'TaskController',
                            method: 'updateTask'
                        },
                        body: res.data
                    }
                    result(response)
                });
        });
        return response
    }

    

}
