import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
//import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useForm} from 'react-hook-form';
//import {Auth} from 'aws-amplify';
import {useNavigation} from '@react-navigation/native';
import {Radio} from 'native-base';
import {ActivityIndicator} from 'react-native';
import Icon from 'react-native-ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useMutation} from 'react-query';
import PK from '../../../app.json';
import Separator from '../../components/Separator';
import ButtonComponent from '../../components/customButton/ButtonComponent';
import FormInput from '../../components/customInput/FormInput';
import {UserContext} from '../../contexte/authContext';
import {useApi} from '../../hook/useApi';
import usePickerImage from '../../hook/usePickerImage';
import useUpload from '../../hook/useUploadFile';
import {HeaderAuth} from '../../navigation/stacks/AuthStack';
import {colors} from '../../theme/colors';
import {theme} from '../../theme/theme';

const API_URL = __DEV__ ? PK.API_URL_DEV : PK.API_URL_DEV;

type FormInputs = {
  siret: string;
  society: string;
  firstname: string;
  lastname: string;
  phone: string;
  mobilephone: string;
  address: string;
  email: string;
  password: string;
  password_confirm: string;
  zipcode: string;
  commune: string;
  cpam: string;
  security_number: string;
  stationnement: string;
  isTaxiVSL?: boolean;
  isAmbulance?: boolean;
  ars?: string;
};

const SignIn = () => {
  const {height} = useWindowDimensions();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const [myDocs, setMyDocs] = useState<
    Array<{
      path: string;
      typeDoc: string;
      public_file: string;
    }>
  >([]);
  const [bearerToken, setBearerToken] = useState(null);
  const [user, setUser] = useState(null);
  const [titleButton, setTitleButton] = useState(null);
  const {pickerOptions} = usePickerImage();
  const {API} = useApi();

  const [uploading, setUploading] = React.useState(null);
  const [loadingphoto, setLoadingPhoto] = React.useState(false);
  const [isLoadUpload, setIsLoadUpload] = useState(false);
  const [taxiType, setTaxiType] = useState<string | null>(null);
  const {login} = useContext(UserContext);
  const {uploadImage} = useUpload();
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<FormInputs>();

  /*  useEffect(() => {
    reset({
      siret: 'dsmdlsdlmk',
      society: 'Taxi974',
      firstname: 'loic',
      lastname: 'sa',
      address: '8 rue joseph richard',
      email: 'loicsa@yopmail.com',
      password: 'Pass123;',
      password_confirm: 'Pass123;',
      zipcode: '97420',
      commune: 'saint pierre',
      cpam: '123456',
      mobilephone: '0692123456',
      phone: '0262458963',
      security_number: '123456789',
      stationnement: '987654321',
      ars: '5689222',
    });
  }, []); */

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
        setLoadingPhoto(true);
        setTimeout(() => {
          setLoadingPhoto(false);
        }, 500);
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

  const signUp = async (d: FormInputs) => {
    const doc_stationnement = myDocs.find(
      doc => doc.typeDoc === 'stationnement',
    )?.public_file;
    const doc_cartepro = myDocs.find(
      doc => doc.typeDoc === 'cartepro',
    )?.public_file;
    if (taxiType == null) {
      return Alert.alert(
        'Attention',
        'Vous devez choisir le type de transport',
      );
    }
    if (!doc_stationnement && !doc_cartepro) {
      return Alert.alert(
        'Attention',
        'Vous devez ajouter vos documents (carte pro et carte de stationnement)',
      );
    }
    const data = {
      siret: d.siret,
      societe: d.society,
      nom: d.lastname,
      prenom: d.firstname,
      tel_fix: d.phone,
      tel_mobile: d.mobilephone,
      email: d.email,
      password: d.password,
      adresse: d.address,
      commune_rattachement: d.commune,
      num_finess: d.cpam,
      num_autorisation_stationnement: d.stationnement,
      num_ars: d.ars,
      num_secu: d.security_number,
      istaxivsl: taxiType == 'taxi' ? String(true) : String(false),
      isambulance: taxiType == 'ambulance' ? String(true) : String(false),
      cartestationnement: doc_stationnement,
      cartepro: doc_cartepro,
    };

    try {
      const result = await API.signUp(data);
      return result?.data;
    } catch (error) {
      return error;
    }
  };

  const signUpMutation = useMutation(signUp);
  const {isLoading, isError, isSuccess, data: dataUser} = signUpMutation;

  useEffect(() => {
    if (dataUser?.response == true && dataUser?.data?.token) {
      login(dataUser?.data);
    } else if (dataUser?.response == false) {
      Alert.alert('Informations', dataUser?.msg);
    }
  }, [dataUser]);

  const onSignUpPressed = async data => {
    signUpMutation.mutate(data);
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  interface ButtonDocType {
    docs: Array<{
      path: string;
      typeDoc: string;
    }>;
    title: string;
    docType: string;
  }

  const ButtonDoc = ({docs, title, docType}: ButtonDocType) => {
    return (
      <TouchableOpacity
        onPress={() => handleSelectPhoto(docType)}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        }}>
        <View
          style={{
            backgroundColor: docs?.find(doc => doc?.typeDoc == docType)?.typeDoc
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
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <HeaderAuth title="Créer un compte" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
          <Image
            style={{width: 140, height: 140}}
            source={require('../../assets/logo.png')}
          />
          <Separator
            style={{
              backgroundColor: '#C6C6C640',
              marginVertical: 30,
            }}
          />
          <FormInput
            name="siret"
            placeholder="N° de siret"
            label="N° SIRET"
            control={control}
            rules={{required: 'siret obligatoire'}}
          />
          <View style={{alignSelf: 'flex-start', flexDirection: 'row'}}>
            <Radio.Group
              name="myRadioGroup"
              accessibilityLabel="favorite number"
              value={taxiType}
              onChange={nextValue => {
                setTaxiType(nextValue);
              }}>
              <Radio value="taxi" my={1}>
                Taxi & VSL
              </Radio>
              <Radio value="ambulance" my={1}>
                Ambulance
              </Radio>
            </Radio.Group>
          </View>
          <FormInput
            name="society"
            placeholder="Société"
            label="Société"
            control={control}
            rules={{required: 'société obligatoire'}}
          />
          <View style={{flexDirection: 'row'}}>
            <FormInput
              name="firstname"
              label="Prénom"
              placeholder="firstname"
              control={control}
              container={{marginRight: 8}}
              rules={{required: 'nom obligatoire'}}
            />
            <FormInput
              name="lastname"
              label="Nom"
              placeholder="lastname"
              control={control}
              rules={{required: 'prénom obligatoire'}}
              container={{marginLeft: 8}}
            />
          </View>

          {/* phone */}
          <FormInput
            placeholder="N° de téléphone fixe"
            label="N° de téléphone fixe"
            name="phone"
            control={control}
          />

          <FormInput
            placeholder="N° de téléphone"
            label="N° de téléphone"
            name="mobilephone"
            control={control}
            rules={{required: 'N° de tel obligatoire'}}
          />
          <FormInput
            name="address"
            placeholder="Adresse"
            label="Adresse"
            control={control}
            rules={{required: 'Adresse obligatoire'}}
          />
          {/*   <FormInputAddress
            name="address"
            placeholder="Adresse"
            label="Adresse"
            control={control}
            rules={{required: 'adresse obligatoire'}}
          /> */}
          <FormInput
            name="email"
            placeholder="Email"
            label="Email"
            control={control}
            rules={{required: 'email obligatoire'}}
          />
          <FormInput
            name="password"
            secureTextEntry
            placeholder="Mot de passe"
            control={control}
            rules={{
              required: 'mot de passse obligatoire',
              minLength: {
                value: 6,
                message: 'Le mot de passe doit contenir au moins 6 caractères',
              },
            }}
          />

          <FormInput
            name="password_confirm"
            placeholder="Confirmation du mot de passe"
            secureTextEntry
            control={control}
            rules={{
              required: 'mot de passse obligatoire',
              minLength: {
                value: 6,
                message: 'Le mot de passe doit contenir au moins 6 caractères',
              },
            }}
          />

          <View style={{flexDirection: 'row'}}>
            <FormInput
              name="zipcode"
              label="Code postale"
              placeholder="Code postale"
              control={control}
              container={{marginRight: 8}}
            />
            <FormInput
              placeholder="Commune de rattachement"
              label="Commune de rattachement"
              name="commune"
              placeholder="Commune de rattachement"
              control={control}
              rules={{required: 'commune obligatoire'}}
            />
          </View>

          <FormInput
            placeholder="Numéro d'agrément CPAM"
            label="Numéro d'agrément CPAM"
            name="cpam"
            placeholder=""
            control={control}
            rules={{required: 'cpam obligatoire'}}
          />

          <FormInput
            placeholder="Numéro ARS"
            label="Numéro ARS"
            name="ars"
            placeholder=""
            control={control}
            rules={{required: 'ars obligatoire'}}
          />

          <FormInput
            placeholder="Numéro de sécurité"
            label="Numéro de sécurité"
            name="security_number"
            placeholder="0123456789"
            control={control}
            rules={{required: 'n° de sécurité obligatoire'}}
          />
          <FormInput
            placeholder="N° d'autorisation de stationnement"
            label="N° d'autorisation de stationnement"
            name="stationnement"
            placeholder="0123456789"
            control={control}
          />
          <View style={{}}>
            <Text
              style={{fontSize: 14, fontWeight: 'bold', marginVertical: 20}}>
              Ajouter vos documents
            </Text>
          </View>
          {isLoadUpload && <ActivityIndicator style={{marginVertical: 10}} />}
          <ButtonDoc
            title={`Ajouter votre carte professionnel         `}
            docs={myDocs}
            docType="cartepro"
          />

          <ButtonDoc
            title={` Ajouter votre carte de stationnement`}
            docs={myDocs}
            docType="stationnement"
          />
        </View>

        <View
          style={{
            flex: 1,
            width: '90%',
            alignSelf: 'center',
          }}>
          <ButtonComponent
            onPress={handleSubmit(onSignUpPressed)}
            container={styles.submit}
            //content={{marginTop: 20}}
            //loading={signInMutation.isLoading}
            loading={loading}
            title="Continuer"
            textStyle={{
              color: colors.white,
              fontFamily: theme.fonts.semiBold,
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
  buttonRight: {
    height: 33,
    width: 33,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submit: {
    backgroundColor: colors.black,
    borderRadius: 10,
    padding: 8,
    height: 48,
    marginTop: 20,
    width: '100%',
    //alignSelf: 'stretch',
  },
});

export default SignIn;
