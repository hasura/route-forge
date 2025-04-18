// api-call.entity.ts
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {RecordTransformation} from "./record-transformation.entity";
import {BaseEntity} from "./base-entity";
import {v4 as uuidv4} from 'uuid';

@Entity({
    name: "api_calls",
    schema: BaseEntity.getSchema(),
    comment: 'Records API calls made to the system for auditing and lineage tracking.'
})
export class ApiCall {
    @PrimaryColumn("uuid", {
        comment: 'Unique identifier for the API call.'
    })
    id: string = uuidv4();

    @Column({
        comment: 'HTTP method used for the API call (GET, POST, etc.).'
    })
    method!: string;

    @Column({
        comment: 'API endpoint path that was called.'
    })
    path!: string;

    @Column({
        type: "text",
        nullable: true,
        comment: 'Query parameters sent with the API call, stored as TEXT.'
    })
    queryParams!: string;

    @Column({
        type: "text",
        nullable: true,
        comment: 'HTTP headers sent with the API call, stored as TEXT.'
    })
    requestHeaders!: Record<string, unknown>;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        comment: 'Timestamp when the API call was made.'
    })
    calledAt!: Date;

    @OneToMany(() => RecordTransformation, rt => rt.apiCall)
    recordTransformations!: RecordTransformation[];
}