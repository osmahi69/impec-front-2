import React, {useContext} from 'react';
import axios from 'axios';
import {RequestContext} from '../contexte/requestContext';

const API_URL = 'https://example.com/api';

const useEtablissementRequest = () => {
  const {axiosInstance} = useContext(RequestContext);

  const fetchEtablissementRadius = params => {
    return axiosInstance.post('/etablissements/radius', params);
  };

  const getDetailsEtablissementById = (id: int) => {
    return axiosInstance.get(`/etablissement/${id}`);
  };

  /**
   * Get services etablissement
   * @param id
   * @returns
   */
  const getServicesEtablissement = (params: {
    etablissement_id: number;
    skip: number;
    limit: number;
  }) => {
    return axiosInstance.post(`/service`, params);
  };

  return {
    fetchEtablissementRadius,
    getDetailsEtablissementById,
    getServicesEtablissement,
  };
};

export default useEtablissementRequest;
