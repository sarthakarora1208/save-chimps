import { AUTH, DS } from '../constants/routes';
import API from './api';
export async function DSLogin() {
  try {
    const res = await API.get(`${DS}/login`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
export async function login(email: string, password: string) {
  try {
    const res = await API.post(`${AUTH}/login`, { email, password });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function register(name: string, email: string, password: string) {
  try {
    const res = await API.post(`${AUTH}/register`, { name, email, password });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
export async function getMe() {
  try {
    const res = await API.get(`${AUTH}/me`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function logout() {
  try {
    const res = await API.post(`${DS}/logout`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
