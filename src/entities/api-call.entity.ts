// api-call.entity.ts
import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {RecordTransformation} from "./record-transformation.entity";
import {BaseEntity} from "./base-entity";
import {v4 as uuidv4} from 'uuid';
import {ApiLineageEntity} from "./api-lineage.entity";

@Entity({
    name: "api_calls",
    schema: BaseEntity.getSchema(),
    comment: 'Records API calls made to the system for auditing and lineage tracking.'
})
export class ApiCall {
    @PrimaryColumn("uuid", {
        comment: 'Unique identifier for the API call.'
    })
    api_call_id: string = uuidv4();

    @Column({
        comment: 'HTTP method used for the API call (GET, POST, etc.).'
    })
    method!: string;

    @Column({
        comment: 'API endpoint path that was called.'
    })
    path!: string;

    @Column({
        comment: 'Name of the server handling the API call.'
    })
    server_name!: string;

    @Column({type: 'int', comment: 'The major version assigned to the API'})
    major_version!: number

    @Column({type: 'int', comment: 'The minor version assigned to the API'})
    minor_version!: number

    @Column({comment: 'An identifier of the institution associated with the API call.', nullable: true})
    related_institution?: string;

    @Column({
        type: "text",
        nullable: true,
        comment: 'Query parameters sent with the API call, stored as TEXT.'
    })
    query_params!: string;

    @Column({
        type: "text",
        nullable: true,
        comment: 'HTTP headers sent with the API call, stored as TEXT.'
    })
    request_headers!: Record<string, unknown>;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        comment: 'Timestamp when the API call was made.'
    })
    created_at!: Date;

    @OneToMany(() => RecordTransformation, rt => rt.api_call)
    record_transformations!: RecordTransformation[];
}