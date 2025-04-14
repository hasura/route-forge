import {BaseEntity} from "./base-entity";
import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";
import {ApiLineageEntity} from "./api-lineage.entity";
import {FieldLineageEntity} from "./field-lineage.entity";

@Entity({name: 'record_lineage', schema: BaseEntity.getSchema()})
export class RecordLineageEntity extends BaseEntity {

    @PrimaryColumn()
    recordLineageId!: string; // e.g., `${apiLineageId}_${recordTransformerName}`

    @Column()
    inputType!: string;

    @Column()
    outputType!: string;

    @Column({type: 'text', nullable: true})
    description?: string;

    @Column({type: 'text', nullable: true})
    inputDescription?: string;

    @Column({type: 'text', nullable: true})
    outputDescription?: string;

    @Column({nullable: true})
    pkNames?: string;

    @ManyToOne(() => ApiLineageEntity, api => api.records, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'apiLineageId'})
    apiLineage!: ApiLineageEntity | null;

    @OneToMany(() => FieldLineageEntity, field => field.recordLineage, {cascade: true})
    fields!: FieldLineageEntity[];
}
