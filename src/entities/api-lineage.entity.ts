import {BaseEntity} from "./base-entity";
import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {RecordLineageEntity} from "./record-lineage.entity";

@Entity({
    name: 'api_lineage',
    schema: BaseEntity.getSchema(),
    comment: 'Tracks the lineage of API calls for data governance and auditing purposes.'
})
export class ApiLineageEntity extends BaseEntity {

    @PrimaryColumn({
        comment: 'Unique identifier for the API lineage record.'
    })
    apiLineageId!: string; // e.g., `${serverName}_${apiCall}`

    @Column({
        comment: 'Name of the server handling the API call.'
    })
    serverName!: string;

    @Column({
        comment: 'The API endpoint and method called.'
    })
    apiCall!: string;

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
    startDate!: Date;

    @Column({
        type: 'timestamp with time zone',
        nullable: true,
        comment: 'Timestamp when this API lineage tracking ended, if applicable.'
    })
    endDate?: Date;

    @Column({
        type: 'timestamp with time zone',
        nullable: true,
        comment: 'Timestamp when this record was last updated.'
    })
    updatedAt?: Date;

    @OneToMany(() => RecordLineageEntity, record => record.apiLineage, {cascade: true})
    records!: RecordLineageEntity[];
}