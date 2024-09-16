import axios from 'axios';
import PK from '../../app.json';

const API_URL = PK.API_URL;

/**
 * add course
 *  * @param {*} params
 */
export const addCourse = (params: object) => {
  return axios.post(`${API_URL}/courses/add/`, params);
};

/**
 * add course agenda
 */
export const addCourseAgenda = (params: object) => {
  return axios.post(`${API_URL}/agenda/add`, params);
};

/**
 * edit course
 *  * @param {*} params
 */
export const editCourse = (params: object) => {
  return axios.post(`${API_URL}/courses/edit/`, params);
};

export const getCourseAgenda = (params: object) => {
  return axios.post(`${API_URL}/courses/list`, params);
};

export const getCourseById = async (params: any) => {
  try {
    const res = await axios.post(`${API_URL}/courses/get`, params);
    return res;
  } catch (error) {
    return error;
  }
};

export const deleteEventAgenda = async (params: {course: string}) => {
  try {
    const res = await axios.post(`${API_URL}/agenda/delevent`, params);
    return res;
  } catch (error) {
    return error;
  }
};

/**
 * get course agenda month
 * @param params
 * @returns
 */
export const getCourseAgendaCurrentMonth = async (params: object) => {
  try {
    const result = await axios.post(`${API_URL}/agenda/monthevts`, params);
    return result.data;
  } catch (e) {
    return e;
  }
};

export const getCourseByDaySelected = async (params: object) => {
  try {
    const result = await axios.post(`${API_URL}/agenda/myevents`, params);
    return result.data;
  } catch (e) {
    return e;
  }
};

/**
 * get course agenda month
 * @param params
 * @returns
 */
export const getCourseAgendaToday = async () => {
  try {
    const result = await axios.post(`${API_URL}/agenda/today`);
    return result.data;
  } catch (e) {
    return e;
  }
};

export const deleteCourse = (params: object) => {
  return axios.post(`${API_URL}/courses/delete`, params);
};
