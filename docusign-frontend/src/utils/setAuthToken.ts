import axios from 'axios';

const setAuthToken = async (token: string | null) => {
  if (token) {
    // Apply to every request
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
    //console.log(axios.defaults.headers.common['Authorization']);
  } else {
    // Delete auth header
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

export default setAuthToken;
