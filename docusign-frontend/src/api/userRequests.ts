import { USER } from '../constants/routes';
import API from './api';

export async function getUserById(id: string) {
  try {
    const res = await API.get(`${USER}/${id}`);
    return res.data.data;
  } catch (err) {
    throw err;
  }
}

export async function getUserByEmail(email: string) {
  try {
    const res = await API.post(`${USER}/get-user-from-email`, { email });
    return res.data.data;
  } catch (err) {
    throw err;
  }
}
