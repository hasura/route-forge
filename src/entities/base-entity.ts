// base.entity.ts
import {BaseEntity as TypeORMBaseEntity} from "typeorm";
import 'dotenv/config';

const schema = process.env.DB_SCHEMA;

export abstract class BaseEntity extends TypeORMBaseEntity {
    static getSchema(): string | undefined {
        return schema;
    }
}
