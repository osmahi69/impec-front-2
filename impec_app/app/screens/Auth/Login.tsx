import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
  TextInput,
  Alert,
  SafeAreaView,
  Dimensions,
} from 'react-native';
//import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useForm, Controller} from 'react-hook-form';
//import {Auth} from 'aws-amplify';
import {useNavigation} from '@react-navigation/native';
import CustomButton from '../../components/customButton/CustomButton';
import FormInput from '../../components/customInput/FormInput';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useApi} from '../../hook/useApi';
import ButtonComponent from '../../components/customButton/ButtonComponent';
import {colors} from '../../theme/colors';
import {theme} from '../../theme/theme';
import ButtonTextComponent from '../../components/customButton/CustomButton';
import ButtonBase from '../../components/customButton/ButtonBase';
import Separator from '../../components/Separator';
import {useMutation} from 'react-query';
import {UserContext} from '../../contexte/authContext';
import {HeaderAuth} from '../../navigation/stacks/AuthStack';
import ModalComponent from '../../components/ModalComponent';

const SignInScreen = () => {
  const navigation = useNavigation();
  const {API} = useApi();
  const {login} = useContext(UserContext);
  const [messageModal, setMessageModal] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const signIn = async data => {
    let obj = {
      email: data?.email,
      password: data?.password,
    };

    if (__DEV__) {
      /*  obj = {
        email: 'robert@yopmail.com',
        password: 'Pass123;',
      }; */
      /* obj = {
        email: 'loictaxi@yopmail.com',
        password: 'Pass123;',
      }; */
    }

    try {
      const result = await API.signIn(obj);
      return result?.data;
    } catch (error) {
      console.log(' *** error authentification ***', error);
    }
  };

  const signInMutation = useMutation(signIn);
  const {isLoading, isError, isSuccess, data: dataUser} = signInMutation;

  const onSignInPressed = async data => {
    signInMutation.mutate(data);
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
    setMessageModal('');
    setTimeout(() => {
      login(dataUser?.data);
    }, 500);
  }, [dataUser]);

  useEffect(() => {
    if (dataUser?.data) {
      if (dataUser?.msg) {
        setMessageModal(dataUser?.msg);
        handleOpenModal();
      }
    }
  }, [dataUser]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}>
        {/*  <HeaderAuth title=" " disableBack={true} /> */}

        <View style={styles.root}>
          <Image
            style={{width: 180, height: 180}}
            source={require('../../assets/logo.png')}
          />
          <FormInput
            name="email"
            placeholder="Email"
            control={control}
            rules={{required: "L'adresse email est obligatoire"}}
            label={'Email'}
            labelStyle={{alignSelf: 'flex-start'}}
          />

          <FormInput
            name="password"
            placeholder="Mot de passe"
            secureTextEntry
            control={control}
            label={'Mot de passe'}
            labelStyle={{alignSelf: 'flex-start'}}
            rules={{
              required: 'Le mot de passe est obligatoire',
              minLength: {
                value: 3,
                message: 'Password should be minimum 3 characters long',
              },
            }}
          />

          <ButtonTextComponent
            title="Mot de passe oublié ?"
            container={{flex: 1, alignSelf: 'flex-end', marginTop: 5}}
            onPress={() => navigation.navigate('ForgotPassword')}
            textStyle={{fontSize: 12, textDecorationLine: 'underline'}}
          />
          <View style={{marginTop: 20, width: '100%'}}>
            <ButtonTextComponent
              title="Je créer mon compte"
              container={{flex: 1, alignSelf: 'center', marginTop: 5}}
              onPress={() => navigation.navigate('SignUp')}
              textStyle={{}}
            />
            <ButtonComponent
              onPress={handleSubmit(onSignInPressed)}
              container={{
                backgroundColor: colors.blue,
                borderRadius: 10,
                padding: 8,
                height: 48,
                marginTop: 10,
                //alignSelf: 'stretch',
              }}
              //content={{marginTop: 20}}
              loading={signInMutation.isLoading}
              title="Se connecter"
              textStyle={{
                color: colors.white,
                fontFamily: theme.fonts.semiBold,
                fontWeight: '700',
                textAlign: 'center',
              }}
            />
          </View>
        </View>
      </ScrollView>
      <ModalComponent
        isOpen={isOpen}
        onRequestClose={handleCloseModal}
        buttonText={"J'ai compris"}>
        <Text style={{fontSize: 16, fontWeight: '600'}}>Informations</Text>
        <Text
          style={{
            marginTop: 10,
            color: '#000000',
          }}>
          {messageModal}
        </Text>
      </ModalComponent>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  root: {
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: '70%',
    maxWidth: 300,
    maxHeight: 200,
  },
});

export default SignInScreen;
