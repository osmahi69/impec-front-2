import React from 'react';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {BottomSheetAction} from '../components/bottomSheet';
import {useApi} from './useApi';
import useUpload from './useUploadFile';
import {PermissionsAndroid, Platform, Permission} from 'react-native';
import {PERMISSIONS, request} from 'react-native-permissions';

// Types
type ImagePickerResult = {
  didCancel: boolean;
  assets: Array<{
    fileName: string;
    uri: string;
  }>;
};

type ImageSelectedCallback = (images: ImagePickerResult) => void;
type AvatarSelectedCallback = (uri: string) => void;
type CancelCameraCallback = (didCancel: boolean) => void;

type PickerOptionsProps = {
  imageSelected: ImageSelectedCallback;
  setUploadProgress: (progress: number) => void;
  isComplete: (completed: boolean) => void;
  successUpload: (response: any) => void;
  errorUpload: (error: any) => void;
  cancelCamera: CancelCameraCallback;
  cropp?: {
    width: number;
    height: number;
  };
  selectionLimit?: number;
};

const usePickerImage = () => {
  const {uploadImage} = useUpload();
  const {API} = useApi();

  const [uploadDone, setUploadDone] = React.useState(false);

  const pickerOptions = ({
    imageSelected,
    setUploadProgress,
    isComplete,
    successUpload,
    errorUpload,
    cancelCamera,
    cropp = null,
    selectionLimit = 1,
  }: PickerOptionsProps) => {
    const bottomSheetOptions = [
      {
        title: 'Choisir une image',
        callback: () => {
          launchImageLibrary(
            {quality: 0.2, mediaType: 'photo', selectionLimit: selectionLimit},
            (images: ImagePickerResult) => {
              if (images.didCancel) {
                cancelCamera(images.didCancel);
              } else {
                imageSelected?.(images);
              }
            },
          );
        },
      },
      {
        title: 'Prendre une photo',
        callback: async () => {
          const takePhoto = () => {
            launchCamera(
              {quality: 0.2, mediaType: 'photo'},
              (image: ImagePickerResult) => {
                const {fileName, uri} = image.assets?.[0] || {};
                imageSelected?.(image);
                if (image.didCancel) {
                  cancelCamera(image.didCancel);
                }
              },
            );
          };
          if (Platform.OS === 'android') {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                  title: 'App Camera Permission',
                  message: 'App needs access to your camera',
                  buttonNeutral: 'Ask Me Later',
                  buttonNegative: 'Cancel',
                  buttonPositive: 'OK',
                },
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                takePhoto();
              } else {
                console.log('Camera permission denied');
              }
            } catch (err) {
              console.warn(err);
            }
          } else {
            request(PERMISSIONS.IOS.CAMERA).then(result => {
              if (result === 'granted') {
                takePhoto();
              }
            });
          }
        },
      },
    ];
    return BottomSheetAction(bottomSheetOptions);
  };

  return {
    pickerOptions,
  };
};

export default usePickerImage;
