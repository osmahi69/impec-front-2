import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
//import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useForm} from 'react-hook-form';
//import {Auth} from 'aws-amplify';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CustomButton from '../../components/customButton/CustomButton';
import FormInput from '../../components/customInput/FormInput';

const SignUp = () => {
  const {height} = useWindowDimensions();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();

  const Auth = null;

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  const onSignInPressed = async data => {
    if (loading) {
      return;
    }

    setLoading(true);
    navigation.navigate('Home');

    setLoading(false);
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate('ForgotPassword');
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 30, paddingLeft: 20}}>
          <Text style={{fontSize: 26, fontWeight: '800'}}>Inscription</Text>
        </View>
        <View style={styles.root}>
          <FormInput
            name="pseudo"
            placeholder="Pseudo"
            control={control}
            rules={{required: 'Username is required'}}
          />

          <FormInput
            name="email"
            placeholder="email"
            control={control}
            rules={{required: 'Username is required'}}
          />

          <FormInput
            name="password"
            placeholder="Mot de passe"
            secureTextEntry
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 3,
                message: 'Password should be minimum 3 characters long',
              },
            }}
          />

          <FormInput
            name="password"
            placeholder="Confirmation du mot de passe"
            secureTextEntry
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 3,
                message: 'Password should be minimum 3 characters long',
              },
            }}
          />

          <CustomButton
            text={loading ? 'Loading...' : 'Se connecter'}
            onPress={handleSubmit(onSignInPressed)}
          />

          <CustomButton
            text="Forgot password?"
            onPress={onForgotPasswordPressed}
            type="TERTIARY"
          />

          {/*   <SocialSignInButtons /> */}

          <CustomButton
            text="Don't have an account? Create one"
            onPress={onSignUpPress}
            type="TERTIARY"
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
});

export default SignUp;
