import User from './user.interface'
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
import FilterableDbService from '../../services/filterable-db.service.abstract';

@Service()
export default class UserService extends FilterableDbService<User> {


    constructor() {
        super('Users', ["login", "userRole", "firstName", "surname", "userLanguage"]);

    }
    public async Put(user: User): Promise<AWS.Request<DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>> {
        user.password = await new Promise<string>((result) => {

            crypto.pbkdf2(user.password, process.env.salt || '', 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) throw err;

                result(derivedKey.toString('hex'));
            });
        }).catch(error => { console.log(error.message); return '' });

        const params: DynamoCreateModel = {
            TableName: this.TABLE_NAME,
            Item: user
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
            Key: { 'login': key }
        };

        return this.docClient.get(params, function (err, data) {
            if (err) {
                return err;
            }
            return data;
        });
    }


    public async GetUser(login: string): Promise<User> {
        let user: any = await new Promise((result) => {
            let request = this.GetByKey(login);

            request
                .on('error', res => {
                    result(null)
                })
                .on('success', res => {
                    result(res.data)
                });

        });

        return (user.Item as User);
    }

    public async IsPasswordValid(login: string, password: string): Promise<boolean> {


        let user: User = await this.GetUser(login);
        if (user) {
            let match = await this.PasswordMatch(password, (user as User).password)
            return (match)
        }
        else return false;
    }
    async PasswordMatch(clientPass: string, dbPass: string): Promise<boolean> {

        let result = await new Promise<boolean>((result) => {

            crypto.pbkdf2(clientPass, process.env.salt || '', 100000, 64, 'sha512', (err, derivedKey) => {
                if (err) throw err;

                result(derivedKey.toString('hex') == dbPass);
            });
        });
        return result;

    }


}