import store, { AppThunk } from '../app/store';
import { History } from 'history';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import isEmpty from '../utils/isEmpty';
import { setErrorMsg, setInfoMsg, setSuccessMsg } from './alertSlice';
import * as REQUESTS from '../api/authRequests';
import { User, USER_ROLE } from '../constants/models/user';
import { getUserByEmail, getUserById } from '../api/userRequests';
import setAuthToken from '../utils/setAuthToken';
import {
  ARCGIS_USER_DASHBOARD,
  LOGIN,
  STAKEHOLDER_DASHBOARD,
} from '../constants/routes';

export interface authState {
  loading: boolean;
  error: string | null;
  user: User | null;
  isAuthenticated: boolean;
  userId: string;
  accessToken: string;
}
let user1: User = {
  id: '4788d6ff-0fad-4c83-a9e4-222cfbd9b0a3',
  name: 'Stakholder',
  email: 'thesarthakarora@gmail.com',
  role: 1,
};
let user2: User = {
  id: '4788d6ff-0fad-4c83-a9e4-222cfbd9b0e2',
  name: 'Sarthak  Arora',
  email: 'sarthakarora1208@gmail.com',
  role: 0,
};

export const initialState: authState = {
  loading: false,
  error: null,
  user: null,
  isAuthenticated: false,
  userId: '',
  accessToken: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setUserId(state, action: PayloadAction<string>) {
      state.userId = action.payload;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },
    authFailure(state, action: PayloadAction<string | null>) {
      state.loading = false;
      state.error = action.payload ? action.payload : 'some error';
    },
    authComplete(state) {
      state.loading = false;
    },
  },
});

export const {
  authStart,
  setIsAuthenticated,
  setUserId,
  setUser,
  setAccessToken,
  authFailure,
  authComplete,
} = authSlice.actions;

export default authSlice.reducer;
export const getUser =
  (id: string): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(authStart());
      const data = await getUserById(id);
      dispatch(setUser(data));
      dispatch(setIsAuthenticated(true));
      dispatch(authComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(authFailure(data));
        dispatch(setErrorMsg(data));
      }
    }
  };
export const getUserByEmailAddress =
  (email: string | null): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(authStart());
      if (email) {
        const data = await getUserByEmail(email);
        dispatch(setUser(data));
        dispatch(setSuccessMsg(`You have signed the document!`));
      }
      dispatch(authComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(authFailure(data));
        dispatch(setErrorMsg(data));
      }
    }
  };

export const DSLogin = (): AppThunk => async (dispatch) => {
  try {
    dispatch(authStart());
    const data = await REQUESTS.DSLogin();
    dispatch(setAccessToken(data));
    dispatch(authComplete());
  } catch (error: any) {
    if (error.response) {
      const { data, status } = error.response;
      dispatch(authFailure(data));
      dispatch(setErrorMsg(data));
    }
  }
};
export const login =
  (email: string, password: string, history: History): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(authStart());
      const data = await REQUESTS.login(email, password);
      //await setAuthToken(token);
      //const data = await REQUESTS.getMe();
      dispatch(setUser(data));
      dispatch(setIsAuthenticated(true));
      let { user } = store.getState().auth;
      if (store.getState().auth.isAuthenticated) {
        if (user && user.role === USER_ROLE.ARCGIS_USER_ROLE) {
          history.push(ARCGIS_USER_DASHBOARD);
        } else {
          history.push(STAKEHOLDER_DASHBOARD);
        }
      }
      dispatch(authComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(authFailure(data));
        dispatch(setErrorMsg(data));
      }
    }
  };

export const register =
  (name: string, email: string, password: string, history: History): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(authStart());
      const data = await REQUESTS.register(name, email, password);
      dispatch(setSuccessMsg('Registered'));
      history.push(LOGIN);
      dispatch(authComplete());
    } catch (error: any) {
      if (error.response) {
        const { data, status } = error.response;
        dispatch(authFailure(data));
        dispatch(setErrorMsg(data));
      }
    }
  };
export const logout =
  (history: History): AppThunk =>
  async (dispatch) => {
    try {
      dispatch(authStart());
      dispatch(setUser(null));
      dispatch(setIsAuthenticated(false));
      dispatch(setInfoMsg('Logged Out!'));
      history.push(LOGIN);
      dispatch(authComplete());
    } catch (err: any) {
      dispatch(authFailure(err.message));
    }
  };
