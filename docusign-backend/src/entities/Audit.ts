import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  JoinTable,
} from "typeorm";
import { RevisionRequest } from "./RevisionRequest";
import { SignedDocument } from "./SignedDocument";
import { User } from "./User";

export enum AUDIT_STATE {
  STARTED,
  UNDER_REVIEW,
  FINISHED,
}
@Entity()
export class Audit {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name!: string;

  @Column({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  endDate: string;

  @Column({ default: 0 })
  approvedBy: number;

  @Column({ type: "enum", enum: AUDIT_STATE, default: AUDIT_STATE.STARTED })
  state!: AUDIT_STATE;

  @Column({ default: "no-url" })
  finalMapUrl!: string;

  @Column({ default: "no-url" })
  finalFileUrl!: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => User, (user) => user.audits)
  @JoinTable()
  auditors: User[];

  @ManyToMany(() => User, (user) => user.approvedAudits)
  @JoinTable()
  approvedAuditors: User[];

  @ManyToOne(() => User, (user) => user.startedAudits)
  startedBy: User;

  @OneToMany(() => RevisionRequest, (revisionRequest) => revisionRequest.audit)
  revisionRequests: RevisionRequest[];

  @OneToMany(() => SignedDocument, (signedDocument) => signedDocument.audit)
  signedDocuments: SignedDocument[];
}
