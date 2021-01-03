import AWS, { ConfigurationOptions, DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';

export default abstract class DbService<T> {
    readonly TABLE_NAME: string;

    serviceConfigOptions: ServiceConfigurationOptions;
    dynamodb: DynamoDB;
    docClient: AWS.DynamoDB.DocumentClient;

    /**
     * Sets tablename and dynamo client
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

    Put(enity: T): any { };
    // Update(enity: T): any { };
    GetByKey(key: any): any { };
    async GetAll(): Promise<T[]> {
        const params: DocumentClient.ScanInput = {
            TableName: this.TABLE_NAME,
        };

        let scanResults: T[] = [];
        let items: any;
        do {
            items = await this.docClient.scan(params).promise();
            items.Items.forEach((item: any) => scanResults.push(item));
            params.ExclusiveStartKey = items.LastEvaluatedKey;
        } while (typeof items.LastEvaluatedKey != "undefined");

        return scanResults;
    };

    public async Delete(key: string, value: string): Promise<AWS.Request<DynamoDB.DocumentClient.DeleteItemOutput, AWS.AWSError>> {
        var params: DocumentClient.DeleteItemInput = {
            TableName: this.TABLE_NAME,
            Key: {
                id: value
            }
        };

        return this.docClient.delete(params, function (err, data) {
            if (err) {
                return err;
            } else {
                return data;
            }
        });
    }
}