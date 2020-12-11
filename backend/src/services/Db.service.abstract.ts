import AWS, { ConfigurationOptions, DynamoDB } from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

export default abstract class DbService<T> {
    readonly TABLE_NAME: string;

    serviceConfigOptions: ServiceConfigurationOptions;
    dynamodb: DynamoDB;
    docClient: AWS.DynamoDB.DocumentClient;

    /**
     *
     */
    constructor(tableName: string) {
        this.serviceConfigOptions = {
            region: process.env.aws_region,
            endpoint: process.env.aws_dynamo_endpoint
        };
        this.TABLE_NAME = tableName;
        AWS.config.update(this.serviceConfigOptions);
        this.dynamodb = new AWS.DynamoDB();
        this.docClient = new AWS.DynamoDB.DocumentClient();
    }

    Create(enity: T): any { };
    Update(enity: T): any { };
    GetByKey(key: any): any { };
}