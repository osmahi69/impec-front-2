import axios from 'axios';
import PK from '../../app.json';
import Config from 'react-native-config';

const API_URL = PK.API_URL;

/**
 * calculate
 *  * @param {*} params
 */
export const calculDistanceDelais = (params: object) => {
  return axios.post(`${API_URL}/metrix`, params);
};

/**
 *
 *  * @param {*} params
 */
export const totnotifs = (params: object) => {
  return axios.get(`${API_URL}/courses/chauffeurTotNotifCourses`, params);
};

/**
 * calculate
 *  * @param {*} params
 */
export const homerBanner = (params: object) => {
  return axios.post(`${API_URL}/gethomebanner`, params);
};

/**
 *
 *  * @param {*} params
 */
export const savePosition = (params: object) => {
  return axios.get(`${API_URL}/users/savepoz`, params);
};

/**
 *
 *  * @param {*} params
 */
export const addRetardCourse = (params: object) => {
  return axios.post(`${API_URL}/courses/retard`, params);
};

/**
 *
 *  * @param {*} params
 */
export const saveDevice = (params: object) => {
  return axios.post(`${API_URL}/users/savedevice`, params);
};

/**
 *
 *  * @param {*} params
 */
export const getTaxiList = (params: object) => {
  return axios.post(`${API_URL}/users/taxis`, params);
};

/**
 *
 *  * @param {*} params
 */
export const fetchDiscussion = (params: object) => {
  let dataBody = {user: params?.user};
  //if (params?.dicussionID != null) {
  dataBody.discussion = params?.dicussionID;
  dataBody.lastdate = params?.lastdate;
  dataBody.lastID = params?.lastId;

  /*    } */

  var url =
    params?.dicussionID != null
      ? `${API_URL}/chat/more`
      : `${API_URL}/chat/list`;

  return axios.post(url, dataBody);
};

export const fetchMessageDiscussion = (params: object) => {
  return axios.post(`${API_URL}/chat/message/list`, {
    discussionId: params?.discussionId,
  });
};

/**
 *
 *  * @param {*} params
 */
export const sendMessage = (params: object) => {
  return axios.post(`${API_URL}/chat/send`, params);
};

export const texte = (params: object) => {
  return axios.post(`${API_URL}/textes`, params);
};

export const checkPaymentStatus = async (params: any) => {
  try {
    const res = await axios.post(`${API_URL}/users/account_status`, params);
    return res;
  } catch (error) {
    return error;
  }
};

export const createPaymentSession = async (params: any) => {
  try {
    const res = await axios.post(`${API_URL}/payment/create_session`, params);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const unsubscribe = async (params: any) => {
  try {
    const res = await axios.post(`${API_URL}/payment/unsubscribe`, params);
    return res?.data;
  } catch (error) {
    return error;
  }
};

export const getVersion = async (params: any | undefined) => {
  try {
    const res = await axios.get(`${API_URL}/config/getVersion`, params);
    return res?.data;
  } catch (error) {
    return error;
  }
};
