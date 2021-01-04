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
import Task from './task.interface';
import { v4 as uuidv4 } from 'uuid';
import FilterableDbService from '../../services/filterable-db.service.abstract';
import TranslationService from './translation.service';
import { Language } from '../../enums/languages.enum';
import User from '../users/user.interface';
import UserService from '../users/user.service';

@Service()
export default class TaskService extends FilterableDbService<Task> {


    constructor(private translateService: TranslationService, private userService: UserService) {
        super('Tasks', ["id", "title", "description", "tags", "userLogin", "teamName", "taskLanguage", "taskStatus", "taskDuration", "priority"]);
    }

    public async Put(task: Task): Promise<AWS.Request<DynamoDB.DocumentClient.PutItemOutput, AWS.AWSError>> {

        if (task.taskLanguage != Language.ENG) {
            let result = await this.Translate(task.description, this.translateService.EnumToCode(task.taskLanguage), "en");
            if (result.successful) {
                task.taskLanguage = Language.ENG;
                task.description = result.translation.TranslatedText;
            }
            else throw new Error ("Translation error");
        }

        if (task.id == null) {
            task.id = uuidv4();
        }
        const params: DynamoCreateModel = {
            TableName: this.TABLE_NAME,
            Item: task
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
            Key: { 'id': key }
        };

        return this.docClient.get(params, function (err, data) {
            if (err) {
                return err;
            }
            return data;
        });
    }

    public async Translate(text: string, from: string, to: string): Promise<{ successful: boolean; translation: any; }> {

        let translation: { successful: boolean, translation: any } = await new Promise(async (result) => {
            let request = await this.translateService.Translate(text, from, to);

            request
                .on('error', res => {
                    result({ successful: false, translation: res.message })
                })
                .on('success', res => {
                    result({ successful: true, translation: res.data })
                });
        });

        return translation;
    }

    public async GetUser(login: string): Promise<User> {
        return this.userService.GetUser(login)
    }
}