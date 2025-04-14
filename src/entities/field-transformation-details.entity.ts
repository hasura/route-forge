import {Column, Entity, ManyToOne, PrimaryColumn} from "typeorm";
import {RecordTransformation} from "./record-transformation.entity";
import {BaseEntity} from "./base-entity";
import {v4 as uuidv4} from 'uuid';

@Entity({name: "field_transformation_details", schema: BaseEntity.getSchema()})
export class FieldTransformationDetail {
    @PrimaryColumn("uuid")
    id: string = uuidv4();

    @Column()
    transformDescription!: string

    @Column()
    inputFieldName!: string;

    @Column({type: 'text', nullable: true})
    inputFieldValue!: string;

    @Column()
    outputFieldName!: string;

    @Column({type: 'text', nullable: true})
    outputFieldValue!: string;

    @ManyToOne(() => RecordTransformation, transformation => transformation.fieldDetails, {onDelete: 'CASCADE'})
    transformation!: RecordTransformation;
}
