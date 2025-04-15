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

Configure the plugin in `example/rest.config.ts` or your choice:

- `graphqlServer`: GraphQL server settings (headers & forwarded headers)
- `service_authorization_headers`: Authentication service_authorization_headers
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
  service_authorization_headers: {
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

You can get manage lineage with these endpoints:
- Generate Lineage - `/v1/api/rest/lineage/generate`
- Get Lineage - `/v1/api/rest/lineage/get`

lineage get will return a lineage data structure like this:

```json
[
  {
    "apiLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET",
    "serverName": "XYZ_BANK_FDX_API_Server",
    "apiCall": "/v1/api/rest/accounts",
    "description": "Lineage for /v1/api/rest/accounts",
    "startDate": "2025-04-15T21:54:39.759Z",
    "endDate": null,
    "updatedAt": null,
    "records": [
      {
        "recordLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account",
        "inputType": "Primarily from consumer_banking.accounts.",
        "outputType": "FDX (Account | DepositAccount) type.",
        "description": "Map my bank deposit account to FDX API account",
        "inputDescription": null,
        "outputDescription": null,
        "pkNames": "consumerBankingAccountId",
        "fields": [
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_status",
            "fieldName": "status",
            "description": "Converts the input from an Open Banking Status to an FDX status.\n- for OB Status 'ACTIVE' return FDX Status 'OPEN'\n- for OB Status 'PENDING' return FDX Status 'PENDINGOPEN'\n- for OB Status 'INACTIVE','DORMANT','SUSPENDED','FROZEN' return FDX Status 'RESTRICTED'\n- for OB Status 'CLOSED','ARCHIVED' return FDX Status 'CLOSED'\n",
            "inputFields": "status"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_accountCategory",
            "fieldName": "accountCategory",
            "description": "Convert a product type to an FDX account category based on the following mapping rules:\n- For product types 'CHECKING', 'SAVINGS', 'STUDENT', 'YOUTH', 'SENIOR', 'PREMIUM', 'FOREIGN_CURRENCY', and 'SPECIALIZED', the returned account category is 'DEPOSIT_ACCOUNT'.\n- For product types 'MONEY_MARKET', 'CERTIFICATE_OF_DEPOSIT', and 'IRA', the returned account category is 'INVESTMENT_ACCOUNT'.\n- For the 'HSA' product type, the returned account category is 'INSURANCE_ACCOUNT'.\n- For product types 'BUSINESS_CHECKING' and 'BUSINESS_SAVINGS', the returned account category is 'COMMERCIAL_ACCOUNT'.\n- If the provided product type doesn't match any of the predefined types, an Error is thrown indicating 'Unknown ProductType'.\"\n",
            "inputFields": "consumerBankingProduct.productType"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_accountId",
            "fieldName": "accountId",
            "description": "Convert a value from a number to a string",
            "inputFields": "consumerBankingAccountId"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_accountNumber",
            "fieldName": "accountNumber",
            "description": "Maps straight-through.",
            "inputFields": "accountNumber"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_balanceAsOf",
            "fieldName": "balanceAsOf",
            "description": "Computed value of current UTC date and time.",
            "inputFields": "balanceAsOf"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_currentBalance",
            "fieldName": "currentBalance",
            "description": "Converts the input from a string to a number converting non-numerics to zeros",
            "inputFields": "currentBalance"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_availableBalance",
            "fieldName": "availableBalance",
            "description": "Converts the input from a string to a number converting non-numerics to zeros",
            "inputFields": "availableBalance"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_openingDayBalance",
            "fieldName": "openingDayBalance",
            "description": "Converts the input from a string to a number converting non-numerics to zeros",
            "inputFields": "openingDayBalance"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_annualPercentageYield",
            "fieldName": "annualPercentageYield",
            "description": "Converts the input from a string to a number converting non-numerics to zeros.",
            "inputFields": "annualPercentageYield"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_interestYtd",
            "fieldName": "interestYtd",
            "description": "Converts the input from a string to a number converting non-numerics to zeros.",
            "inputFields": "interestYtd"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_term",
            "fieldName": "term",
            "description": "Converts the input from a string to a number converting non-numerics to zeros. Rounded to 1 decimals.",
            "inputFields": "term"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_nickname",
            "fieldName": "nickname",
            "description": "Maps straight-through.",
            "inputFields": "nickname"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_displayName",
            "fieldName": "displayName",
            "description": "Maps straight-through.",
            "inputFields": "displayName"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_maturityDate",
            "fieldName": "maturityDate",
            "description": "Converts the input from an any RFC date-like string to an RFC date string.",
            "inputFields": "maturityDate"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_currency.currencyCode",
            "fieldName": "currency.currencyCode",
            "description": "Maps straight-through.",
            "inputFields": "currency.code"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts_GET_account_productName",
            "fieldName": "productName",
            "description": "Maps straight-through.",
            "inputFields": "consumerBankingProduct.productName"
          }
        ]
      }
    ]
  },
  {
    "apiLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET",
    "serverName": "XYZ_BANK_FDX_API_Server",
    "apiCall": "/v1/api/rest/accounts/:accountId",
    "description": "Lineage for /v1/api/rest/accounts/:accountId",
    "startDate": "2025-04-15T21:54:39.759Z",
    "endDate": null,
    "updatedAt": null,
    "records": [
      {
        "recordLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account",
        "inputType": "Primarily from consumer_banking.accounts.",
        "outputType": "FDX (Account | DepositAccount) type.",
        "description": "Map my bank deposit account to FDX API account",
        "inputDescription": null,
        "outputDescription": null,
        "pkNames": "consumerBankingAccountId",
        "fields": [
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_status",
            "fieldName": "status",
            "description": "Converts the input from an Open Banking Status to an FDX status.\n- for OB Status 'ACTIVE' return FDX Status 'OPEN'\n- for OB Status 'PENDING' return FDX Status 'PENDINGOPEN'\n- for OB Status 'INACTIVE','DORMANT','SUSPENDED','FROZEN' return FDX Status 'RESTRICTED'\n- for OB Status 'CLOSED','ARCHIVED' return FDX Status 'CLOSED'\n",
            "inputFields": "status"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_accountCategory",
            "fieldName": "accountCategory",
            "description": "Convert a product type to an FDX account category based on the following mapping rules:\n- For product types 'CHECKING', 'SAVINGS', 'STUDENT', 'YOUTH', 'SENIOR', 'PREMIUM', 'FOREIGN_CURRENCY', and 'SPECIALIZED', the returned account category is 'DEPOSIT_ACCOUNT'.\n- For product types 'MONEY_MARKET', 'CERTIFICATE_OF_DEPOSIT', and 'IRA', the returned account category is 'INVESTMENT_ACCOUNT'.\n- For the 'HSA' product type, the returned account category is 'INSURANCE_ACCOUNT'.\n- For product types 'BUSINESS_CHECKING' and 'BUSINESS_SAVINGS', the returned account category is 'COMMERCIAL_ACCOUNT'.\n- If the provided product type doesn't match any of the predefined types, an Error is thrown indicating 'Unknown ProductType'.\"\n",
            "inputFields": "consumerBankingProduct.productType"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_accountId",
            "fieldName": "accountId",
            "description": "Convert a value from a number to a string",
            "inputFields": "consumerBankingAccountId"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_accountNumber",
            "fieldName": "accountNumber",
            "description": "Maps straight-through.",
            "inputFields": "accountNumber"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_balanceAsOf",
            "fieldName": "balanceAsOf",
            "description": "Computed value of current UTC date and time.",
            "inputFields": "balanceAsOf"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_currentBalance",
            "fieldName": "currentBalance",
            "description": "Converts the input from a string to a number converting non-numerics to zeros",
            "inputFields": "currentBalance"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_availableBalance",
            "fieldName": "availableBalance",
            "description": "Converts the input from a string to a number converting non-numerics to zeros",
            "inputFields": "availableBalance"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_openingDayBalance",
            "fieldName": "openingDayBalance",
            "description": "Converts the input from a string to a number converting non-numerics to zeros",
            "inputFields": "openingDayBalance"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_annualPercentageYield",
            "fieldName": "annualPercentageYield",
            "description": "Converts the input from a string to a number converting non-numerics to zeros.",
            "inputFields": "annualPercentageYield"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_interestYtd",
            "fieldName": "interestYtd",
            "description": "Converts the input from a string to a number converting non-numerics to zeros.",
            "inputFields": "interestYtd"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_term",
            "fieldName": "term",
            "description": "Converts the input from a string to a number converting non-numerics to zeros. Rounded to 1 decimals.",
            "inputFields": "term"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_nickname",
            "fieldName": "nickname",
            "description": "Maps straight-through.",
            "inputFields": "nickname"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_displayName",
            "fieldName": "displayName",
            "description": "Maps straight-through.",
            "inputFields": "displayName"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_maturityDate",
            "fieldName": "maturityDate",
            "description": "Converts the input from an any RFC date-like string to an RFC date string.",
            "inputFields": "maturityDate"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_currency.currencyCode",
            "fieldName": "currency.currencyCode",
            "description": "Maps straight-through.",
            "inputFields": "currency.code"
          },
          {
            "fieldLineageId": "XYZ_BANK_FDX_API_Server_/v1/api/rest/accounts/:accountId_GET_account_productName",
            "fieldName": "productName",
            "description": "Maps straight-through.",
            "inputFields": "consumerBankingProduct.productName"
          }
        ]
      }
    ]
  }
]
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
DB_TYPE=postgres                            # "postgres" | "mysql" | "mongodb" etc.
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=postgres
DB_SYNC=true                               # true only in dev environment
DB_LOGGING=true                            # true to enable logging
DB_SCHEMA=data_quality                     # make sure this exists in the DB first
API_SPEC_PATH=./specs/fdx/fdxapi.core.yaml # optional swagger spec
VALIDATE_REQUESTS=true                     # validate incoming requests against swagger spec
VALIDATE_RESPONSES=false                   # validate outbound responses against swagger spec
```

If `API_SPEC_PATH` points to a valid OpenAPI spec, you can also get the swagger assets at:

- UI - `/v1/api/rest/docs`
- Doc - `/v1/api/rest/swagger.json`

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
   git clone https://github.com/hasura/route-forge
   cd route-forge
   ```

3. Install dependencies:

   ```sh
   npm install
   ```

4. Start the local development server:

   ```sh
   npm dev
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
         service_authorization_headers:
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
         service_authorization_headers:
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
         service_authorization_headers:
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
         service_authorization_headers:
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
         service_authorization_headers:
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
         service_authorization_headers:
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
         service_authorization_headers:
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
         service_authorization_headers:
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
