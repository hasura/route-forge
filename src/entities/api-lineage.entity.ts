import {BaseEntity} from "./base-entity";
import {Column, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {RecordLineageEntity} from "./record-lineage.entity";

@Entity({
    name: 'api_lineage',
    schema: BaseEntity.getSchema(),
    comment: 'Tracks the lineage of API calls for data governance and auditing purposes.'
})
export class ApiLineageEntity extends BaseEntity {

    @PrimaryColumn({
        type: 'varchar',
        comment: 'Unique identifier for the API lineage record.'
    })
    api_lineage_id!: string; // e.g., `${serverName}_${apiCall}`

    @Column({
        type: 'uuid',
        nullable: true,
        comment: 'Reference to associated app management record.'
    })
    app_mgmt_application_id?: string;

    @Column({
        type: 'uuid',
        nullable: true,
        comment: 'Reference to associated app management record. Convenience for processing.'
    })
    host_app_mgmt_application_id?: string;

    @Column({
        type: 'uuid',
        nullable: true,
        comment: 'Optional reference to server.'
    })
    security_host_id?: string;

    @Column({
        comment: 'Name of the server handling the API call.'
    })
    server_name!: string;

    @Column({type: 'int', comment: 'The major version assigned to the API'})
    major_version!: number

    @Column({type: 'int', comment: 'The minor version assigned to the API'})
    minor_version!: number

    @Column({
        comment: 'The API endpoint and method called.'
    })
    api_call!: string;

    @Column({
        type: "text",
        comment: 'The DDN query used to source data for this API call'
    })
    query: string = "";

    @Column({
        type: 'text',
        nullable: true,
        comment: 'Description of the API call purpose or context.'
    })
    description?: string;

    @Column({
        type: 'timestamp with time zone',
        comment: 'Timestamp when this API lineage tracking began.'
    })
    start_date!: Date;

    @Column({
        type: 'timestamp with time zone',
        nullable: true,
        comment: 'Timestamp when this API lineage tracking ended, if applicable.'
    })
    end_date?: Date;

    @Column({
        type: 'timestamp with time zone',
        nullable: true,
        comment: 'Timestamp when this record was last updated.'
    })
    updated_at?: Date;

    @OneToMany(() => RecordLineageEntity, record => record.api_lineage, {cascade: true})
    records?: RecordLineageEntity[];
}