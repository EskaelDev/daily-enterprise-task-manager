import AWS, { DynamoDB } from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { StatusCodes } from 'http-status-codes';
import { BadRequestError, Delete, Get, JsonController, Res } from 'routing-controllers';
import { Response } from 'express';
import ApiResponse from '../utils/api-response';
import TaskSchema from './schemas/task.schema';
import TeamSchema from './schemas/team.schema';
import UserSchema from './schemas/user.schema'

@JsonController('/aws')
export default class TablesController {

    serviceConfigOptions: ServiceConfigurationOptions;
    dynamodb: DynamoDB;
    docClient: AWS.DynamoDB.DocumentClient;

    constructor() {
        this.serviceConfigOptions = {
            region: process.env.aws_region,
            endpoint: process.env.aws_dynamo_endpoint
        };
        AWS.config.update(this.serviceConfigOptions);
        this.dynamodb = new AWS.DynamoDB();
        this.docClient = new AWS.DynamoDB.DocumentClient();

    }

    @Get('/create')
    public async createTables(@Res() res: Response) {

        let userSchema: boolean = await this.makeTable(UserSchema)
        let taskSchema: boolean = await this.makeTable(TaskSchema)
        let teamSchema: boolean = await this.makeTable(TeamSchema)

        if (userSchema && taskSchema && teamSchema)
            return res.status(StatusCodes.CREATED).send('All tables created');

        throw new BadRequestError();
    }

    private async makeTable(tableSchema: any): Promise<boolean> {
        return new Promise((result: any) => {
            let request = this.dynamodb.createTable(tableSchema, function (err, data) {
                if (err) {
                    return err;
                } else {
                    return data;
                }
            });

            request
                .on('error', res => {
                    result(false);
                })
                .on('success', res => {
                    result(true);
                });

        });
    }


    @Delete()
    public async deleteTables(@Res() response:Response) {

        let users: boolean = await this.DeleteTable('Users');
        let tasks: boolean = await this.DeleteTable('Tasks');
        let teams: boolean = await this.DeleteTable('Teams');

        if (users && tasks && teams)
            return response.status(StatusCodes.OK).send('All tables deleted');

        throw new BadRequestError();
    }


    private async DeleteTable(tableName: string): Promise<boolean> {
        return await new Promise((result: any) => {
            let request = this.dynamodb.deleteTable({ TableName: tableName }, function (err, data) {
                if (err) {
                    return err
                } else {
                    return data
                }
            });

            request
                .on('error', res => {
                    result(false)
                })
                .on('success', res => {
                    result(true)
                });

        });

    }
}