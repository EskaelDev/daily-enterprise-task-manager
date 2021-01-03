import bcrypt from 'bcrypt'
import DbService from '../../services/db.service.abstract'
import AWS, { ConfigurationOptions, DynamoDB } from 'aws-sdk';
import { ServiceConfigurationOptions } from 'aws-sdk/lib/service';
import DynamoUpdateModel from '../../aws/models/update.model'
import DynamoCreateModel from '../../aws/models/create.model'
import passport from 'passport';
import { Strategy } from 'passport-local'
import { Service } from 'typedi';
import jwt from 'jsonwebtoken'
import { ErrorCause } from 'aws-sdk/clients/qldb';
import crypto from 'crypto'
import { bool } from 'aws-sdk/clients/signer';
import { v4 as uuidv4 } from 'uuid';
import FilterableDbService from '../../services/filterable-db.service.abstract';
import Team from './team.interface';
import User from '../users/user.interface';
import UserService from '../users/user.service';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';

@Service()
export default class TeamService extends FilterableDbService<Team> {


    constructor(private userService:UserService) {
        super('Teams', ["teamName", "manager", "department", "members"]);
    }

    public async Put(team: Team): Promise<AWS.Request<DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>> {

        const params: DynamoCreateModel = {
            TableName: this.TABLE_NAME,
            Item: team
        }

        return this.docClient.put(params, function (err, data) {
            if (err) {
                return err;
            }
            return data;
        });
    }

    public GetByKey(key: string): AWS.Request<DynamoDB.DocumentClient.GetItemOutput, AWS.AWSError> {

        const params = {
            TableName: this.TABLE_NAME,
            Key: { 'teamName': key }
        };

        return this.docClient.get(params, function (err, data) {
            if (err) {
                return err;
            }
            return data;
        });
    }

    public async GetMember(userName:string):Promise<User>{
        return this.userService.GetUser(userName);
    }
    public async Delete(key: string, value: string): Promise<AWS.Request<DynamoDB.DocumentClient.DeleteItemOutput, AWS.AWSError>> {
        var params: DocumentClient.DeleteItemInput = {
            TableName: this.TABLE_NAME,
            Key: {
                teamName: value
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