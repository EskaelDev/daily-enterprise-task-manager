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





    @Get('/get')
    public async getItem() {
        return await new Promise((result) => {
            let request = this.dynamoTest.get();

            request
                .on('complete', res => {
                    console.log('_________complete');
                })
                .on('error', res => {
                    result(res.message)
                    console.log('__________error');
                })
                .on('success', res => {
                    result(res.data);
                    console.log( res.data);
                    
                    console.log('__________success');
                });

        });
    }


    @Get('/put')
    public async put() {
        return await new Promise((result) => {
            let request = this.dynamoTest.upload();

            request
                .on('complete', res => {
                    result('status: ' + res.httpResponse.statusCode)
                    console.log('_________complete');
                })
                .on('error', res => {
                    result(res.message)
                    console.log('__________error');
                })
                .on('success', res => {
                    result('status: ' + res.httpResponse.statusCode)
                    console.log('__________success');
                });

        });
    }


    
    @Get('/update')
    public async update() {
        return await new Promise((result) => {
            let request = this.dynamoTest.update();

            request
                .on('complete', res => {
                    console.log('_________complete');
                })
                .on('error', res => {
                    result(res.message)
                    console.log('__________error');
                })
                .on('success', res => {
                    result(res.data);
                    console.log( res.data);
                    
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
                    result(res.data)
                    console.log('_________complete');
                })
                .on('error', res => {
                    result(res.message)
                    console.log('__________error');
                })
                .on('success', res => {
                    result(res.data)
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
