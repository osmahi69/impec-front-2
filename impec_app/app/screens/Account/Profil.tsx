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

const options = [
  {
    label: 'Taxi',
    value: 'TAXI_VSL',
  },
  {
    label: 'Ambulance',
    value: 'AMBULANCE',
  },
  {
    label: 'TPMR',
    value: 'TPMR',
  },
  {
    label: 'Break',
    value: 'BREAK',
  },
  {
    label: 'Monospace',
    value: 'MONOSPACE',
  },
  {
    label: 'Berline',
    value: 'BERLINE',
  },
  {
    label: 'Van',
    value: 'VAN',
  },
];

const Profil: FC = () => {
  const {height} = useWindowDimensions();
  const [myDocs, setMyDocs] = useState<
    Array<{
      path: string;
      typeDoc: 'stationnement' | 'cartepro';
      public_file: string;
    }>
  >([]);

  const [loading, setLoading] = useState(false);
  const {userInfos} = React.useContext(UserContext);

  const [duration, setDuration] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);

  const [selectedValues, setSelectedValues] = useState([]);

  const {API} = useApi();
  const route = useRoute();
  const {course}: {course: ICourse} = route.params || {};
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [selectedOptions, setSelectedOptions] = useState<[string]>(['']);

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    watch,
  } = useForm<FormInputs>();

  useEffect(() => {
    const initialSelectedOptions =
      userInfos?.userdetails?.profile?.type_vehicule || [];
    setSelectedOptions(initialSelectedOptions);
  }, []);

  useEffect(() => {
    if (userInfos?.userdetails) {
      reset({
        siret: userInfos?.userdetails?.profile?.siret,
        societe: userInfos?.userdetails?.profile?.raison_social,
        nom: userInfos?.userdetails?.profile?.nom,
        prenom: userInfos?.userdetails?.profile?.prenom,
        tel_fix: userInfos?.userdetails?.profile?.tel_fix,
        tel_mobile: userInfos?.userdetails?.profile?.tel_mobile,
        commune_rattachement:
          userInfos?.userdetails?.profile?.commune_rattachement,
        num_finess: userInfos?.userdetails?.profile?.num_finess,
        num_autorisation_stationnement:
          userInfos?.userdetails?.profile?.num_autorisation_stationnement,
        email: userInfos?.email,
        adresse: userInfos?.userdetails?.profile?.adresse,
      });
    }
  }, [userInfos]);

  // Fonction pour gérer la soumission du formulaire
  const handleUpdateProfil = async (data: FormInputs) => {
    const cartestationnement =
      myDocs.find(doc => doc.typeDoc == 'stationnement')?.public_file || null;
    const cartepro =
      myDocs.find(doc => doc.typeDoc == 'cartepro')?.public_file || null;

    const typeVehicule = new Set(selectedOptions);
    const formData = {
      ...data,
      ...(cartestationnement && {cartestationnement}),
      ...(cartepro && {cartepro}),
      istaxivsl: String(typeVehicule.has('TAXI_VSL')),
      isambulance: String(typeVehicule.has('AMBULANCE')),
      istpmr: String(typeVehicule.has('TPMR')),
      ismonospace: String(typeVehicule.has('MONOSPACE')),
      isberline: String(typeVehicule.has('BERLINE')),
      isvan: String(typeVehicule.has('VAN')),
      isbreak: String(typeVehicule.has('BREAK')),
    };

    try {
      const result = await API.editUser(formData);
      return result?.data;
    } catch (error) {
      console.log(' *** error ***', error);
      return error;
    }
  };

  const updateProfil = useMutation(handleUpdateProfil);
  const {isLoading, isError, isSuccess, data: dataProfil} = updateProfil;

  useEffect(() => {
    if (dataProfil?.response) {
      Alert.alert('Bravo', 'Vos informations ont bien été mise à jour');
      navigation.goBack();
    }
  }, [dataProfil]);

  const onSubmit = async data => {
    updateProfil.mutate(data);
  };

  const handleCheckBoxChange = value => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter(item => item !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleOptionPress = value => {
    if (selectedOptions.includes(value)) {
      // Si la valeur existe déjà dans le tableau, retirez-la
      setSelectedOptions(selectedOptions.filter(item => item !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <HeaderAuth disableBack title="Mon compte" />
      <View style={{alignSelf: 'center'}}>
        <Icon name="contact" color={colors.placeholder} size={60} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            gap: 20,
            marginTop: 20,
            marginLeft: 10,
          }}>
          {options.map((item, index) => {
            const isSelected = selectedOptions.includes(item.value);

            return (
              <View style={{}}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleOptionPress(item.value)}
                  style={{
                    borderWidth: 1,
                    borderColor: '#000',
                    padding: 10,
                    borderRadius: 10,
                    ...(isSelected && {backgroundColor: colors.blue}),
                  }}>
                  <Text
                    style={{
                      fontSize: 12,
                      ...(isSelected && {
                        color: colors.white,
                        fontWeight: '600',
                      }),
                    }}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
        <View style={styles.root}>
          <FormInput
            name="siret"
            placeholder="xxxxxxxxxxx"
            label="N° siret"
            control={control}
            //rules={{required: 'Prénom du client obligatoire'}}
          />
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
            name="tel_fix"
            placeholder="Téléphone fixe"
            label="Téléphone fixe"
            control={control}
            rules={{required: 'Le téléphone est obligatoire'}}
          />

          <FormInput
            name="tel_mobile"
            placeholder="Téléphone mobile"
            label="Téléphone mobile"
            control={control}
            rules={{required: 'Le mobile est obligatoire'}}
          />
          <FormInput
            name="commune_rattachement"
            placeholder="Commune de rattachement"
            label="Commune de rattachement"
            control={control}
            rules={{required: 'La commune obligatoire'}}
          />
          <FormInput
            name="num_finess"
            placeholder="Numéro d'agrément CPAM"
            label="Numéro d'agrément CPAM"
            control={control}
            rules={{required: 'La carte professionnelle est obligatoire'}}
          />

          <FormInput
            name="num_autorisation_stationnement"
            placeholder="Numéro d'autorisation de stationnement"
            label="Numéro d'autorisation de stationnement"
            control={control}
            rules={{required: 'La carte de stationnement est obligatoire'}}
          />

          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              marginTop: 20,
            }}>
            {duration && (
              <View style={{alignItems: 'center', flex: 1}}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                  }}>
                  <SvgUri
                    width="38"
                    height="38"
                    source={require('../../assets/icons/alarm-svg.svg')}
                  />
                </View>
                <Text style={{fontSize: 14, fontWeight: '600'}}>
                  Temps estimé
                </Text>
                <Text style={{fontSize: 14}}>{duration}</Text>
              </View>
            )}
          </View>
          <ButtonAddDoc
            setMyDocs={setMyDocs}
            myDocs={myDocs}
            docType="stationnement"
            title="Télécharger le bon de transport"
          />
          <ButtonAddDoc
            setMyDocs={setMyDocs}
            myDocs={myDocs}
            docType="cartepro"
            title="Télécharger carte professionnel"
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

export default Profil;
