export const HOME = '/';
export const USER = '/user';
export const DS = '/ds';
export const AUTH = '/auth';
export const ARCGIS_USER = '/arcgis-user';
export const STAKEHOLDER = '/stakeholder';
export const AUDITS = '/audits';
export const SIGNED_DOCUMENT = '/signed-document';

export const REVISION_REQUESTS = '/revision-requests';
export const DASHBOARD = '/dashboard';

//ids
const AUDIT_ID = ':auditId';
const REVISION_REQUEST_ID = ':revisionRequestId';

export const LOGIN = `${AUTH}/login`;
export const REGISTER = `${AUTH}/register`;
export const LOGOUT = `${AUTH}/logout`;

export const reviewAudit = (auditId = AUDIT_ID) => {
  return `${AUDITS}/${auditId}/review-audit`;
};

export const addRevisionRequest = (auditId = AUDIT_ID) => {
  return `${REVISION_REQUESTS}/${auditId}/start`;
};

export const STAKEHOLDER_DASHBOARD = `${STAKEHOLDER}${DASHBOARD}`;
export const AUDIT_INVITATIONS = `${STAKEHOLDER}/audit-invitations`;
export const MY_REVISION_REQUESTS = `${STAKEHOLDER}${REVISION_REQUESTS}`;
export const COMPLETED_AUDITS_STAKEHOLDER = `${STAKEHOLDER}/completed-audits`;
export const FINISH_SIGNING_DOCUMENT = `${STAKEHOLDER}/finished-signing`;

export const ARCGIS_USER_DASHBOARD = `${ARCGIS_USER}${DASHBOARD}`;

export const START_AUDIT = `${AUDITS}/start-audit`;
export const ONGOING_AUDITS = `${ARCGIS_USER}/ongoing-audits`;
export const FINISHED_AUDITS = `${ARCGIS_USER}/finished-audits`;
export const viewAudit = (auditId = AUDIT_ID) => {
  return `${AUDITS}/${auditId}/view`;
};

export const viewFinalAudit = (auditId = AUDIT_ID) => {
  return `${AUDITS}/${auditId}/final`;
};

export const viewRevisionRequest = (
  revisionRequestId = REVISION_REQUEST_ID
) => {
  return `${REVISION_REQUESTS}/${revisionRequestId}/view`;
};
