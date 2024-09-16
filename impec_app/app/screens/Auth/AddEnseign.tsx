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
  TouchableOpacity,
} from 'react-native';
//import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useForm, Controller} from 'react-hook-form';
//import {Auth} from 'aws-amplify';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import CustomButton from '../../components/customButton/CustomButton';
import FormInput from '../../components/customInput/FormInput';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import axios from 'axios';
import {colors} from '../../theme/colors';
import FormDatePicker from '../../components/customInput/FormDatePicker';
import ButtonComponent from '../../components/customButton/ButtonComponent';
import {theme} from '../../theme/theme';
import ButtonBase from '../../components/customButton/ButtonBase';
import ButtonCheck from '../../components/customButton/ButtonCheck';
import {HeaderAuth} from '../../navigation/stacks/AuthStack';
import Separator from '../../components/Separator';
import Icon from 'react-native-ionicons';
import PhotoComponent from '../../components/PhotoComponent';
import CoverComponent from '../../components/CoverComponent';
import FormInputAddress from '../../components/customInput/FormInputAddress';
import {addressAutocomplete} from '../../components/SearchAddress';
import {useApi} from '../../hook/useApi';
import {useMutation, useQuery} from 'react-query';
import {UserContext} from '../../contexte/authContext';

import PK from '../../../app.json';
const API_URL = __DEV__ ? PK.API_URL_DEV : PK.API_URL_DEV;

const STRIPE_SK_KEY =
  'sk_test_51LV8BVKaBUYC1lvmrMSPe3NaKrjw3mi67lDALFGVLK4HAXy8oo58jx5PWi9OOsYmL6Ya0T2dvjGWZSHU43uFZ9Vy00ZYZot8B5';

type FormInputs = {
  name: string;
  description: string;
  address: addressAutocomplete;
  city: string;
  lat: number;
  lng: number;
  banner: string;
  logo: string;
  phone: string;
  zipcode: string;
  schedules: object;
};

const AddEnseign = ({}) => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<ParamListBase>>();
  const {user, tokenSession} = route?.params || {};
  const {API} = useApi();
  const {login} = useContext(UserContext);
  const [imagePath, setImagePath] = useState(null);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm<FormInputs>();

  const readUser = async () => {
    try {
      const result = await API.readUserWithToken(tokenSession?.access_token);
      return result.data;
    } catch (error) {
      console.log(' *** error read user ***', error);
    }
  };

  const userQuery = useQuery('user', readUser);
  const {data: dataUser, isLoading: loadingUser} = userQuery;

  useEffect(() => {
    if (dataUser) {
      console.log(' *** datauser ***', dataUser);
      reset({
        name: 'Centre SPA',
        description: 'Centre de bien être à saint gilles',
        address: {
          address: '8 rue jean paul sartre',
        },
        city: 'saint pierre',
        lat: 0,
        lng: 0,
        phone: '0262625662',
        logo: 'https://www.google.com',
        banner: null,
        zipcode: '97410',
        schedules: [
          {
            lundi: [
              {morning: "{'08:00 - 12:00'}"},
              {afternoon: "{'08:00 - 15:00'}"},
            ],
            mardi: [
              {morning: "{'08:00 - 12:00'}"},
              {afternoon: "{'08:00 - 18:00'}"},
            ],
          },
        ],
        user_id: dataUser?.id,
      });
    }
  }, [dataUser]);

  useEffect(() => {
    handleMessageAlert();
    if (user && tokenSession) {
      taskAttributeStripeIdToAccount(user, tokenSession?.access_token);
    }
  }, [user, tokenSession]);

  const handleMessageAlert = () => {
    /*  Alert.alert(
      "Plus qu'une étape, ☝️",
      "Enregistrer les infos de votre institut pour qu'elle soit visible sur l'app pour vos futurs clients!",
    ); */
  };

  const getStripeIdUserByEmail = async (email: string) => {
    try {
      const result = await axios.get(
        'https://api.stripe.com/v1/search?query="' + email + '"&prefix=false',
        {
          headers: {
            Authorization: 'Bearer ' + STRIPE_SK_KEY,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );
      if (result.data) {
        const {data} = result.data || {};
        if (data.length > 0) {
          let account = data[0];
          return account.id;
        } else {
          console.log('No account found for this email');
        }
      }
    } catch (error) {
      console.log(' *** errpr ***', error);
    }
  };

  /**
   * Update stripe session user
   */
  const taskAttributeStripeIdToAccount = useCallback(
    async (user, bearerToken) => {
      //navigation.goBack();
      const stripe_id = await getStripeIdUserByEmail(user?.email);

      try {
        // update user with stripe_id after subscribe account stripe
        const result = await axios.put(
          `${API_URL}/user`,
          {...user, ...{stripe_id}},
          {
            headers: {
              Authorization: 'Bearer ' + bearerToken,
            },
          },
        );
        if (result.data) {
          console.log(
            ' *** result update user with stripe id ***',
            result.data,
          );
        }
      } catch (error) {
        console.log(' *** errpr ***', error);
      }
    },
    [],
  );

  const AddEnseign = async data => {
    try {
      const result = await API.addEtablissement(data);
      return result.data;
    } catch (error) {
      console.log(' *** error add enseign ***', error);
    }
  };
  const addEnseignMutation = useMutation(AddEnseign);
  const {isLoading, isError, isSuccess, data} = addEnseignMutation;

  const onSubmit = d => {
    d.logo = imagePath;
    d.address = d?.address?.address;

    return console.log(' ***  ***', JSON.stringify(d, null, 2));
    addEnseignMutation.mutate(d);
  };

  useEffect(() => {
    if (data && tokenSession) {
      login(tokenSession?.access_token);
    }
  }, [data]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeaderAuth title="Ajouter mon institut" />

        <View style={styles.root}>
          <PhotoComponent
            imagePath={img => {
              setImagePath(img);
            }}
          />
          <CoverComponent />
          <Separator
            style={{
              backgroundColor: '#C6C6C640',
              marginVertical: 30,
            }}
          />

          <FormInput
            name="name"
            label="Nom"
            placeholder="firstname"
            control={control}
            container={{marginRight: 8}}
          />

          <FormInput
            name="description"
            label="Description"
            placeholder="Description"
            control={control}
            rules={{required: 'Username is required'}}
            container={{height: 124, justifyContent: 'flex-start'}}
          />

          <FormInput
            placeholder="N° de téléphone"
            label="N° de téléphone"
            name="phone"
            placeholder="phone"
            control={control}
          />

          <FormInputAddress
            name="address"
            placeholder="Adresse"
            label="Adresse"
            control={control}
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
              name="city"
              label="Ville"
              placeholder="Ville"
              control={control}
              rules={{required: 'Username is required'}}
              container={{marginLeft: 8}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
              marginBottom: 40,
            }}>
            {/*   <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsPro(!isPro)}
              style={{
                height: 30,
                width: 30,
                borderRadius: 15,
                backgroundColor: isPro ? 'orange' : undefined,
                borderWidth: 3,
                borderColor: 'orange',
              }}></TouchableOpacity>
            <Text style={{marginLeft: 8, fontWeight: '400'}}>
              PROFFESSIONNEL
            </Text> */}
          </View>
        </View>
        <View
          style={{
            flex: 1,
            width: '90%',

            alignSelf: 'center',
          }}>
          {/* submit button */}

          <ButtonComponent
            onPress={handleSubmit(onSubmit)}
            container={styles.submit}
            //content={{marginTop: 20}}
            //loading={signInMutation.isLoading}
            loading={isLoading}
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

export default AddEnseign;
