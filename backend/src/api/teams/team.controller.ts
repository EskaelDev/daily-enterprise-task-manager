// import * as express from 'express';
import { JsonController, Body, Get, Post, HttpError, Param, Controller, HttpCode, BodyParam, UseBefore, HeaderParam, BadRequestError, UnauthorizedError, Res, Delete, NotFoundError } from "routing-controllers";
import { Response } from 'express'
import ApiResponse from "../../utils/api-response";
import { AuthMiddleware } from "../../middleware/auth.middleware";
import AuthService from "../../services/auth.service";

import Filter from '../models/filter.model'
import { ReasonPhrases, StatusCodes, getReasonPhrase, getStatusCode, } from 'http-status-codes';
import TeamService from "./team.service";
import Team from "./team.interface";
import User from "../users/user.interface";

@JsonController("/teams")
export default class TeamController {


    constructor(private teamService: TeamService, private authService: AuthService) {

    }


    @UseBefore(AuthMiddleware)
    @Post()
    public async PutTeam(@Res() res: Response, @Body({ required: true }) team: Team, @HeaderParam("Authorization") token: string) {
        if (this.authService.NotAdmin(token) && this.authService.NotManager(token)) {
            throw new UnauthorizedError();
        }

        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.teamService.Put(team);

            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'TeamsController',
                            method: 'PutTeam'
                        },
                        body: res.message
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        successful: true,
                        caller: {
                            class: 'TeamsController',
                            method: 'PutTeam'
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
    @Get('/all')
    public async GetAll(@Res() res: Response, @HeaderParam("Authorization") token: string) {

        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.teamService.GetAll();
            if (request) {
                let response: ApiResponse = {
                    successful: true,
                    caller: {
                        class: 'TeamController',
                        method: 'GetById'
                    },
                    body: request
                }
                result(response)
            }
            else {
                let response: ApiResponse = {
                    successful: false,
                    caller: {
                        class: 'TeamController',
                        method: 'GetById'
                    },
                    body: "Empty"
                }
                result(response)
            }
        });

        if (response.successful) {
            for (let index = 0; index < response.body.length; index++) {

                if (response.body[index].members.length > 0) {
                    response.body[index]['Members'] = [];
                    for (let memeber = 0; memeber < response.body[index].members.length; memeber++) {
                        let user: User = await this.teamService.GetMember(response.body[index].members[memeber]);
                        if (user)
                            user.password = '';
                        response.body[index]['Members'].push(user)
                    }
                }
                if (response.body[index].manager) {
                    response.body[index]['Manager'] = await this.teamService.GetMember(response.body[index].manager);
                    response.body[index]['Manager'].password = '';
                }

            }


            return res.status(StatusCodes.OK).send(response);
        }

        throw new BadRequestError(response.body);

    }

    @UseBefore(AuthMiddleware)
    @Get('/:teamName')
    public async GetById(@Res() res: Response, @Param('teamName') teamName: string, @HeaderParam("Authorization") token: string) {

        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.teamService.GetByKey(teamName);
            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'TeamController',
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
                            class: 'TeamController',
                            method: 'GetById'
                        },
                        body: res.data
                    }
                    result(response)
                });
        });

        if (response.successful) {

            if (response.body.Item.members.length > 0) {
                response.body.Item['Members'] = [];
                for (let memeber = 0; memeber < response.body.Item.members.length; memeber++) {
                    let user: User = await this.teamService.GetMember(response.body.Item.members[memeber]);
                    user.password = '';
                    response.body.Item['Members'].push(user)
                }
            }
            if (response.body.Item.manager) {
                response.body.Item['Manager'] = await this.teamService.GetMember(response.body.Item.manager);
                response.body.Item['Manager'].password = '';
            }


            return res.status(StatusCodes.OK).send(response);
        }

        throw new BadRequestError(response.body);

    }



    @UseBefore(AuthMiddleware)
    @Post('/filter')
    public async Filter(@Res() res: Response, @Body({ required: true }) filter: Filter, @HeaderParam("Authorization") token: string) {
        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.teamService.Filter(filter);
            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'TeamController',
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
                            class: 'TeamController',
                            method: 'Filter'
                        },
                        body: res.data
                    }
                    result(response)
                });
        });

        if (response.successful) {

            for (let index = 0; index < response.body.Items.length; index++) {
                if (response.body.Items[index].members.length > 0) {
                    response.body.Items[index]['Members'] = [];
                    for (let memeber = 0; memeber < response.body.Items[index].members.length; memeber++) {
                        let user: User = await this.teamService.GetMember(response.body.Items[index].members[memeber]);
                        user.password = '';
                        response.body.Items[index]['Members'].push(user)
                    }
                }
                if (response.body.Items[index].manager) {
                    response.body.Items[index]['Manager'] = await this.teamService.GetMember(response.body.Items[index].manager);
                    response.body.Items[index]['Manager'].password = '';
                }
            }

            return res.status(StatusCodes.OK).send(response);
        }

        throw new BadRequestError(response.body);
    }


    @UseBefore(AuthMiddleware)
    @Delete('/:id')
    public async DeleteTeam(@Param('id') id: string, @Res() res: Response, @HeaderParam("Authorization") token: string) {
        if (this.authService.NotAdmin(token)) {

            throw new UnauthorizedError();
        }

        let response: ApiResponse = await new Promise(async (result) => {
            let request = await this.teamService.Delete('teamName', id);

            request
                .on('error', res => {
                    let response: ApiResponse = {
                        successful: false,
                        caller: {
                            class: 'TeamController',
                            method: 'DeleteTeam'
                        },
                        body: res.message
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        successful: true,
                        caller: {
                            class: 'TeamController',
                            method: 'DeleteTeam'
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
}
