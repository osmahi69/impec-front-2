import {useNavigation, useRoute} from '@react-navigation/native';
import {Box, Checkbox, HStack, Stack} from 'native-base';

import React, {FC, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import SvgUri from 'react-native-svg-uri';
import {useMutation, useQueryClient} from 'react-query';
import ButtonAddDoc from '../../components/customButton/ButtonAddDoc';
import ButtonAmbulanceTaxiChoice from '../../components/customButton/ButtonChoiceTaxiAmbulance';
import ButtonComponent from '../../components/customButton/ButtonComponent';
import FormInput from '../../components/customInput/FormInput';
import {UserContext} from '../../contexte/authContext';
import {useApi} from '../../hook/useApi';
import usePickerImage from '../../hook/usePickerImage';
import {HeaderAuth} from '../../navigation/stacks/AuthStack';
import {colors} from '../../theme/colors';
import {theme} from '../../theme/theme';
import {ICourse} from '../../types/ICourse';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-ionicons';
import RenderHTML from 'react-native-render-html';

type FormInputs = {
  idU: string;
  idP: string;
  role: string;
  expiration: string;
  type_vehicule: string[];
  is_taxi_independant: boolean;
  is_deleted: boolean;
  _id: string;
  siret: string;
  societe: string;
  nom: string;
  prenom: string;
  tel_fix: string;
  tel_mobile: string;
  adresse: string;
  commune_rattachement: string;
  num_autorisation_stationnement: string;
  carte_professionnelle: string;
  carte_stationnement: string;
  num_finess: string;
  societe_parent: null | string; // Peut être null ou une chaîne
  __v: number;

  email: string;
};

const Contact: FC = () => {
  const {height} = useWindowDimensions();
  const {width} = useWindowDimensions();
  const [myDocs, setMyDocs] = useState<
    Array<{
      path: string;
      typeDoc: 'stationnement' | 'cartepro';
      public_file: string;
    }>
  >([]);

  const [loading, setLoading] = useState(false);
  const {userInfos} = React.useContext(UserContext);

  const {API} = useApi();
  const navigation = useNavigation();
  const [texte, setTexte] = useState('');
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    watch,
  } = useForm<FormInputs>();

  const load = async () => {
    try {
      const res = await API.texte({typedoc: 'CONTACT'});
      setTexte(res?.data?.data);
    } catch (error) {}
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (userInfos?.userdetails) {
      reset({
        societe: userInfos?.userdetails?.profile?.raison_social,
        nom: userInfos?.userdetails?.profile?.nom,
        prenom: userInfos?.userdetails?.profile?.prenom,
        tel: userInfos?.userdetails?.profile?.tel_mobile,
        email: userInfos?.email,
      });
    }
  }, [userInfos]);

  // Fonction pour gérer la soumission du formulaire
  const contactRequest = async (data: FormInputs) => {
    const formData = {
      nom: data.nom,
      prenom: data.prenom,
      tel: data.tel_mobile,
      email: data.email,
      nomprenom: data.nom + data.prenom,
      sujet: data.sujet,
      message: data.remarque,
    };
    try {
      const result = await API.contactUs(formData);
      return result?.data;
    } catch (error) {
      console.log(' *** error ***', error);
      return error;
    }
  };

  const updateProfil = useMutation(contactRequest);
  const {isLoading, isError, isSuccess, data: data} = updateProfil;

  useEffect(() => {
    if (data?.response) {
      Alert.alert('Informations', 'Votre message a bien été envoyé');
      navigation.goBack();
    }
  }, [data]);

  const onSubmit = async data => {
    updateProfil.mutate(data);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{alignSelf: 'center', marginTop: 20}}>
        <RenderHTML
          contentWidth={width}
          source={{
            html: `${texte}`,
          }}
        />
      </View>
      <HeaderAuth disableBack title="Envoyez nous un message" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
          <FormInput
            name="societe"
            placeholder="Société"
            label="Société"
            control={control}
            //rules={{required: 'Nom du client obligatoire'}}
          />
          <FormInput
            name="nom"
            placeholder="Nom"
            label="Nom"
            control={control}
            rules={{required: 'Le nom est obligatoire'}}
          />

          <FormInput
            name="prenom"
            placeholder="Prénom"
            label="Prénom"
            control={control}
            rules={{required: 'Le prénom est obligatoire'}}
          />

          <FormInput
            name="email"
            placeholder="Email"
            label="Email"
            control={control}
            rules={{required: "L'email est obligatoire"}}
          />

          <FormInput
            name="tel"
            placeholder="Téléphone mobile"
            label="Téléphone mobile"
            control={control}
            rules={{required: 'Le mobile est obligatoire'}}
          />

          <FormInput
            name="sujet"
            placeholder="Sujet"
            label="Sujet"
            control={control}
            rules={{required: 'Le mobile est obligatoire'}}
          />
          <FormInput
            multiline
            numberOfLines={6}
            name="remarque"
            placeholder="Message ..."
            label="Votre message"
            control={control}
            textAlignVertical="top"
            textInputStyle={{
              fontSize: 16,
              padding: 8,
              height: 120,
            }}
            //rules={{required: 'Nom du client obligatoire'}}
          />

          <View
            style={{
              flex: 1,
              width: '90%',
              alignSelf: 'center',
            }}>
            <ButtonComponent
              onPress={handleSubmit(onSubmit)}
              container={styles.submit}
              //content={{marginTop: 20}}
              //loading={signInMutation.isLoading}
              loading={loading}
              title="Valider"
              textStyle={{
                color: colors.white,
                fontFamily: theme.fonts.semiBold,
              }}
            />
          </View>
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
  submit: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    padding: 8,
    height: 48,
    marginTop: 20,
    width: '100%',
    //alignSelf: 'stretch',
  },
});

export default Contact;
