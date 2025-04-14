// data-source.ts
import 'dotenv/config';
import {DataSource} from "typeorm";
import {ApiCall} from "./api-call.entity";
import {RecordTransformation} from "./record-transformation.entity";
import {FieldTransformationDetail} from "./field-transformation-details.entity";
import {ApiLineageEntity} from "./api-lineage.entity";
import {RecordLineageEntity} from "./record-lineage.entity";
import {FieldLineageEntity} from "./field-lineage.entity";

// Utility function to parse env booleans
const parseBool = (val: string | undefined, defaultVal = false) =>
    val ? ['true', '1', 'yes'].includes(val.toLowerCase()) : defaultVal;

// TypeORM configuration object
const dbType = (process.env.DB_TYPE || 'postgres') as any; // 'postgres' | 'mysql' | 'mongodb', etc.

// Shared TypeORM configuration
const dataSourceConfig: any = {
    type: dbType,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: parseBool(process.env.DB_SYNC, false),
    logging: parseBool(process.env.DB_LOGGING, false),
    entities: [
        ApiCall,
        RecordTransformation,
        FieldTransformationDetail,
        ApiLineageEntity,
        RecordLineageEntity,
        FieldLineageEntity,
    ],
    migrations: [],
};

// MongoDB-specific configuration
if (dbType === 'mongodb') {
    Object.assign(dataSourceConfig, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });

    // MongoDB typically uses connection strings
    dataSourceConfig.url = process.env.DB_URL || `mongodb://${dataSourceConfig.host}:${dataSourceConfig.port}/${dataSourceConfig.database}`;

    // Remove unsupported fields for MongoDB
    delete dataSourceConfig.username;
    delete dataSourceConfig.password;
    delete dataSourceConfig.host;
    delete dataSourceConfig.port;
    delete dataSourceConfig.database;
}

// Instantiate DataSource
export const AppDataSource = new DataSource(dataSourceConfig);

// Initialize DataSource
AppDataSource.initialize()
    .then(() => {
        console.log(`Data Source initialized! [${dbType}]`);
    })
    .catch((error) => {
        console.error(`Data Source initialization error [${dbType}]:`, error);
        process.exit(1);
    });
