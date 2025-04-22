import {BaseEntity} from "./base-entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {ApiLineageEntity} from "./api-lineage.entity";
import {FieldLineageEntity} from "./field-lineage.entity";

@Entity({
    name: 'record_lineage',
    schema: BaseEntity.getSchema(),
    comment: 'Maps the lineage of data records through transformations for traceability.'
})
export class RecordLineageEntity extends BaseEntity {

    @PrimaryColumn({
        comment: 'Unique identifier for the record lineage.'
    })
    record_lineage_id!: string; // e.g., `${apiLineageId}_${recordTransformerName}`

    @Column({
        comment: 'The type/entity of input data in this lineage.'
    })
    input_type!: string;

    @Column({
        comment: 'The type/entity of output data in this lineage.'
    })
    output_type!: string;

    @Column({
        type: 'text',
        nullable: true,
        comment: 'General description of this data lineage relationship.'
    })
    description?: string;

    @Column({
        type: 'text',
        nullable: true,
        comment: 'Description of the input data source or format.'
    })
    input_description?: string;

    @Column({
        type: 'text',
        nullable: true,
        comment: 'Description of the output data destination or format.'
    })
    output_description?: string;

    @Column({
        nullable: true,
        comment: 'Names of primary key fields used to track the record through transformations.'
    })
    pk_names?: string;

    @Column({ nullable: true })
    api_lineage_id?: string; // Explicit foreign key column

    @ManyToOne(() => ApiLineageEntity, api => api.records, {onDelete: 'CASCADE', nullable: true})
    @JoinColumn({ name: 'api_lineage_id', referencedColumnName: 'api_lineage_id' })
    api_lineage?: ApiLineageEntity;

    @OneToMany(() => FieldLineageEntity, field => field.record_lineage, {cascade: true})
    fields!: FieldLineageEntity[];
}