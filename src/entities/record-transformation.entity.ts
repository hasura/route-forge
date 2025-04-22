// record-transformation.entity.ts (updated)
import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {FieldTransformationDetail} from "./field-transformation-details.entity";
import {ApiCall} from "./api-call.entity";
import {BaseEntity} from "./base-entity";
import {v4 as uuidv4} from 'uuid';

@Entity({
    name: "record_transformations",
    schema: BaseEntity.getSchema(),
    comment: 'Tracks actual instances of transformations applied to data records, linking input and output data.'
})
export class RecordTransformation {
    @PrimaryColumn("uuid", {
        comment: 'Unique identifier for the record transformation.'
    })
    record_transformation_id: string = uuidv4();

    @Column({
        comment: 'The type/entity of the input record before transformation.'
    })
    input_type!: string;

    @Column({
        comment: 'The type/entity of the output record after transformation.'
    })
    output_type!: string;

    @Column({
        comment: 'Description of the transformation process or purpose.'
    })
    description!: string;

    @Column({
        comment: 'Names of the primary key fields, comma-separated.'
    })
    primary_key_names!: string;

    @Column({
        comment: 'Values of the primary keys, comma-separated.'
    })
    primary_key_values!: string;

    @CreateDateColumn({
        type: 'timestamp with time zone',
        comment: 'Timestamp when the transformation was executed.'
    })
    created_at!: Date;

    @OneToMany(() => FieldTransformationDetail, detail => detail.transformation, {cascade: true})
    field_details!: FieldTransformationDetail[];

    @ManyToOne(() => ApiCall, apiCall => apiCall.record_transformations, {onDelete: 'SET NULL'})
    api_call!: ApiCall;
}