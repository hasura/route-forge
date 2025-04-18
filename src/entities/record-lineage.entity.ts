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
    recordLineageId!: string; // e.g., `${apiLineageId}_${recordTransformerName}`

    @Column({
        comment: 'The type/entity of input data in this lineage.'
    })
    inputType!: string;

    @Column({
        comment: 'The type/entity of output data in this lineage.'
    })
    outputType!: string;

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
    inputDescription?: string;

    @Column({
        type: 'text',
        nullable: true,
        comment: 'Description of the output data destination or format.'
    })
    outputDescription?: string;

    @Column({
        nullable: true,
        comment: 'Names of primary key fields used to track the record through transformations.'
    })
    pkNames?: string;

    @ManyToOne(() => ApiLineageEntity, api => api.records, {onDelete: 'CASCADE'})
    @JoinColumn()
    apiLineage!: ApiLineageEntity | null;

    @OneToMany(() => FieldLineageEntity, field => field.recordLineage, {cascade: true})
    fields!: FieldLineageEntity[];
}