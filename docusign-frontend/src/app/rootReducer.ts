import { combineReducers } from '@reduxjs/toolkit';
import alertReducer from '../slices/alertSlice';
import authReducer from '../slices/authSlice';
import auditReducer from '../slices/auditSlice';
import revisionRequestReducer from '../slices/revisionRequestSlice';

const rootReducer = combineReducers({
  alert: alertReducer,
  auth: authReducer,
  audit: auditReducer,
  revisionRequest: revisionRequestReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
