// record-transformation.entity.ts (updated)
import {Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {FieldTransformationDetail} from "./field-transformation-details.entity";
import {ApiCall} from "./api-call.entity";
import {BaseEntity} from "./base-entity";
import {v4 as uuidv4} from 'uuid';

@Entity({name: "record_transformations", schema: BaseEntity.getSchema()})
export class RecordTransformation {
    @PrimaryColumn("uuid")
    id: string = uuidv4();

    @Column()
    inputType!: string;

    @Column()
    outputType!: string;

    @Column()
    description!: string;

    @Column()
    primaryKeyNames!: string;

    @Column()
    primaryKeyValues!: string;

    @CreateDateColumn({type: 'timestamp with time zone'})
    executedAt!: Date;

    @OneToMany(() => FieldTransformationDetail, detail => detail.transformation, {cascade: true})
    fieldDetails!: FieldTransformationDetail[];

    @ManyToOne(() => ApiCall, apiCall => apiCall.recordTransformations, {onDelete: 'SET NULL'})
    apiCall!: ApiCall;
}
