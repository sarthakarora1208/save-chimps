import { RevisionRequest } from './revisionRequest';
import { Audit } from './audit';
export enum USER_ROLE {
  ARCGIS_USER_ROLE,
  STAKHOLDER_ROLE,
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: USER_ROLE;
  createdAt?: Date;
  updatedAt?: Date;
  startedAudits?: Audit[];
  revisionRequests?: RevisionRequest[];
}
