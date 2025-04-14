import express, {NextFunction, Request, Response} from 'express';
import {restifiedHandler} from "./restified.js";
import assert from "assert";
import queryString from "querystring";
import * as path from "path";
import * as OpenApiValidator from 'express-openapi-validator';
import SwaggerParser, {FileInfo} from '@apidevtools/swagger-parser';
import * as yaml from 'js-yaml';
import * as fs from "fs";
import {apiCallLogger} from "./logging";
import {IConfig} from "./types";
import {lineageRouterFactory} from "./lineage";
import swaggerUi from "swagger-ui-express";
import _ from "lodash";


export async function startServer(config: IConfig) {
    assert(process.env.API_SPEC_PATH)
    const app = express();

    const prePath = process.env.BASE_PATH ?? '/v1/api/rest';

    const fileResolver = {
        order: 1,
        async read(file: FileInfo) {
            const baseDir = path.dirname(path.resolve(process.cwd(), process.env.API_SPEC_PATH ?? ''));
            const relativePath = path.relative(process.cwd(), file.url);
            const newPath = path.join(baseDir, relativePath);
            return fs.promises.readFile(newPath, 'utf8');
        }
    };

    const options = {
        resolve: {
            file: fileResolver
        }
    };

    const LOCAL_SERVER = process.env.LOCAL_SERVER ?? 'http://localhost:3000';
    const BASE_PATH = process.env.BASE_PATH ?? '/v1/ai/rest';
    const SERVER_URI = LOCAL_SERVER + BASE_PATH;

    const apiSpecPath = path.resolve(process.cwd(), process.env.API_SPEC_PATH);
    const fileContent = fs.readFileSync(apiSpecPath, 'utf8');
    const spec = yaml.load(fileContent);
    const resolvedSpec = await SwaggerParser.dereference(spec as any, options) as any
    resolvedSpec.servers = [{
        url: SERVER_URI,
        description: process.env.SERVICE_DESCRIPTION ?? ''
    }];

    // Dynamically add lineage endpoints to Swagger
    resolvedSpec.paths[`${prePath}/lineage/generate`] = {
        post: {
            summary: "Generate lineage metadata",
            responses: {"200": {description: "Successful generation of lineage metadata"}}
        }
    };
    resolvedSpec.paths[`${prePath}/lineage`] = {
        get: {
            summary: "Retrieve lineage metadata",
            responses: {"200": {description: "Successful retrieval of lineage metadata"}}
        }
    };

    app.use(express.json());
    app.use((request, _response, next) => {
        request.query = queryString.parse(request.body.query);
        request.url = request.body.path;
        request.method = request.body.method;
        next();
    });
    app.use(apiCallLogger);

    app.get(`${prePath}/swagger.json`, (req,res,next) => {
        res.setHeader('Content-Type', 'application/json');
        res.json(resolvedSpec);
    })

    // Explicit rewrite for the custom CSS URL only
    app.use(`${prePath}/css`, swaggerUi.serve);
    // Other swagger JS assets served here
    app.use(`${prePath}`, swaggerUi.serve);
    // swagger HTML doc served here.
    app.get(`${prePath}/docs`, swaggerUi.setup(resolvedSpec, {customCssUrl: `${prePath}/css/swagger-ui.css`}));

    app.use(`${prePath}/lineage`, lineageRouterFactory(config));

    app.use(
        OpenApiValidator.middleware({
            apiSpec: resolvedSpec as any,
            validateResponses: _.get(process.env, 'VALIDATE_RESPONSES', 'false').toLowerCase() == 'true',
            validateRequests: _.get(process.env, 'VALIDATE_REQUESTS', 'false').toLowerCase() == 'true',
            useRequestUrl: true,
        })
    );

    app.use(prePath, async (req: Request, res: Response, next: NextFunction) => {
        assert(process.env.GRAPHQL_SERVER_URL);
        return restifiedHandler(req, res, process.env.GRAPHQL_SERVER_URL);
    });


    app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
        res.status(err.status || 500).json({
            message: err.message,
            errors: err.errors,
        });
    });

    return app;
}
