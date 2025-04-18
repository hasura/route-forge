import {Column, Entity, JoinColumn, ManyToOne, PrimaryColumn} from "typeorm";
import {BaseEntity} from "./base-entity";
import {RecordLineageEntity} from "./record-lineage.entity";

@Entity({
    name: 'field_lineage',
    schema: BaseEntity.getSchema(),
    comment: 'Tracks the lineage of individual fields through data transformations.'
})
export class FieldLineageEntity extends BaseEntity {

    @PrimaryColumn({
        comment: 'Unique identifier for the field lineage.'
    })
    fieldLineageId!: string; // e.g., `${recordLineageId}_${fieldName}`

    @Column({
        comment: 'Name of the field being tracked.'
    })
    fieldName!: string;

    @Column({
        type: 'text',
        nullable: true,
        comment: 'Description of this field lineage relationship.'
    })
    description?: string;

    @Column({
        nullable: true,
        comment: 'Source fields that contribute to this field, comma-separated.'
    })
    inputFields?: string;

    @ManyToOne(() => RecordLineageEntity, record => record.fields, {onDelete: 'CASCADE'})
    @JoinColumn()
    recordLineage!: RecordLineageEntity;
}