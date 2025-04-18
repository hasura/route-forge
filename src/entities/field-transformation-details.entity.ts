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
    id: string = uuidv4();

    @Column({
        comment: 'Description of the specific transformation applied to this field.'
    })
    transformDescription!: string

    @Column({
        comment: 'Name of the input field before transformation.'
    })
    inputFieldName!: string;

    @Column({
        type: 'text',
        nullable: true,
        comment: 'Value of the input field before transformation.'
    })
    inputFieldValue!: string;

    @Column({
        comment: 'Name of the output field after transformation.'
    })
    outputFieldName!: string;

    @Column({
        type: 'text',
        nullable: true,
        comment: 'Value of the output field after transformation.'
    })
    outputFieldValue!: string;

    @ManyToOne(() => RecordTransformation, transformation => transformation.fieldDetails, {onDelete: 'CASCADE'})
    transformation!: RecordTransformation;
}