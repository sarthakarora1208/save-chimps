import API from './api';
import { SIGNED_DOCUMENT } from '../constants/routes';

export async function getSignedDocumentsForUser(userId: string) {
  try {
    const res = await API.get(`${SIGNED_DOCUMENT}/${userId}/user`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
export async function getSignedDocumentsForAudit(auditId: string) {
  try {
    const res = await API.get(`${SIGNED_DOCUMENT}/${auditId}/audits`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
