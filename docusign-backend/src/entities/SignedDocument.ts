import { RevisionRequest } from "./RevisionRequest";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from "typeorm";
import { Audit } from "./Audit";
import { User } from "./User";

@Entity()
export class SignedDocument {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ default: "no-url" })
  envelopeId: string;

  @ManyToOne(() => Audit, (audit) => audit.signedDocuments)
  audit: Audit;

  @ManyToOne(() => User, (user) => user.signedDocuments)
  user: User;
}
