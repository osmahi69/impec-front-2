import React, {createContext, ReactNode, useEffect} from 'react';
import axios from 'axios';
import PK from '../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const API_URL = __DEV__ ? PK.API_URL_DEV : PK.API_URL_DEV;
const RequestContext = createContext();

const RequestContextProvider = async ({children}: {children: ReactNode}) => {
  /**
   * New instantce Axios
   */
  const axiosInstance = axios.create({
    baseURL: API_URL,
  });

  /**
   * Configure common headers
   */
  const initHeader = async () => {
    const jwtToken = await AsyncStorage.getItem('userToken');
    const accessToken = await AsyncStorage.getItem('accessToken');

    if (accessToken) {
      confifHeaders(accessToken, jwtToken);
    } else {
      axiosInstance.defaults.headers.common['Authorization'] = null;
    }
  };
  const confifHeaders = (
    accessToken: string | null,
    jwtToken: string | null,
  ) => {
    axiosInstance.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${accessToken}`;

    if (jwtToken)
      axiosInstance.defaults.headers.common['jwtToken'] = `Bearer ${jwtToken}`;
  };

  useEffect(() => {
    //initHeader();
  }, []);

  const Interceptor = axiosInstance.interceptors.response.use(
    response => response,
    async error => {
      console.error('Error request status', error.response.status);
      console.error('Error request data', error.response.data);
      const refreshToken = await AsyncStorage.getItem('refreshToken');

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

      /* if (
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
      } */

      /**
       * Get authorization 401
       */
      if (
        error &&
        error.response &&
        refreshToken &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        return axios
          .get(axiosInstance + '/refresh', {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          })
          .then(async res => {
            if (res.data.success) {
              var accessToken = res.data.access_token;
              await AsyncStorage.setItem('userToken', accessToken);
              confifHeaders(accessToken, null);

              originalRequest.headers[
                'Authorization'
              ] = `Bearer ${accessToken}`;

              return axios(originalRequest);
            }
          })
          .catch(error => {
            console.error(error);
          });
      }

      if (error.response.status === 401) {
        // Rediriger vers la page de connexion
      } else if (error.response.status === 403) {
        // Afficher un message d'erreur "Accès refusé"
      }
      return Promise.reject(error);
    },
  );

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

  return (
    <RequestContext.Provider value={axiosInstance}>
      {children}
    </RequestContext.Provider>
  );
};

export {RequestContext, RequestContextProvider};
