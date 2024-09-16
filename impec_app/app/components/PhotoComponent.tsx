import React, {FC, ReactElement} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../theme/colors';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import Icon from 'react-native-ionicons';
import {theme} from '../theme/theme';
import usePickerImage from '../hook/usePickerImage';
import useUpload from '../hook/useUploadFile';
import PK from '../../app.json';

const API_URL = __DEV__ ? PK.API_URL_DEV : PK.API_URL_DEV;

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  title?: string;
  imagePath: (value: any) => void;
};
const PhotoComponent: FC<ChildProps> = ({
  title = ' Ajouter votre logo',
  imagePath,
}): ReactElement => {
  const {pickerOptions} = usePickerImage();
  const [uploading, setUploading] = React.useState(null);
  const [pathImage, setPathImage] = React.useState('');
  const [photoToAdd, setPhotosToAdd] = React.useState(null);
  const [loadingphoto, setLoadingPhoto] = React.useState(false);
  const {uploadImage} = useUpload();

  const upload = () => {};

  const handleSelectPhoto = () => {
    const imageSelected = image => {
      const {fileName, uri} = image?.assets?.[0] || {};

      uploadImage({
        fileName,
        uri,
      })
        .then(response => {
          const {success, file} = response?.data;
          if (success) {
            setPathImage(API_URL + file?.url);
            imagePath(file?.url);
          }
        })
        .catch(error => {
          console.log(' *** error upload ***', error);
        });
      /*  setUploading(true);
      setPathImage({
        uri: image,
        width: 157,
        height: 158,
      }); */
    };
    const uploadPercentProgress = percent => {
      if (percent == 100) {
        setUploading(false);
      }
    };
    const isComplete = state => {
      if (state) {
        setLoadingPhoto(true);
        setTimeout(() => {
          setLoadingPhoto(false);
        }, 500);
      }
    };
    const uploadSuccess = (file, success) => {
      file.isNew = true;
      if (success) {
        setPhotosToAdd(file);
        // if (photos) {
        //   setPhotos([...photos, file]);
        setUploading(false);
        // }
      }
    };

    const uploadError = error => {
      setUploading(false);
      console.log('error', error);
    };

    const cancelCamera = cancelled => {
      if (cancelled) {
        setUploading(false);
      }
    };

    pickerOptions(
      imageSelected,
      uploadPercentProgress,
      isComplete,
      uploadSuccess,
      uploadError,
      cancelCamera,
      {w: 400, h: 400},
      0,
    );
  };
  return (
    <View style={{alignItems: 'center'}}>
      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: colors.avatarPlaceholder,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {pathImage && (
          <Image
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
            }}
            source={{uri: pathImage}}
          />
        )}
        <View
          style={{
            position: 'absolute',
            backgroundColor: 'rgba(0, 0, 0,0.2)',
            width: 90,
            height: 90,
            borderRadius: 45,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            onPress={() => handleSelectPhoto()}
            name="camera"
            color={colors.white}
          />
        </View>
      </View>
      <Text
        style={{fontSize: 12, fontFamily: theme.fonts.regular, marginTop: 8}}>
        {title}
      </Text>
    </View>
  );
};

PhotoComponent.propTypes = {};
PhotoComponent.defaultProps = {};
export default PhotoComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
