import AWS, { DynamoDB } from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { BadRequestError, Delete, Get, JsonController } from 'routing-controllers';
import ApiResponse from '../utils/api-response';
import TaskSchema from './schemas/task.schema';
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
    public async createTables(): Promise<string> {

        let userSchema: boolean = await new Promise((result: any) => {
            let request = this.dynamodb.createTable(UserSchema, function (err, data) {
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

        let taskSchema: boolean = await new Promise((result: any) => {
            let request = this.dynamodb.createTable(TaskSchema, function (err, data) {
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

        if (userSchema && taskSchema)
            return "Successful";

        throw new BadRequestError();
    }



    @Delete()
    public async deleteUsers(): Promise<string> {

        let users: boolean = await new Promise((result: any) => {
            let request = this.dynamodb.deleteTable({ TableName: "Users" }, function (err, data) {
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

        let tasks: boolean = await new Promise((result: any) => {
            let request = this.dynamodb.deleteTable({ TableName: "Tasks" }, function (err, data) {
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
        if (users && tasks)
            return "Successful";

        throw new BadRequestError();
    }

}