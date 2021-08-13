import { signedDocument } from './../constants/models/signedDocument';
import _ from 'lodash';
import { ARCGIS_USER_DASHBOARD } from './../constants/routes';
import { Audit } from './../constants/models/audit';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserByEmail } from '../api/userRequests';
import { History } from 'history';
import { setErrorMsg, setSuccessMsg } from './alertSlice';
import { User } from '../constants/models/user';
import * as REQUESTS from '../api/auditsRequests';
import store, { AppThunk } from '../app/store';
import { addMapImageToS3 } from '../api/revisionRequestsRequests';
import {
  getSignedDocumentsForAudit,
  getSignedDocumentsForUser,
} from '../api/signedDocumentRequests';

export interface auditState {
  step: number;
  loading: boolean;
  error: string | null;
  audit: Audit | null;
  audits: Audit[];
  finishedAudits: Audit[];
  auditors: User[];
  isApproveMapModalOpen: boolean;
  isRequestChangesMapModalOpen: boolean;
  isFinishAuditModalOpen: boolean;
  signedDocuments: signedDocument[];
}

export const initialAuditState: auditState = {
  step: 0,
  loading: false,
  error: null,
  audit: null,
  audits: [],
  finishedAudits: [],
  auditors: [],
  isApproveMapModalOpen: false,
  isRequestChangesMapModalOpen: false,
  isFinishAuditModalOpen: false,
  signedDocuments: [],
};
const auditSlice = createSlice({
  name: 'audit',
  initialState: initialAuditState,
  reducers: {
    auditStart(state) {
      state.loading = true;
      state.error = null;
    },
    setAudit(state, action: PayloadAction<Audit | null>) {
      state.audit = action.payload;
    },
    setAudits(state, action: PayloadAction<{ data: Audit[] }>) {
      const { data } = action.payload;
      state.audits = data.map((audit) => audit);
    },
    setFinishedAudits(state, action: PayloadAction<{ data: Audit[] }>) {
      const { data } = action.payload;
      state.finishedAudits = data.map((audit) => audit);
    },
    addAuditors(state, action: PayloadAction<User>) {
      if (!_.some(state.auditors, { email: action.payload.email })) {
        state.auditors = [...state.auditors, action.payload];
      }
    },
    removeAuditor(state, action: PayloadAction<User>) {
      const index = state.auditors.findIndex((user) => {
        return user.email === action.payload.email;
      });
      let updatedArray = state.auditors;
      if (index !== -1) {
        updatedArray.splice(index, 1);
      }
      state.auditors = [...updatedArray];
    },
    incrementStep(state) {
      state.step += 1;
    },
    setIsApproveMapModalOpen(state, action: PayloadAction<boolean>) {
      state.isApproveMapModalOpen = action.payload;
    },
    setIsRequestChangesMapModalOpen(state, action: PayloadAction<boolean>) {
      state.isRequestChangesMapModalOpen = action.payload;
    },
    setIsFinishAuditModalOpen(state, action: PayloadAction<boolean>) {
      state.isFinishAuditModalOpen = action.payload;
    },
    setSignedDocuments(
      state,
      action: PayloadAction<{ data: signedDocument[] }>
    ) {
      const { data } = action.payload;
      state.signedDocuments = data.map((signedDocument) => signedDocument);
    },
    auditFailure(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload ? action.payload : 'some error';
    },
    auditComplete(state) {
      state.loading = false;
    },
  },
});

export const {
  auditStart,
  setAudit,
  setAudits,
  setFinishedAudits,
  addAuditors,
  removeAuditor,
  incrementStep,
  setIsApproveMapModalOpen,
  setIsRequestChangesMapModalOpen,
  setIsFinishAuditModalOpen,
  setSignedDocuments,
  auditFailure,
  auditComplete,
} = auditSlice.actions;

export default auditSlice.reducer;

export const getAuditById =
  (auditId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(auditStart());
      const audit = await REQUESTS.getAuditById(auditId);
      dispatch(setAudit(audit));
      dispatch(auditComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(auditFailure(data));
        dispatch(setErrorMsg(data));
      }
    }
  };

export const getOngoingAudits = (): AppThunk => async (dispatch) => {
  try {
    dispatch(auditStart());
    let userId = store.getState().auth.user
      ? store.getState().auth.user!.id
      : '';
    const data = await REQUESTS.getOngoingAudits(userId);
    dispatch(setAudits({ data }));
    dispatch(auditComplete());
  } catch (error: any) {
    if (error.response) {
      const { data, status } = error.response;
      dispatch(auditFailure(data));
      dispatch(setErrorMsg(data));
    }
  }
};

export const getFinishedAudits = (): AppThunk => async (dispatch) => {
  try {
    dispatch(auditStart());
    let userId = store.getState().auth.user
      ? store.getState().auth.user!.id
      : '';
    const data = await REQUESTS.getFinishedAudits(userId);
    dispatch(setFinishedAudits({ data }));
    dispatch(auditComplete());
  } catch (error: any) {
    if (error.response) {
      const { data, status } = error.response;
      dispatch(auditFailure(data));
      dispatch(setErrorMsg(data));
    }
  }
};

export const createAudit =
  (name: string, history: History): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(auditStart());
      let userId = store.getState().auth.user
        ? store.getState().auth.user!.id
        : '';
      const data = await REQUESTS.createAudit(name, userId);
      dispatch(setAudit(data));
      dispatch(setSuccessMsg('Audit started!'));
      dispatch(auditComplete());
      dispatch(incrementStep());
      //history.push(ADD_STAKEHOLDERS);
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(auditFailure(data));
        dispatch(setErrorMsg(data));
      }
    }
  };

export const deleteAudit =
  (id: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(auditStart());
      await REQUESTS.deleteAudit(id);
      setAudit(null);
      dispatch(auditComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(auditFailure(data));
        dispatch(setErrorMsg(data));
      }
    }
  };
export const addStakeholdersToAudit =
  (history: History): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(auditStart());
      const { id } = store.getState().audit.audit!;
      const { auditors } = store.getState().audit;

      const userIds = auditors!.map((auditor) => auditor.id!);
      const data = await REQUESTS.addStakeholdersToAudit(id, userIds);
      dispatch(setAudit(data));
      dispatch(setSuccessMsg('Added stakeholders'));
      dispatch(auditComplete());
      history.push(ARCGIS_USER_DASHBOARD);
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(auditFailure(data));
        dispatch(setErrorMsg(data));
      }
    }
  };

export const approveAudit =
  (id: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(auditStart());
      let userId = store.getState().auth.user
        ? store.getState().auth.user!.id
        : '';

      const data = await REQUESTS.approveAudit(id, userId);
      dispatch(setAudit(data));
      dispatch(auditComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(auditFailure(data));
        dispatch(setErrorMsg(data));
      }
    }
  };

export const signAudit =
  (auditId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(auditStart());
      let userId = store.getState().auth.user
        ? store.getState().auth.user!.id
        : '';
      let accessToken = store.getState().auth.accessToken;
      const data = await REQUESTS.signAudit(auditId, userId, accessToken);
      window.location.href = data.url;
      dispatch(auditComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(auditFailure(data));
        dispatch(setErrorMsg(data));
      }
    }
  };
export const getSignedDocumentsUser = (): AppThunk => async (dispatch) => {
  try {
    dispatch(auditStart());
    let userId = store.getState().auth.user
      ? store.getState().auth.user!.id
      : '';
    const data = await getSignedDocumentsForUser(userId);
    dispatch(setSignedDocuments({ data }));
    dispatch(auditComplete());
  } catch (error: any) {
    if (error.response) {
      const { data, status } = error.response;
      dispatch(auditFailure(data));
      dispatch(setErrorMsg(data));
    }
  }
};

export const getSignedDocumentsAudit =
  (auditId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(auditStart());
      const data = await getSignedDocumentsForAudit(auditId);
      dispatch(setSignedDocuments({ data }));
      dispatch(auditComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(auditFailure(data));
        dispatch(setErrorMsg(data));
      }
    }
  };
export const finishAudit =
  (id: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(auditStart());
      const { imageBinary } = store.getState().revisionRequest;
      let finalMapURL = 'no-url';
      if (imageBinary !== '') {
        finalMapURL = await addMapImageToS3(imageBinary);
      }
      console.log(finalMapURL);

      const data = await REQUESTS.finishAudit(id, finalMapURL);
      dispatch(setAudit(data));
      dispatch(auditComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(auditFailure(data));
        dispatch(setErrorMsg(data));
      }
    }
  };

export const getUserFromEmail =
  (email: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(auditStart());
      const data = await getUserByEmail(email);
      dispatch(addAuditors(data));
      dispatch(auditComplete());
    } catch (error: any) {
      if (error.response) {
        console.log(error);
        const { data } = error.response;
        dispatch(auditFailure(data));
        dispatch(setErrorMsg(data.error));
      }
    }
  };
