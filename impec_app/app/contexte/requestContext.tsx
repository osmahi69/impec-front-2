import React, {createContext, ReactNode, useEffect, useState} from 'react';
import axios, {AxiosInstance} from 'axios';
import PK from '../../app.json';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const API_URL = __DEV__ ? PK.API_URL_DEV : PK.API_URL_DEV;

interface RequestContextValue {
  axiosInstance: AxiosInstance;
}

/**
 * New instantce Axios
 */
const axiosInstance = axios.create({
  baseURL: API_URL,
});

export const RequestContext = createContext<RequestContextValue>({
  axiosInstance: axiosInstance,
});

const RequestContextProvider: React.FC = ({
  children,
}: {
  children: ReactNode;
}) => {
  /**
   * Configure common headers
   */
  const initHeader = async () => {
    const jwtToken = await AsyncStorage.getItem('userToken');
    const accessToken = await AsyncStorage.getItem('accessToken');
    if (accessToken) {
      axiosInstance.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${accessToken}`;

      if (jwtToken)
        axiosInstance.defaults.headers.common[
          'jwtToken'
        ] = `Bearer ${jwtToken}`;
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
    initHeader();
  }, []);

  const handleInterceptor = axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      const originalRequest = error.config;
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (error?.response?.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;

        console.error('Error request status', error.response.status);
        console.error('Error request data', error.response.data);

        return axiosInstance
          .post('/refresh', {
            token: refreshToken,
          })
          .then(res => {
            const {access_token, refresh_token} = res.data;
            confifHeaders(access_token, null);
            //re init
            originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
            //originalRequest.headers['jwtToken'] = `Bearer ${jwtToken}`;
            originalRequest._retry = false;
            return axiosInstance(originalRequest);
          });
      }
    },
  );

  const ReqcontextValue: RequestContextValue = {
    axiosInstance: axiosInstance,
  };

  return (
    <RequestContext.Provider value={ReqcontextValue}>
      {children}
    </RequestContext.Provider>
  );
};

export default RequestContextProvider;
