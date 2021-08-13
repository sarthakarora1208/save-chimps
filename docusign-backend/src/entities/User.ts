import { RevisionRequest } from "./RevisionRequest";
import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  BeforeInsert,
} from "typeorm";
import {
  IsEmail,
  IsNotEmpty,
  Length,
  isNotEmpty,
  isJWT,
} from "class-validator";
import * as bcrypt from "bcryptjs";
import { Audit } from "./Audit";
import { SignedDocument } from "./SignedDocument";
export enum USER_ROLE {
  ARCGIS_USER_ROLE,
  STAKHOLDER_ROLE,
}
@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false, unique: true })
  @IsEmail()
  email!: string;

  @Column({ select: false, nullable: false })
  @Length(4, 100)
  password!: string;

  @Column({ type: "enum", enum: USER_ROLE, default: USER_ROLE.STAKHOLDER_ROLE })
  role!: USER_ROLE;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Audit, (audit) => audit.startedBy)
  startedAudits: Audit[];

  @ManyToMany(() => Audit, (audit) => audit.auditors)
  audits: Audit[];

  @ManyToMany(() => Audit, (audit) => audit.approvedAuditors)
  approvedAudits: Audit[];

  //@ManyToMany(() => Audit, (audit) => audit.auditors)
  //invitedAudits: Audit[];
  @OneToMany(
    () => RevisionRequest,
    (revisionRequest) => revisionRequest.requestedBy
  )
  revisionRequests: RevisionRequest[];

  @OneToMany(() => SignedDocument, (signedDocument) => signedDocument.audit)
  signedDocuments: SignedDocument[];

  @BeforeInsert()
  async beforeInsert() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  async matchPassword(enteredPassword: string) {
    console.log(this.password);
    console.log(enteredPassword);
    return await bcrypt.compare(enteredPassword, this.password);
  }

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }
  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
