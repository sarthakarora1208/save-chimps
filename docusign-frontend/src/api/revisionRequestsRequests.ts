import { AUDITS, REVISION_REQUESTS } from './../constants/routes';
import API from './api';

export async function getRevisionRequestById(id: string) {
  try {
    const res = await API.get(`${REVISION_REQUESTS}/${id}`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
export async function getRevisionRequestsForStakeholder(userId: string) {
  try {
    const res = await API.get(`${REVISION_REQUESTS}/${userId}/stakeholder`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function createRevisionRequest(
  userId: string,
  auditId: string,
  comments: string,
  attachmentURL: string,
  s3URL: string
) {
  try {
    const res = await API.post(`${REVISION_REQUESTS}`, {
      comments,
      attachment: attachmentURL,
      editedMapURL: s3URL,
      userId,
      auditId,
    });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function updateRevisionRequest(
  id: string,
  comments: string,
  attachment: string,
  editedMapURL: string
) {
  try {
    const res = await API.put(`${REVISION_REQUESTS}/${id}`, {
      comments,
      attachment,
      editedMapURL,
    });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function deleteRevisionRequest(id: string) {
  try {
    const res = await API.delete(`${REVISION_REQUESTS}/${id}`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
export async function resolveRevisionRequest(
  auditId: string,
  revisionRequestId: string
) {
  try {
    const res = await API.post(`${REVISION_REQUESTS}/resolve`, {
      auditId,
      revisionRequestId,
    });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function addMapImageToS3(imageBinary: string) {
  try {
    const res = await API.post(`${REVISION_REQUESTS}/add-image`, {
      imageBinary,
    });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
export async function addAttachmentToS3(imageBinary: string) {
  try {
    const res = await API.post(`${REVISION_REQUESTS}/add-attachment`, {
      imageBinary,
    });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
