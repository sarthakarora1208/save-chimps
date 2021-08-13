import { STAKEHOLDER_DASHBOARD } from './../constants/routes';
import { RevisionRequest } from './../constants/models/revisionRequest';
import store, { AppThunk } from '../app/store';
import { History } from 'history';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setErrorMsg, setSuccessMsg } from './alertSlice';
import * as REQUESTS from '../api/revisionRequestsRequests';

export interface revisionRequestState {
  loading: boolean;
  error: string | null;
  auditId: string;
  revisionRequest: RevisionRequest | null;
  revisionRequests: RevisionRequest[];
  isSketchOnMapModalOpen: boolean;
  addedAttachment: boolean;
  imageBinary: string;
  s3URL: string;
  attachmentURL: string;
}
export const initialRevisionRequestState: revisionRequestState = {
  loading: false,
  error: null,
  auditId: '',
  revisionRequest: null,
  revisionRequests: [],
  isSketchOnMapModalOpen: false,
  addedAttachment: false,
  imageBinary: '',
  s3URL: '',
  attachmentURL: '',
};

const revisionRequestSlice = createSlice({
  name: 'revisionRequest',
  initialState: initialRevisionRequestState,
  reducers: {
    revisionRequestStart(state) {
      state.loading = true;
      state.error = null;
    },
    setAuditId(state, action: PayloadAction<string>) {
      state.auditId = action.payload;
    },
    setRevisionRequest(state, action: PayloadAction<RevisionRequest | null>) {
      state.revisionRequest = action.payload;
    },
    setRevisionRequests(
      state,
      action: PayloadAction<{ data: RevisionRequest[] }>
    ) {
      const { data } = action.payload;
      state.revisionRequests = data.map((revisionRequest) => revisionRequest);
    },
    setIsSketchOnMapModalOpen(state, action: PayloadAction<boolean>) {
      state.isSketchOnMapModalOpen = action.payload;
    },
    setAddedAttachment(state, action: PayloadAction<boolean>) {
      state.addedAttachment = action.payload;
    },
    setImageBinary(state, action: PayloadAction<string>) {
      state.imageBinary = action.payload;
    },
    setS3URL(state, action: PayloadAction<string>) {
      state.s3URL = action.payload;
    },
    setAttachmentURL(state, action: PayloadAction<string>) {
      state.attachmentURL = action.payload;
    },
    revisionRequestFailure(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload ? action.payload : 'some error';
    },
    revisionRequestComplete(state) {
      state.loading = false;
    },
  },
});

export const {
  revisionRequestStart,
  setAuditId,
  setRevisionRequest,
  setRevisionRequests,
  setIsSketchOnMapModalOpen,
  setAddedAttachment,
  setImageBinary,
  setS3URL,
  setAttachmentURL,
  revisionRequestFailure,
  revisionRequestComplete,
} = revisionRequestSlice.actions;

export default revisionRequestSlice.reducer;

export const getRevisionRequestById =
  (revisionRequestId: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(revisionRequestStart());
      const revisionRequest = await REQUESTS.getRevisionRequestById(
        revisionRequestId
      );
      dispatch(setRevisionRequest(revisionRequest));
      dispatch(revisionRequestComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(revisionRequestFailure);
        dispatch(setErrorMsg(data));
      }
    }
  };

export const getRevisionRequestsForStakeholder =
  (): AppThunk => async (dispatch) => {
    try {
      dispatch(revisionRequestStart());
      let userId = store.getState().auth.user
        ? store.getState().auth.user!.id
        : '';
      const data = await REQUESTS.getRevisionRequestsForStakeholder(userId);
      dispatch(setRevisionRequests({ data }));
      dispatch(revisionRequestComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(revisionRequestFailure);
        dispatch(setErrorMsg(data));
      }
    }
  };

export const createRevisionRequest =
  (comments: string, history: History): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(revisionRequestStart());
      let userId = store.getState().auth.user
        ? store.getState().auth.user!.id
        : '';
      let auditId = store.getState().audit.audit
        ? store.getState().audit.audit!.id
        : '0';
      let { attachmentURL, s3URL } = store.getState().revisionRequest;
      const data = await REQUESTS.createRevisionRequest(
        userId,
        auditId,
        comments,
        attachmentURL,
        s3URL
      );
      dispatch(setRevisionRequest(data));
      dispatch(setSuccessMsg('Your changes have been requested'));
      history.push(STAKEHOLDER_DASHBOARD);
      dispatch(revisionRequestComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(revisionRequestFailure);
        dispatch(setErrorMsg(data));
      }
    }
  };

export const updateRevisionRequest =
  (
    id: string,
    comments: string,
    attachment: string,
    editedMapURL: string
  ): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(revisionRequestStart());
      const data = await REQUESTS.updateRevisionRequest(
        id,
        comments,
        attachment,
        editedMapURL
      );
      dispatch(setRevisionRequest(data));
      dispatch(setSuccessMsg('Revision Request updated!'));
      dispatch(revisionRequestComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(revisionRequestFailure);
        dispatch(setErrorMsg(data));
      }
    }
  };

export const deleteRevisionRequest =
  (id: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(revisionRequestStart());
      await REQUESTS.deleteRevisionRequest(id);
      setRevisionRequest(null);
      dispatch(revisionRequestComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(revisionRequestFailure);
        dispatch(setErrorMsg(data));
      }
    }
  };
export const resolveRevisionRequest = (): AppThunk => async (dispatch) => {
  try {
    dispatch(revisionRequestStart());
    let auditId = store.getState().audit.audit
      ? store.getState().audit.audit!.id
      : '0';
    let revisionRequestId = store.getState().revisionRequest.revisionRequest
      ? store.getState().revisionRequest.revisionRequest!.id
      : '0';

    const data = await REQUESTS.resolveRevisionRequest(
      auditId,
      revisionRequestId
    );
    setRevisionRequest(data);
    dispatch(revisionRequestComplete());
  } catch (error: any) {
    if (error.response) {
      const { data, status } = error.response;
      dispatch(revisionRequestFailure);
      dispatch(setErrorMsg(data));
    }
  }
};

export const addMapImageToS3 = (): AppThunk => async (dispatch) => {
  try {
    dispatch(revisionRequestStart());
    const { imageBinary } = store.getState().revisionRequest;
    if (imageBinary !== '') {
      const data = await REQUESTS.addMapImageToS3(imageBinary);
      dispatch(setS3URL(data));
      //dispatch(setImageBinary(''));
    }
    dispatch(revisionRequestComplete());
  } catch (error: any) {
    if (error.response) {
      const { data, status } = error.response;
      dispatch(revisionRequestFailure);
      dispatch(setErrorMsg(data));
    }
  }
};
export const addAttachmentToS3 = (): AppThunk => async (dispatch) => {
  try {
    dispatch(revisionRequestStart());
    const { addedAttachment } = store.getState().revisionRequest;
    const { imageBinary } = store.getState().revisionRequest;
    if (imageBinary !== '' && addedAttachment) {
      const data = await REQUESTS.addAttachmentToS3(imageBinary);
      dispatch(setAttachmentURL(data));
    }
    dispatch(revisionRequestComplete());
  } catch (error: any) {
    if (error.response) {
      const { data, status } = error.response;
      dispatch(revisionRequestFailure);
      dispatch(setErrorMsg(data));
    }
  }
};
