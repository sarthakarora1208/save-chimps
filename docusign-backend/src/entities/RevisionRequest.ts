import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";

export enum REVISION_REQUEST_STATE {
  OPEN,
  RESOLVED,
}
@Entity()
export class RevisionRequest {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: "" })
  comments!: string;

  @Column()
  attachment: string;

  @Column({ default: "no-url" })
  editedMapURL!: string;

  @Column({
    type: "timestamp with time zone",
    default: () => "CURRENT_TIMESTAMP",
  })
  resolvedAt: string;

  @Column({
    type: "enum",
    enum: REVISION_REQUEST_STATE,
    default: REVISION_REQUEST_STATE.OPEN,
  })
  state: REVISION_REQUEST_STATE;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.revisionRequests)
  requestedBy: User;

  @ManyToOne(() => Audit, (audit) => audit.revisionRequests)
  audit: Audit;
}
