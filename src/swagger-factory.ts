import * as path from "path";
import * as fs from "fs";
import * as yaml from "js-yaml";
import SwaggerParser, { FileInfo } from '@apidevtools/swagger-parser';
import * as OpenApiValidator from 'express-openapi-validator';
import swaggerUi from "swagger-ui-express";
import _ from "lodash";
import express, { Router } from 'express';
import { IConfig } from "./types";
import { LineageFieldSchema, LineageRecordSchema, LineageApiSchema, LineageResponseSchema } from "./types";
import assert from "assert";

export function swaggerFactory(config: IConfig, prePath: string): Router {
    const router = express.Router();

    if (!process.env.API_SPEC_PATH) {
        return router;
    }

    const LOCAL_SERVER = process.env.GRAPHQL_SERVER_URL ?? 'http://localhost:3280';
    const BASE_PATH = process.env.BASE_PATH ?? '/v1/ai/rest';
    const SERVER_URI = LOCAL_SERVER.replace(/\/graphql/, BASE_PATH)

    // Create file resolver for handling references in Swagger spec
    const fileResolver = {
        order: 1,
        async read(file: FileInfo) {
            const baseDir = path.dirname(path.resolve(process.cwd(), process.env.API_SPEC_PATH ?? ''));
            const relativePath = path.relative(process.cwd(), file.url);
            const newPath = path.join(baseDir, relativePath);
            return fs.promises.readFile(newPath, 'utf8');
        }
    };

    const setupSwagger = async () => {
        assert(process.env.API_SPEC_PATH)
        const options = {
            resolve: {
                file: fileResolver
            }
        };

        const apiSpecPath = path.resolve(process.cwd(), process.env.API_SPEC_PATH);
        const fileContent = fs.readFileSync(apiSpecPath, 'utf8');
        const spec = yaml.load(fileContent);
        const resolvedSpec = await SwaggerParser.dereference(spec as any, options) as any;

        resolvedSpec.servers = [{
            url: SERVER_URI,
            description: process.env.SERVICE_DESCRIPTION ?? ''
        }];

        // Register schema components
        if (!resolvedSpec.components) {
            resolvedSpec.components = {};
        }

        if (!resolvedSpec.components.schemas) {
            resolvedSpec.components.schemas = {};
        }

        // Add our schema components
        resolvedSpec.components.schemas.LineageField = LineageFieldSchema;
        resolvedSpec.components.schemas.LineageRecord = LineageRecordSchema;
        resolvedSpec.components.schemas.LineageApi = LineageApiSchema;
        resolvedSpec.components.schemas.LineageResponse = LineageResponseSchema;

        // Add tags if they don't exist
        if (!resolvedSpec.tags) {
            resolvedSpec.tags = [];
        }

        // Add Data Governance tag if it doesn't exist
        if (!resolvedSpec.tags.some((tag: {name: string}) => tag.name === 'Data Governance')) {
            resolvedSpec.tags.push({
                name: 'Data Governance',
                description: 'API endpoints for data governance and lineage'
            });
        }

        // Dynamically add lineage endpoints to Swagger
        resolvedSpec.paths[`/lineage/generate`] = {
            post: {
                tags: ['Data Governance'],
                summary: "Generate lineage metadata",
                responses: {"200": {description: "Successful generation of lineage metadata"}}
            }
        };

        resolvedSpec.paths[`/lineage/get`] = {
            get: {
                tags: ['Data Governance'],
                summary: "Retrieve lineage metadata",
                parameters: [
                    {
                        name: "generate",
                        in: "query",
                        description: "Generate option",
                        required: false,
                        schema: {
                            type: "boolean",
                            enum: [true],
                        },
                    },
                ],
                responses: {
                    "200": {
                        description: "Successful retrieval of lineage metadata",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/LineageResponse"
                                }
                            }
                        }
                    }
                }
            }
        };


        router.get(`/swagger.json`, (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.json(resolvedSpec);
        });

        // Explicit rewrite for the custom CSS URL only
        router.use(`/css`, swaggerUi.serve);
        // Other swagger JS assets served here
        router.use(`/`, swaggerUi.serve);
        // swagger HTML doc served here.
        router.get(`/docs`, swaggerUi.setup(resolvedSpec, {customCssUrl: `${prePath}/css/swagger-ui.css`}));

        // Add validation middleware to app
        router.use((request, _response, next) => {
            request.url = request.body.path
            next();
        });
        router.use(
            OpenApiValidator.middleware({
                apiSpec: resolvedSpec as any,
                validateResponses: _.get(process.env, 'VALIDATE_RESPONSES', 'false').toLowerCase() == 'true',
                validateRequests: _.get(process.env, 'VALIDATE_REQUESTS', 'false').toLowerCase() == 'true',
                useRequestUrl: true,
            })
        );

        return router;
    };

    // Initialize the router asynchronously
    setupSwagger().catch(err => {
        console.error('Failed to set up Swagger:', err);
    });

    return router;
}