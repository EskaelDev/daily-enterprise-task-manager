// import * as express from 'express';
import { response } from "express";
import { JsonController, Body, Get, Post, HttpError, Param, Controller, HttpCode } from "routing-controllers";
import DynamoTest from "../aws/dynamo-test";


@JsonController("/test")
export default class TestController {

    dynamoTest: DynamoTest;
    constructor() {
        this.dynamoTest = new DynamoTest();
    }





@Get('/put')
public async put(){
    return await new Promise((result) => {
        let request = this.dynamoTest.upload();
        request
            .on('complete', res => {
                result(res.httpResponse)
                // result('ok')
                console.log('_________complete');
            })
            .on('error', res => {
                // result('ok')
                result(res.message);
                console.log('__________error');
            })
            .on('success', res => {
                // result('ok')
                result(res.httpResponse);
                console.log('__________success');
            });

    });
}



    @Get()
    public async getAll() {

        return await new Promise((result) => {
            let request = this.dynamoTest.createTable();

            request
                .on('complete', res => {
                    result(res)
                    console.log('_________complete');
                })
                .on('error', res => {
                    result(res);
                    console.log('__________error');
                })
                .on('success', res => {
                    result(res);
                    console.log('__________success');
                });

        });
        /*
        let request = this.dynamoTest.createTable();

        request.on('success', response => {
            console.log('Success:________\n' + response.data);
            return response.data;

        }).on('error', response => {
            console.log('Error:________\n' + response.message);
            return response.message;
        });


        // console.log('___________________X:\n'+x+'\n_______');

        return '';
        // return request.;
        // request.
        // return res;
        */
    }
}
