/* AUTH API */
import axios from 'axios';
import PK from '../../app.json';
import Config from 'react-native-config';

const API_URL = PK.API_URL;

const apiVersion = 'v1/';
const group = 'app';

export const getAuthorization = async () => {
  const formData = new FormData();
  formData.append('grant_type', 'client_credentials');
  formData.append('client_id', 'ggj8nEGk3Q4YVrTbHtaxYpYwwr4sgdkc5anUSYFf');
  formData.append(
    'client_secret',
    '4S6gneJtTWz2HRNMXa6gtT9hyq9wYAPtkrQrvUXBEP3BhGmmTnRNFLcnBmcWwuEZdj96bm',
  );

  return fetch(API_URL + '/authorization', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body: formData,
  }).then(response => response.json());
};

/**
 * Login user
 * @param {*} params
 */
export const signIn = (params: object) => {
  return axios.post(`${API_URL}/users/sso`, params);
};

/**
 * forgot user password
 * @param {*} params
 */
export const forgotPassword = (params: object) => {
  return axios.post(`${API_URL}/users/oublie`, params);
};

/**
 * Add enseign
 * @param {*} params
 */
export const addEtablissement = params => {
  return axios.post(API_URL + '/etablissements', params);
};

/**
 * Get infos user to connect
 */
export const readUserWithToken = (jwtToken: string) => {
  return axios.get(API_URL + '/auth/users', {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  });
};

/**
 * Get infos user to connect
 */
export const readUser = () => {
  return axios.get(API_URL + '/auth/users');
};

/**
 * Subscribe user
 * @param {} params
 */
export const signUp = (params: object) => {
  return axios.post(`${API_URL}/users/inscription`, params);
};

export const editUser = (params: object) => {
  return axios.post(`${API_URL}/users/update`, params);
};

export const contactUs = (params: object) => {
  return axios.post(`${API_URL}/contact`, params);
};

export const updateStatusAvailable = async (params: object) => {
  try {
    const result = await axios.post(`${API_URL}/users/savestatus`, params);
    return result?.data;
  } catch (error) {
     return error;
  }
};


export const myProfile = async (params: object) => {
  try {
    const result = await axios.post(`${API_URL}/users/myprofile`, params);
    return result?.data;
  } catch (error) {
     return error;
  }
};
