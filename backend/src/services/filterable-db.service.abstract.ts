import AWS, { AWSError, ConfigurationOptions, DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import Filter from '../api/models/filter.model';
import DbService from './db.service.abstract';

export default abstract class FilterableDbService<T> extends DbService<T>{

    constructor(tableName: string) {
        super(tableName);
    }
    public Filter(filter: Filter): AWS.Request<DynamoDB.DocumentClient.QueryOutput, AWS.AWSError> {


        var params: DocumentClient.ScanInput = {
            TableName: this.TABLE_NAME,
            ProjectionExpression: "#fl, id, title, description, tags, userLogin, taskLanguage, taskStatus, taskDuration",
            FilterExpression: "#fl = :val",
            ExpressionAttributeNames: {
                "#fl": filter.field,
            },
            ExpressionAttributeValues: {
                ":val": filter.value
            }
        };

        return this.docClient.scan(params, (err: AWSError, data: DocumentClient.ScanOutput) => {
            if (err) {
                return err;
            } else {
                return data;
            }
        });
    }


}