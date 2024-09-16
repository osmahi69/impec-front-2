import axios from 'axios';
import PK from '../../app.json';

const API_URL = PK.API_URL;

export const acceptCourse = (params: object) => {
  return axios.post(`${API_URL}/courses/accept`, params);
};

export const refuseCourse = (params: object) => {
  return axios.post(`${API_URL}/courses/refus`, params);
};

export const terminerCourse = (params: object) => {
  return axios.post(`${API_URL}/courses/terminer`, params);
};
