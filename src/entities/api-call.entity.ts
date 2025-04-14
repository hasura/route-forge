// api-call.entity.ts
import {Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn} from "typeorm";
import {RecordTransformation} from "./record-transformation.entity";
import {BaseEntity} from "./base-entity";
import {v4 as uuidv4} from 'uuid';

@Entity({
    name: "api_calls",
    schema: BaseEntity.getSchema()
})
export class ApiCall {
    @PrimaryColumn("uuid")
    id: string = uuidv4();

    @Column()
    method!: string;

    @Column()
    path!: string;

    @Column({type: "jsonb", nullable: true})
    queryParams!: Record<string, unknown>;

    @Column({type: "jsonb", nullable: true})
    requestHeaders!: Record<string, unknown>;

    @CreateDateColumn({type: 'timestamp with time zone'})
    calledAt!: Date;

    @OneToMany(() => RecordTransformation, rt => rt.apiCall)
    recordTransformations!: RecordTransformation[];
}
