import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {RecordTransformation} from "./record-transformation.entity";
import {BaseEntity} from "./base-entity";
import {v4 as uuidv4} from 'uuid';

@Entity({
    name: "field_transformation_details",
    schema: BaseEntity.getSchema(),
    comment: 'Detailed tracking of field-level transformations within a record transformation.'
})
export class FieldTransformationDetail {
    @PrimaryColumn("uuid", {
        comment: 'Unique identifier for the field transformation detail.'
    })
    field_transformation_detail_id: string = uuidv4();

    @Column({
        comment: 'Description of the specific transformation applied to this field.'
    })
    transform_description!: string

    @Column({
        comment: 'Name of the input field before transformation.'
    })
    input_field_name!: string;

    @Column({
        type: 'text',
        nullable: true,
        comment: 'Value of the input field before transformation.'
    })
    input_field_value!: string;

    @Column({
        comment: 'Name of the output field after transformation.'
    })
    output_field_name!: string;

    @Column({
        type: 'text',
        nullable: true,
        comment: 'Value of the output field after transformation.'
    })
    output_field_value!: string;

    @ManyToOne(() => RecordTransformation, transformation => transformation.field_details, {onDelete: 'CASCADE'})
    transformation!: RecordTransformation;
}