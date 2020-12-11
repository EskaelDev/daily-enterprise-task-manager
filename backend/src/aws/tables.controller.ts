import AWS, { DynamoDB } from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import { Delete, Get, JsonController } from 'routing-controllers';
import ApiResponse from '../utils/api-response';
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

    @Get('/users')
    public async createUsers(): Promise<ApiResponse> {

        return await new Promise((result: any) => {
            let request = this.dynamodb.createTable(UserSchema, function (err, data) {
                if (err) {
                    return err
                } else {
                    return data;
                }
            });

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

        });
    }
    @Delete('/users')
    public async deleteUsers(): Promise<ApiResponse> {

        return await new Promise((result: any) => {
            let request = this.dynamodb.deleteTable({ TableName: "Users" }, function (err, data) {
                if (err) {
                    return err
                } else {
                    return data
                }
            });

            request
                .on('error', res => {
                    let response: ApiResponse = {
                        statusCode: 400,
                        caller: {
                            class: 'TablesController',
                            method: 'deleteUsers'
                        },
                        body: res.message
                    }
                    result(response)
                })
                .on('success', res => {
                    let response: ApiResponse = {
                        statusCode: 200,
                        caller: {
                            class: 'TablesController',
                            method: 'deleteUsers'
                        },
                        body: res.data
                    }
                    result(response)
                });

        });
    }

}