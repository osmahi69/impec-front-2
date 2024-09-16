import React from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
// import {REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET, BASE_URL} from '@env';
import {
  getAuthorization,
  signIn,
  signUp,
  readUser,
  addEtablissement,
  readUserWithToken,
  editUser,
  contactUs,
  updateStatusAvailable
} from '../services/authAPI';

import * as toolsApi from '../services/toolsAPI';

import {getEtablissementRadius} from '../services/serviceAPI';
import PK from '../../app.json';
import DeviceInfo from 'react-native-device-info';
import {Platform} from 'react-native';
import * as agendCourses from '../services/AgendaAPI';
import {acceptCourse, refuseCourse} from '../services/courseAPI';

const API_URL = __DEV__ ? PK.API_URL_DEV : PK.API_URL_DEV;

const baseUrl = API_URL;

function getDeviceInfo() {
  const platform = Platform.OS === 'ios' ? 'iOS' : 'Android';
  const device = DeviceInfo.getModel(); // Remplacez cette fonction par d'autres fonctions de DeviceInfo pour obtenir les détails spécifiques du périphérique.
  return {
    platforme: platform,
    device: device,
  };
}

export const useApi = () => {
  const initConfig = async () => {
    const u = await AsyncStorage.getItem('userInfos');
    const userInfos = JSON.parse(u);

    const jwtToken = userInfos?.token;
    const accessToken = await AsyncStorage.getItem('accessToken');
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const deviceInfo = getDeviceInfo();

    //expired token
    /*token =
     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZha2VAZW1haWwuZnIiLCJleHAiOjE2MDk4MzQxODAsImlkIjoiZmFrZV9pZCIsIm5hbWUiOiJGYWtlIFVzZXIiLCJyb2xlIjoidXNlciJ9.Ao0NqHDK1k6LdZ7475-Ait6dcg_hdzVJsrVca5ltl4w';*/
    if (jwtToken) {
      axios.defaults.headers.common['platforme'] = deviceInfo.platforme;
      axios.defaults.headers.common['device'] = deviceInfo.device;
      axios.defaults.headers.common['Authorization'] = `Bearer ${jwtToken}`;
    } else {
      axios.defaults.headers.common['Authorization'] = null;
    }

    /*  if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    } else {
      axios.defaults.headers.common['Authorization'] = null;
    } */

    axios.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        console.error('Error request status', error.response.status);
        console.error('Error request data', error.response.data);

        const originalRequest = error.config;
        if (isTokenExpired(refreshToken)) {
          try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('refreshToken');
            await AsyncStorage.removeItem('user');
          } catch (e) {
            console.log(e);
          }
          // disconet user here
          return;
        }

        //check authorization
        if (
          error &&
          error.response &&
          error.response.status === 403 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          return getAuthorization().then(async res => {
            const {access_token} = res;
            if (access_token) {
              await AsyncStorage.setItem('accessToken', access_token);

              originalRequest.headers[
                'Authorization'
              ] = `Bearer ${access_token}`;
              console.log('ORIGINAL REQUEST', originalRequest);
              axios.defaults.headers.common[
                'Authorization'
              ] = `Bearer ${access_token}`;
              return axios(originalRequest);
            }
          });
        }
        if (
          error &&
          error.response &&
          refreshToken &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          return axios
            .get(baseUrl + '/refresh', {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            })
            .then(async res => {
              if (res.data.success) {
                var accessToken = res.data.access_token;
                await AsyncStorage.setItem('userToken', accessToken);
                axios.defaults.headers.common['Authorization'] = accessToken
                  ? `Bearer ${accessToken}`
                  : '';
                axios.defaults.headers.common['jwtToken'] = accessToken
                  ? `Bearer ${jwtToken}`
                  : '';
                originalRequest.headers[
                  'Authorization'
                ] = `Bearer ${accessToken}`;
                originalRequest.headers['jwtToken'] = `Bearer ${jwtToken}`;

                return axios(originalRequest);
              }
            })
            .catch(error => {
              console.error(error);
            });
        }
        return Promise.reject(error);
      },
    );
  };

  initConfig();

  //check token validity
  const isTokenExpired = token => {
    try {
      const decoded = jwt_decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  };

  // const addFcmToken = (params) => {
  //   url = baseUrl + '/restricted/' + apiVersion + '/user';
  //   return axios.put(url, params);
  // };

  return {
    API: {
      baseUrl,
      getAuthorization,
      signIn,
      signUp,
      readUser,
      editUser,
      addEtablissement,
      initConfig,
      readUserWithToken,
      getEtablissementRadius,
      acceptCourse,
      refuseCourse,
      contactUs,
      updateStatusAvailable,
      ...toolsApi,
      ...agendCourses
    },
  };
};
