import express, { Application, Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import { useExpressServer, createExpressServer } from "routing-controllers";
import cors from 'cors';
import passport from 'passport';

export default class App {
    public app: express.Application;
    public port: number;

    constructor(port: number) {

        this.app = createExpressServer({
            cors:true,
            routePrefix: '/api',
            controllers: [__dirname + "/**/*.controller.ts"]
        });
        this.port = port;

        // this.initializeMiddlewares();
        // this.initializeControllers();
    }

    private initializeMiddlewares() {
        this.app.use(cors(), passport.initialize(), passport.session());
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
