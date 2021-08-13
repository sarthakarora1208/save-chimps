import { Audit } from './audit';
import { User } from './user';

export interface signedDocument {
  id: string;
  audit: Audit;
  envelopeId: string;
  user: User;
}
