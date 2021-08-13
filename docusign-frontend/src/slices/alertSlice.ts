
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface alertState {
  successMsg: string | null;
  errorMsg: string | null;
  infoMsg: string | null;
  errorStatus: string | null;
}

export const initialState: alertState = {
  successMsg: null,
  errorMsg: null,
  infoMsg: null,
  errorStatus: null,
};

const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    resetAlert(state) {
      state.successMsg = null;
      state.errorMsg = null;
      state.infoMsg = null;
      state.errorStatus = null;
    },
    setSuccessMsg(state, action: PayloadAction<string>) {
      state.successMsg = action.payload;
    },
    setErrorMsg(state, action: PayloadAction<string>) {
      state.errorMsg = action.payload;
    },
    setErrorStatus(state, action: PayloadAction<string>) {
      state.errorStatus = action.payload;
    },
    setInfoMsg(state, action: PayloadAction<string>) {
      state.infoMsg = action.payload;
    },
  },
});

export const {
  resetAlert,
  setSuccessMsg,
  setInfoMsg,
  setErrorMsg,
} = alertSlice.actions;

export default alertSlice.reducer;