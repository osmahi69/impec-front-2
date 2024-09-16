import React, {useState} from 'react';
import {TouchableOpacity, View, Text} from 'react-native';
import Icon from 'react-native-ionicons';
import {colors} from '../../theme/colors';
import useUpload from '../../hook/useUploadFile';
import usePickerImage from '../../hook/usePickerImage';

interface ButtonDocType {
  docs: Array<{
    path: string;
    typeDoc: string;
  }>;
  title: string;
  docType: string;
  myDocs: any;
  setMyDocs: any;
}

const ButtonAddDoc = ({
  docs,
  title,
  myDocs,
  setMyDocs,
  docType,
}: ButtonDocType) => {
  const {pickerOptions} = usePickerImage();
  const [isLoadUpload, setIsLoadUpload] = useState(false);
  const {uploadImage} = useUpload();
  const [uploading, setUploading] = useState(false);

  const handleSelectPhoto = (docType: string) => {
    const imageSelected = image => {
      const doc = image?.assets?.[0] || {};

      setIsLoadUpload(true);
      uploadImage(doc, docType)
        .then(response => {
          const {success, msg, fichier} = response?.data;
          if (msg === 'Document uploadé avec succès') {
            const existingDocIndex = myDocs.findIndex(
              doc => doc.typeDoc === docType,
            );
            if (existingDocIndex !== -1) {
              const updatedDocs = [...myDocs];
              updatedDocs[existingDocIndex] = {
                path: doc?.path,
                public_file: fichier,
                typeDoc: docType,
              };
              setMyDocs(updatedDocs);
            } else {
              setMyDocs([
                ...myDocs,
                {
                  path: doc?.path,
                  public_file: fichier,
                  typeDoc: docType,
                },
              ]);
            }
          }
        })
        .catch(error => {
          console.log(' *** error upload ***', error);
        })
        .finally(() => {
          setIsLoadUpload(false);
        });
    };

    const uploadPercentProgress = (progress: number) => {
      if (progress == 100) {
        setUploading(false);
      }
    };
    const isComplete = state => {
      if (state) {
      }
    };
    const uploadSuccess = (file, success) => {
      file.isNew = true;
      if (success) {
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

    pickerOptions({
      imageSelected,
      uploadPercentProgress,
      isComplete,
      uploadSuccess,
      uploadError,
      cancelCamera,
      cropp: {w: 400, h: 400},
      selectionLimit: 0,
    });
  };

  return (
    <TouchableOpacity
      onPress={() => handleSelectPhoto(docType)}
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
      }}>
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
        <View
          style={{
            backgroundColor: myDocs?.find(doc => doc?.typeDoc == docType)
              ?.typeDoc
              ? colors.blue
              : 'rgba(0, 0, 0,0.2)',
            width: 45,
            height: 45,
            borderRadius: 45,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={
              myDocs?.find(doc => doc?.typeDoc == docType)?.typeDoc
                ? 'checkmark'
                : 'document'
            }
            color={colors.white}
          />
        </View>
        <Text style={{marginLeft: 10, textDecorationLine: 'underline'}}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ButtonAddDoc;
