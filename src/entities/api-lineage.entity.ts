import {BaseEntity} from "./base-entity";
import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {RecordLineageEntity} from "./record-lineage.entity";

@Entity({name: 'api_lineage', schema: BaseEntity.getSchema()})
export class ApiLineageEntity extends BaseEntity {

    @PrimaryColumn()
    apiLineageId!: string; // e.g., `${serverName}_${apiCall}`

    @Column()
    serverName!: string;

    @Column()
    apiCall!: string;

    @Column({type: 'text', nullable: true})
    description?: string;

    @Column({type: 'timestamp with time zone'})
    startDate!: Date;

    @Column({type: 'timestamp with time zone', nullable: true})
    endDate?: Date;

    @Column({type: 'timestamp with time zone', nullable: true})
    updatedAt?: Date;

    @OneToMany(() => RecordLineageEntity, record => record.apiLineage, {cascade: true})
    records!: RecordLineageEntity[];
}
