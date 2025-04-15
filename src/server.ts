import express, {NextFunction, Request, Response} from 'express';
import {restifiedHandler} from "./restified.js";
import assert from "assert";
import queryString from "querystring";
import {apiCallLogger} from "./logging";
import {IConfig} from "./types";
import {lineageRouterFactory} from "./lineage";
import {swaggerFactory} from "./swagger-factory";

export async function startServer(config: IConfig) {
    const app = express();

    const prePath = process.env.BASE_PATH ?? '/v1/api/rest';

    app.use(express.json());
    app.use((request, _response, next) => {
        request.query = queryString.parse(request.body.query);
        request.url = request.body.path;
        request.method = request.body.method;
        next();
    });
    app.use(apiCallLogger);

    app.use(`${prePath}/lineage`, lineageRouterFactory(config));

    // Use the swagger factory to set up swagger routes
    app.use(prePath, swaggerFactory(config, prePath));

    app.use(prePath, async (req: Request, res: Response, next: NextFunction) => {
        assert(process.env.GRAPHQL_SERVER_URL);
        return restifiedHandler(config, req, res, process.env.GRAPHQL_SERVER_URL);
    });

    app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors,
        });
    });

    return app;
}