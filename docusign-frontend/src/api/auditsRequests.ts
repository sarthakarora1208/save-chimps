import API from './api';
import { AUDITS } from '../constants/routes';

export async function getAuditById(id: string) {
  try {
    const res = await API.get(`${AUDITS}/${id}`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function getOngoingAudits(userId: string) {
  try {
    const res = await API.get(`${AUDITS}/${userId}/ongoing`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function getFinishedAudits(userId: string) {
  try {
    const res = await API.get(`${AUDITS}/${userId}/finished`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function createAudit(name: string, userId: string) {
  try {
    const res = await API.post(`${AUDITS}`, { name, userId });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function updateAudit(
  id: string,
  finalMapUrl: string,
  finalFileUrl: string
) {
  try {
    const res = await API.put(`${AUDITS}/${id}`, { finalFileUrl, finalMapUrl });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteAudit(id: string) {
  try {
    const res = await API.delete(`${AUDITS}/${id}`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function addStakeholdersToAudit(id: string, userIds: string[]) {
  try {
    const res = await API.put(`${AUDITS}/${id}/add-stakeholders`, { userIds });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
export async function approveAudit(id: string, userId: string) {
  try {
    const res = await API.post(`${AUDITS}/approve`, { auditId: id, userId });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
export async function signAudit(
  auditId: string,
  userId: string,
  accessToken: string
) {
  try {
    const res = await API.post(`${AUDITS}/sign-document`, {
      auditId,
      userId,
      accessToken,
    });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
export async function finishAudit(id: string, finalMapUrl: string) {
  try {
    const res = await API.post(`${AUDITS}/finish`, { id, finalMapUrl });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
