import { RevisionRequest } from './revisionRequest';
import { User } from './user';
export enum AUDIT_STATE {
  STARTED,
  UNDER_REVIEW,
  FINISHED,
}

export interface Audit {
  id: string;
  name: string;
  endDate: Date;
  approvedBy: number;
  state: AUDIT_STATE;
  finalMapUrl: string;
  finalFileUrl: string;
  createdAt: Date;
  updatedAt: Date;
  startedBy: User;
  auditors: User[];
  approvedAuditors: User[];
  revisionRequests: RevisionRequest[];
}
