/**
 * Hook for uploading files
 */
//import {REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET, BASE_URL} from '@env';
import axios from 'axios';
import PropTypes from 'prop-types';
import {Platform} from 'react-native';
import PK from '../../app.json';

const API_URL = PK.API_URL;

const useUpload = () => {
  const apiVersion = 'v1';
  const group = 'restricted/';
  /**
   * Promise
   * @param {{w:400,h:400}} cropp
   * @param {imagerUri} path
   * @param {(percent) => {}} handleUploadProgress
   * @returns
   */
  const uploadImage = async (img, typeDoc) => {
    const {fileName, uri: path, type} = img || {};

    const URI = `${API_URL}/document/add/${typeDoc}`;
    const cleanUri = path.replace('file://', '');
    const pathFile = Platform.OS == 'ios' ? cleanUri : path;

    const formdata = new FormData();
    formdata.append('fichier', {
      uri: pathFile,
      name: fileName,
      type: type,
    });

    // console.log(' *** avatar ***', formdata);
    try {
      return axios.post(URI, formdata, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      console.log('err', error);
      //provenant d'icloud
    }
  };

  uploadImage.propTypes = {
    cropp: PropTypes.object,
    path: PropTypes.string,
    isCropped: PropTypes.bool,
    handleUploadProgress: PropTypes.func,
  };

  return {
    uploadImage,
  };
};

export default useUpload;
