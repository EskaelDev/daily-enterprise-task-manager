import express, { Application, Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import "reflect-metadata";
import { useExpressServer } from "routing-controllers";

export default class App {
    public app: express.Application;
    public port: number;
    public cors;

    constructor(port: number) {
        const express = require('express');
        this.cors = require('cors');
        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers();
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json(), this.cors());
    }

    private initializeControllers() {
        useExpressServer(this.app, {
            controllers: [__dirname + "/**/*.controller.ts"]
        });
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`Server started at http://localhost:${this.port}`);
        });
    }
}
