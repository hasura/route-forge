# RESTified GraphQL Endpoints Plugin for Hasura DDN

## Overview

This library plugin for Hasura DDN (Distributed Data Network) makes it a breeze to add RESTified GraphQL endpoints to the DDN supergraph. It transforms GraphQL queries into REST-like endpoints, making it easier to integrate with systems that prefer REST APIs.

## Features

- Transform GraphQL queries into REST-like endpoints using a structure transformation engine that generates data lineage and provenance documentation.
- Configurable endpoint mapping - the transformation engine lets you create any output shape from any input shape
- Variable extraction from URL parameters, query strings, and request body
- OpenTelemetry integration for tracing
- Supports swagger docs and can host the swagger doc, and optionally validate input and outputs.

## How it works

1. Just run startServer(IConfig), passing a structure representation of the inputs and output.
2. When a request is received, it checks if it matches any configured RESTified endpoints.
3. If a match is found, the plugin:
   - Extracts variables from the request (URL parameters, query string, body)
   - Executes the corresponding GraphQL query with the extracted variables
   - Transforms the response into the desired shape returns it. 
   
## Configuration

Configure the plugin in `src/fdxapi.rest.config.ts`:

- `graphqlServer`: GraphQL server settings (headers)
- `headers`: Authentication headers
- `restifiedEndpoints`: Array of RESTified endpoint configurations

Example configuration:

```typescript
export const Config = {
  graphqlServer: {
    headers: {
      additional: {
        "Content-Type": "application/json",
      },
      forward: ["X-Hasura-Role"],
    },
  },
  headers: {
    "hasura-m-auth": "zZkhKqFjqXR4g5MZCsJUZCcoPyZ",
  },
  restifiedEndpoints: [
    {
      path: "/v1/api/rest/albums/:offset",
      methods: ["GET"],
      query: `
        query MyQuery($limit: Int = 10, $offset: Int = 10) {
          Album(limit: $limit, offset: $offset) {
            Title
          }
        }
      `,
    },
    // Add more RESTified endpoints here
  ],
};
```

Configure the graphql server URL in `.dev.vars`:

```toml
[vars]
OTEL_EXPORTER_OTLP_ENDPOINT = "<ex, http://localhost:4318/v1/traces>"
OTEL_EXPORTER_PAT = "<ex, foobar>"
GRAPHQL_SERVER_URL = "<ex, http://localhost:3280/graphql>"
M_AUTH_KEY = "<ex, secret>"
LOCAL_SERVER = "http://localhost:3000"
SERVICE_DESCRIPTION = "Financial Data Exchange Example API"
BASE_PATH = /v1/api/rest
# DB Configuration
DB_TYPE=postgres       # "postgres" | "mysql" | "mongodb" etc.
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=postgres
DB_SYNC=true          # true only in dev environment
DB_LOGGING=true       # true to enable logging
DB_SCHEMA=data_quality
VALIDATE_REQUESTS=true
VALIDATE_RESPONSES=false
API_SPEC_PATH=./specs/fdx/fdxapi.core.yaml
```

## Development

**Note**: We are using Cloudflare wrangler for local development and deployment. However, you can use any other tool for the same. You will have to modify the files accordingly.

### Local development

To run the plugin locally, you can use the following steps:

1. Install wrangler:

   ```sh
   npm install -g wrangler
   ```

2. Clone this repository:

   ```sh
   git clone https://github.com/your-org/engine-plugin-restified-endpoint.git
   cd engine-plugin-restified-endpoint
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

4. Start the local development server:

   ```sh
   npm start
   ```

The above command will start a local server that listens for incoming requests. The server runs on port 8787 by default. The URL of the local server will be displayed in the terminal.

### Cloud deployment

For cloud deployment, you can use the following steps in addition to the local development steps:

1. Create an account on Cloudflare.

2. Login to Cloudflare:

   ```sh
   wrangler login
   ```

3. Deploy to Cloudflare:

   ```sh
   npm run deploy
   ```

The above command should deploy the RESTified endpoints plugin (as a lambda) using Cloudflare workers. The URL of the deployed plugin will be displayed in the terminal.

## Using the plugin in DDN

Update the metadata to add the plugin-related config (in global subgraph). Also, add the env vars for the URL of local dev and cloud deployment:

```yaml
---
kind: LifecyclePluginHook
version: v1
definition:
   pre: route
   name: css
   url:
      valueFromEnv: FDX_URL
   config:
      matchPath: "/v1/api/rest/css"
      matchMethods: ["GET"]
      request:
         method: GET
         headers:
            forward:
               - Authorization
               - x-hasura-role
               - x-hasura-ddn-token
               - x-hasura-user-id
            additional:
               hasura-m-auth:
                  valueFromEnv: M_AUTH_KEY
         rawRequest:
            path: {}
            query: {}
            method: {}
            body: {}
      response:
         headers:
            additional:
               content-type:
                  value: text/css
---
kind: LifecyclePluginHook
version: v1
definition:
   pre: route
   name: fdx_docs
   url:
      valueFromEnv: FDX_URL
   config:
      matchPath: "/v1/api/rest/docs"
      matchMethods: ["GET"]
      request:
         method: GET
         headers:
            forward:
               - Authorization
               - x-hasura-role
               - x-hasura-ddn-token
               - x-hasura-user-id
            additional:
               hasura-m-auth:
                  valueFromEnv: M_AUTH_KEY
         rawRequest:
            path: {}
            query: {}
            method: {}
            body: {}
      response:
         headers:
            additional:
               content-type:
                  value: text/html
---
kind: LifecyclePluginHook
version: v1
definition:
   pre: route
   name: fdx_get
   url:
      valueFromEnv: FDX_URL
   config:
      matchPath: "/v1/api/rest/*"
      matchMethods: ["GET"]
      request:
         method: GET
         headers:
            forward:
               - Authorization
               - x-hasura-role
               - x-hasura-ddn-token
               - x-hasura-user-id
               - x-fapi-interaction-id
               - fdx-api-actor-type
            additional:
               hasura-m-auth:
                  valueFromEnv: M_AUTH_KEY
         rawRequest:
            path: {}
            query: {}
            method: {}
            body: {}
      response:
         headers:
            additional:
               content-type:
                  value: application/octet-stream
---
kind: LifecyclePluginHook
version: v1
definition:
   pre: route
   name: fdx_post
   url:
      valueFromEnv: FDX_URL
   config:
      matchPath: "/v1/api/rest/*"
      matchMethods: ["POST"]
      request:
         method: POST
         headers:
            forward:
               - Authorization
               - x-hasura-role
               - x-hasura-ddn-token
               - x-hasura-user-id
               - x-fapi-interaction-id
               - fdx-api-actor-type
            additional:
               hasura-m-auth:
                  valueFromEnv: M_AUTH_KEY
         rawRequest:
            path: {}
            query: {}
            method: {}
            body: {}
      response:
         headers:
            additional:
               content-type:
                  value: application/json

```

Build DDN supergraph:

```sh
ddn supergraph build create
```

Please update the GRAPHQL_SERVER_URL variable in the `wrangler.toml` with the project's graphql endpoint.

**Note**: For end-to-end tracing, you would have to update the `wrangler.toml` file to add the Hasura PAT in `OTEL_EXPORTER_PAT` var.

## Adding new RESTified endpoints

To add new RESTified endpoints, update the `restifiedEndpoints` array in `src/fdxapi.rest.config.ts`. For example:

```typescript
restifiedEndpoints: [
  {
    path: "/v1/api/rest/users/:id",
    methods: ["GET"],
    query: `
      query GetUser($id: ID!) {
        user(id: $id) {
          id
          name
          email
        }
      }
    `,
  },
  {
    path: "/v1/api/rest/posts",
    method: ["POST"],
    query: `
      mutation CreatePost($title: String!, $content: String!) {
        createPost(input: { title: $title, content: $content }) {
          id
          title
        }
      }
    `,
  },
];
```

After adding new endpoints, redeploy the plugin for the changes to take effect.

## Limitations and Future Improvements

- Currently the plugin supports basic variable extraction. More complex scenarios might require additional implementation.
- OpenAPI Spec documentation generation is not yet implemented.
- Rate limiting is not currently supported within the plugin.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
