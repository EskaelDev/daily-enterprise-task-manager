import express, { Application, Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import "reflect-metadata";
import { useExpressServer } from "routing-controllers";
import cors from 'cors';

export default class App {
    public app: express.Application;
    public port: number;

    constructor(port: number) {

        this.app = express();
        this.port = port;

        this.initializeMiddlewares();
        this.initializeControllers();
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json(), cors());
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
