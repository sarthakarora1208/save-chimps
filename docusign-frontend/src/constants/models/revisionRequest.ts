import { Audit } from './audit';
import { User } from './user';

export enum REVISION_REQUEST_STATE {
  OPEN,
  RESOLVED,
}

export interface RevisionRequest {
  id: string;
  comments: string;
  attachment: string;
  editedMapURL: string;
  resolvedAt: Date;
  state: REVISION_REQUEST_STATE;
  createdAt: Date;
  updatedAt: Date;
  requestedBy: User;
  audit: Audit;
}
