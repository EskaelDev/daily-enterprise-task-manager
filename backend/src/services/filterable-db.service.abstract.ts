import AWS, { AWSError, ConfigurationOptions, DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import Filter from '../api/models/filter.model';
import DbService from './db.service.abstract';

export default abstract class FilterableDbService<T> extends DbService<T>{
    protected filterFields: string[];
    constructor(tableName: string, filterFields: string[]) {
        super(tableName);
        this.filterFields = filterFields;
    }
    public Filter(filter: Filter): AWS.Request<DynamoDB.DocumentClient.QueryOutput, AWS.AWSError> {

        let ProjectionExpression = this.filterFields.join(', ');
        var params: DocumentClient.ScanInput = {
            TableName: this.TABLE_NAME,
            ProjectionExpression: ProjectionExpression,
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