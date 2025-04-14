import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {BaseEntity} from "./base-entity";
import {RecordLineageEntity} from "./record-lineage.entity";

@Entity({name: 'field_lineage', schema: BaseEntity.getSchema()})
export class FieldLineageEntity extends BaseEntity {

    @PrimaryColumn()
    fieldLineageId!: string; // e.g., `${recordLineageId}_${fieldName}`

    @Column()
    fieldName!: string;

    @Column({type: 'text', nullable: true})
    description?: string;

    @Column({nullable: true})
    inputFields?: string;

    @ManyToOne(() => RecordLineageEntity, record => record.fields, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'recordLineageId'})
    recordLineage!: RecordLineageEntity;
}
