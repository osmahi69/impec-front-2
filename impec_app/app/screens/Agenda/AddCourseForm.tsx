import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {DateTime} from 'luxon';
import {HStack, Radio, Stack, Switch} from 'native-base';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useForm} from 'react-hook-form';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ButtonComponent from '../../components/customButton/ButtonComponent';
import FormDatePicker from '../../components/customInput/FormDatePicker';
import FormInput from '../../components/customInput/FormInput';
import FormInputAddress from '../../components/customInput/FormInputAddress';
import {HeaderAuth} from '../../navigation/stacks/AuthStack';
import {colors} from '../../theme/colors';
import {theme} from '../../theme/theme';
import {useApi} from '../../hook/useApi';
import {useMutation, useQueryClient} from 'react-query';
import usePickerImage from '../../hook/usePickerImage';
import ButtonAddDoc from '../../components/customButton/ButtonAddDoc';
import SvgUri from 'react-native-svg-uri';
import ButtonAmbulanceTaxiChoice from '../../components/customButton/ButtonChoiceTaxiAmbulance';
import {ICourse} from '../../types/ICourse';
import FormInputPhone from '../../components/customInput/FormInputPhone';

import {
  ICountry,
  IPhoneInputRef,
} from 'react-native-international-phone-number';
import {deleteEventAgenda} from '../../services/AgendaAPI';

type FormInputs = {
  clinet: string;
  nom: string;
  prenom: string;
  dateRetour: string;
  timeRetour: string;
  client_phone: string;
  client_lastname: string;
  client_firstname: string;
  date: string;
  time: string;
  remarque: string;
  address: string;
  dateRetour: string;
};

type props = {
  isAgenda?: boolean;
};

const AddCourseForm: FC<props> = ({}) => {
  const {height} = useWindowDimensions();
  const [myDocs, setMyDocs] = useState<
    Array<{
      path: string;
      typeDoc: transport | securite | mutuel | autre;
      public_file: string;
    }>
  >([]);

  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const {pickerOptions} = usePickerImage();
  const [typeCourse, setTypeCourse] = useState('');
  const [recurence, setRecurrence] = useState('');
  const [duration, setDuration] = useState<string | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [isTaxi, setIsTaxi] = useState('true');
  const [isAmbulance, setIsAmbulance] = useState('false');
  const [isTPMR, setIsTPMR] = useState('false');
  const phoneInputRef = useRef<IPhoneInputRef>(null);

  const [isBerline, setIsBerline] = useState('false');
  const [isBreak, setIsBreak] = useState('false');
  const [isVan, setIsVan] = useState('false');
  const [isMonospace, setIsMonospace] = useState('false');
  const [editPhone, setEditPhone] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<undefined | ICountry>(
    undefined,
  );
  const [defaultChoice, setDefaultChoice] = useState<
    | 'Taxi'
    | 'Ambulance'
    | 'tpmr'
    | 'break'
    | 'berline'
    | 'monospace'
    | 'van'
    | null
  >(null);

  const {API} = useApi();
  const route = useRoute();
  const {
    course,
    isAgenda,
    isOffline,
    agendaCourseId,
  }: {course: ICourse; isAgenda: boolean} = route.params || {};
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const [isConventionned, setIsConventionned] = useState(false);
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
    watch,
    setValue,
  } = useForm<FormInputs>();

  const destination = watch('destination');
  const prise_en_charge = watch('prise_en_charge');

  useEffect(() => {
    if (course) {
      console.log(' *** course ***', JSON.stringify(course, null, 2));
      const dateString = course?.date_heure_prise_encharge;
      const dateStringRetour = course?.date_prise_encharge_retour;
      const luxonDate = dateString
        ? DateTime.fromFormat(dateString, 'dd/MM/yyyy HH:mm')
        : null;
      const luxonDateRetour = dateStringRetour
        ? DateTime.fromFormat(dateStringRetour, 'dd/MM/yyyy HH:mm')
        : null;
      const jsDate = luxonDate ? luxonDate.toJSDate() : null;
      //const jsDateRetour = luxonDateRetour ? luxonDateRetour.toJSDate() : null;
      const jsDateRetour = luxonDateRetour ? luxonDateRetour.toJSDate() : null;

      getCalculateDistance(
        {
          address: course?.lieu_prise_encharge?.adresse,
          latitude: course?.lieu_prise_encharge?.gps_coords?.coordinates[0],
          longitude: course?.lieu_prise_encharge?.gps_coords?.coordinates[1],
          zipcode: '',
          city: '',
        },
        {
          address: course?.destination_prise_encharge?.adresse,
          latitude:
            course?.destination_prise_encharge?.gps_coords?.coordinates[0],
          longitude:
            course?.destination_prise_encharge?.gps_coords?.coordinates[1],
          zipcode: '',
          city: '',
        },
      );
      let typeCourse = '';
      if (course?.type_course === 'A') {
        typeCourse = 'CourseAllerRetour.aller';
      } else if (course?.type_course === 'AR') {
        typeCourse = 'CourseAllerRetour.allerretour';
      } else if (course?.type_course === 'R') {
        typeCourse = 'CourseAllerRetour.retour';
      }
      setTypeCourse(typeCourse);

      if (course?.ismonospace) {
        setIsMonospace('true');
        setDefaultChoice('monospace');
        handleChoiceTypeCourse('monospace');
      }
      if (course?.istaxivsl) {
        setIsConventionned(true);
        setIsTaxi('true');
        setDefaultChoice('Taxi');
        handleChoiceTypeCourse('Taxi');
      }
      if (course?.isambulance) {
        setIsAmbulance('true');
        setIsConventionned(true);
        setDefaultChoice('Ambulance');
        handleChoiceTypeCourse('Ambulance');
      }
      if (course?.isvan) {
        setIsVan('true');
        setDefaultChoice('van');
        handleChoiceTypeCourse('van');
      }
      if (course?.isberline) {
        setIsBerline('true');
        setDefaultChoice('berline');
        handleChoiceTypeCourse('berline');
      }

      if (course?.istpmr) {
        setIsTPMR('true');
        setIsConventionned(true);
        setDefaultChoice('tpmr');
        handleChoiceTypeCourse('tpmr');
      }
      if (course?.isbreak) {
        setIsBreak('true');
        setDefaultChoice('break');
        handleChoiceTypeCourse('break');
      }

      if (course?.client_tel) {
        setEditPhone(true);
      }

      const dateHeure = DateTime.fromFormat(
        course?.date_prisecharge + ' ' + course?.heure_prisecharge,
        'dd/MM/yyyy HH:mm',
      );
      const isoFormatted = dateHeure.toJSDate();

      reset({
        client_lastname: course?.client_nom,
        client_firstname: course?.client_prenom,
        remarque: course?.remarques,
        client_phone: course?.client_tel,
        date: jsDate,
        time: isoFormatted,
        prise_en_charge: {
          address: course?.lieu_prise_encharge?.adresse,
          latitude: course?.lieu_prise_encharge?.gps_coords?.coordinates[0],
          longitude: course?.lieu_prise_encharge?.gps_coords?.coordinates[1],
          zipcode: '',
          city: '',
        },
        destination: {
          address: course?.destination_prise_encharge?.adresse,
          latitude:
            course?.destination_prise_encharge?.gps_coords?.coordinates[0],
          longitude:
            course?.destination_prise_encharge?.gps_coords?.coordinates[1],
          zipcode: '',
          city: '',
        },
        ...(course?.heure_prise_encharge_retour && {timeRetour: jsDateRetour}),
        ...(course?.heure_prise_encharge_retour && {dateRetour: jsDateRetour}),
      });
    }
  }, [course]);

  const handleEditPhone = () => {
    setValue('client_phone', '');
    setEditPhone(false);
  };

  /* useEffect(() => {
    if (course) {
      handleChoiceTypeCourse(mappedValues?.[0]);
      setDefaultChoice(mappedValues?.[0]);
      reset({
        client_lastname: course.client_nom,
        client_firstname: course.client_prenom,
        client_phone: course.client_tel,
        remarque: course.remarques,
      });
    } else {
      //reset({client_lastname: '', client_firstname: ''});
    }
  }, [course]); */

  useEffect(() => {
    getCalculateDistance(prise_en_charge, destination);
  }, [destination, prise_en_charge]);

  const getCalculateDistance = async (prise_en_charge, destination) => {
    var originCoords =
      prise_en_charge?.latitude + '|' + prise_en_charge?.longitude;
    var destinationCoords =
      destination?.latitude + '|' + destination?.longitude;
    if (prise_en_charge?.latitude && destination?.latitude) {
      try {
        const result = await API.calculDistanceDelais({
          origin: originCoords,
          destination: destinationCoords,
        });
        const {data} = result?.data;
        if (result?.data?.response) {
          setDistance(data?.distance);
          setDuration(data?.duration);
        }

        return result?.data;
      } catch (error) {
        console.log(' *** error getCalculateDistance ***', error);
      }
    }
  };

  // Fonction pour gérer la soumission du formulaire
  const handleAddCourse = async (data: FormInputs) => {
    const {destination, prise_en_charge} = data;

    const bon_transport =
      myDocs.find(doc => doc.typeDoc == 'transport')?.public_file || null;
    const bon_securite =
      myDocs.find(doc => doc.typeDoc === 'securite')?.public_file || null;
    const bon_mutuel =
      myDocs.find(doc => doc.typeDoc === 'mutuel')?.public_file || null;
    const doc_fiche =
      myDocs.find(doc => doc.typeDoc === 'autre')?.public_file || null;
    const DPER =
      typeCourse === 'CourseAllerRetour.allerretour'
        ? DateTime.fromJSDate(data.dateRetour).toFormat('dd/MM/yyyy')
        : null;
    const HDPER =
      typeCourse === 'CourseAllerRetour.allerretour'
        ? DateTime.fromJSDate(data.timeRetour).toFormat('H:mm').toString()
        : null;
    const phoneFomated = `${editPhone ? '' : selectedCountry?.callingCode} ${
      data?.client_phone
    }`;
    const numeroSansEspaces = phoneFomated.replace(/\s/g, '');
    const formData = {
      client: data.client,
      nom: data.client_lastname,
      prenom: data.client_firstname,
      tel_mobile: numeroSansEspaces, // data.client_phone,
      lieupriseencharge: prise_en_charge?.address,
      lieupriseencharge_coords:
        prise_en_charge?.latitude + prise_en_charge?.longitude,
      lieupriseencharge_coords_lat: prise_en_charge?.latitude,
      lieupriseencharge_coords_lng: prise_en_charge?.longitude,
      lieupriseencharge_codepostal: prise_en_charge?.zipcode || null,
      lieupriseencharge_ville: prise_en_charge?.city,
      destination: destination?.address,
      destination_coords: destination?.latitude + destination?.longitude,
      destination_coords_lat: destination?.latitude,
      destination_coords_lng: destination?.longitude,
      destination_codepostal: destination?.zipcode || '',
      destination_ville: destination?.city,
      date_prise_encharge: DateTime.fromJSDate(data.date).toFormat(
        'dd/MM/yyyy',
      ),
      heure_prise_encharge: DateTime.fromJSDate(data.time)
        //.plus({minutes: 30})
        .toFormat('H:mm')
        .toString(),
      date_prise_encharge_retour: DPER,
      heure_prise_encharge_retour:
        typeCourse === 'CourseAllerRetour.allerretour'
          ? DateTime.fromJSDate(data.timeRetour).toFormat('H:mm').toString()
          : null,
      //recurence: typeCourse,
      estimated_distance: distance,
      estimated_duree: duration,
      remarques: data.remarque,
      istaxivsl: isTaxi,
      isambulance: isAmbulance,
      isbreak: isBreak,
      ismonospace: isMonospace,
      isberline: isBerline,
      istpmr: isTPMR,
      isvan: isVan,
      type_course: typeCourse,
      bon_transport: bon_transport,
      bon_securite: bon_transport,
      bon_mutuel: bon_mutuel,
      doc_fiche: doc_fiche,
      ...(course && isOffline !== true && {courseID: course.id}),
      ...(isAgenda && {recurence}),
    };

    console.log(' *** formData ***', JSON.stringify(formData, null, 2));

    /* const data_temp = {
      nom: 'SA',
      prenom: 'gertrude',
      tel_mobile: '0692223358',
      lieupriseencharge: 'Rue de Paris, 93100 Montreuil, France',
      lieupriseencharge_coords: 51.2819657,
      lieupriseencharge_coords_lat: 48.8562098,
      lieupriseencharge_coords_lng: 2.4257559,
      lieupriseencharge_codepostal: '93100',
      lieupriseencharge_ville: 'Montreuil',
      destination: 'Rue de Rivoli, Paris, France',
      destination_coords: 51.1959401,
      destination_coords_lat: 48.8637441,
      destination_coords_lng: 2.332196,
      destination_codepostal: '97420',
      destination_ville: 'Paris',
      date_prise_encharge: '28/09/2023',
      heure_prise_encharge: '18:30',
      date_prise_encharge_retour: null,
      heure_prise_encharge_retour: null,
      estimated_distance: '11.6 km',
      estimated_duree: '30 mins',
      remarques: '',
      istaxivsl: 'false',
      isambulance: 'false',
      isbreak: 'false',
      ismonospace: 'false',
      istpmr: 'false',
      isberline: 'false',
      isvan: 'true',
      type_course: 'CourseAllerRetour.aller',
      bon_transport: null,
      bon_securite: null,
      bon_mutuel: null,
      doc_fiche: null,
    }; */

    try {
      if (course && isOffline === true) {
        const resultDeleteCourseAgenda = await deleteEventAgenda({
          course: agendaCourseId,
        });
        const result = await API.addCourse(formData);
        return result?.data;
      }
      if (isAgenda) {
        const result = await API.addCourseAgenda(formData);
        return result?.data;
      }
      const result = course
        ? await API.editCourse(formData)
        : await API.addCourse(formData);
      return result?.data;
    } catch (error) {
      console.log(' *** error ***', error);
      return error;
    }
  };

  const addCourseMutation = useMutation(handleAddCourse);
  const {isLoading, isError, isSuccess, data: dataCourse} = addCourseMutation;

  useEffect(() => {
    if (dataCourse?.response == true && !dataCourse?.msg) {
      if (course) {
        Alert.alert('Bravo', 'Votre course a bien été modifié');
        queryClient.invalidateQueries('proposed');

        navigation.navigate('Home');
      } else {
        Alert.alert('Bravo', "Votre course viens d'être créé avec succès");
        navigation.goBack();
      }

      queryClient.invalidateQueries('totNotifications');
    } else if (dataCourse?.response == false) {
      Alert.alert('Attention', dataCourse?.msg);
    }
  }, [dataCourse]);

  const onCreateCourse = useCallback(async data => {
    addCourseMutation.mutate(data);
  }, []);

  const handleChoiceTypeCourse = (
    type:
      | 'Taxi'
      | 'Ambulance'
      | 'tpmr'
      | 'break'
      | 'berline'
      | 'monospace'
      | 'van',
  ) => {
    if (type === 'Taxi') {
      setIsTaxi('true');
      setIsAmbulance('false');
      setIsTPMR('false');
      setIsMonospace('false');
      setIsBerline('false');
      setIsBreak('false');
      setIsVan('false');
    } else if (type === 'Ambulance') {
      setIsTaxi('false');
      setIsAmbulance('true');
      setIsTPMR('false');
      setIsMonospace('false');
      setIsBerline('false');
      setIsBreak('false');
      setIsVan('false');
    } else if (type === 'tmpr') {
      setIsTaxi('false');
      setIsAmbulance('false');
      setIsTPMR('true');
      setIsMonospace('false');
      setIsBerline('false');
      setIsBreak('false');
      setIsVan('false');
    } else if (type === 'break') {
      setIsTaxi('false');
      setIsAmbulance('false');
      setIsTPMR('false');
      setIsMonospace('false');
      setIsBerline('false');
      setIsBreak('true');
      setIsVan('false');
    } else if (type === 'berline') {
      setIsTaxi('false');
      setIsAmbulance('false');
      setIsTPMR('false');
      setIsMonospace('false');
      setIsBerline('true');
      setIsBreak('false');
      setIsVan('false');
    } else if (type === 'monospace') {
      setIsTaxi('false');
      setIsAmbulance('false');
      setIsTPMR('false');
      setIsMonospace('true');
      setIsBerline('false');
      setIsBreak('false');
      setIsVan('false');
    } else if (type === 'van') {
      setIsTaxi('false');
      setIsAmbulance('false');
      setIsTPMR('false');
      setIsMonospace('false');
      setIsBerline('false');
      setIsBreak('false');
      setIsVan('true');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <HeaderAuth title="Proposer une course" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.root}>
          <View
            style={{
              marginBottom: 30,
            }}>
            <ButtonAmbulanceTaxiChoice
              isConventionned={isConventionned}
              onSelectChoice={type => handleChoiceTypeCourse(type)}
              defaultChoice={defaultChoice}
            />
          </View>
          <View style={{alignSelf: 'flex-start'}}>
            <Text style={{fontWeight: '600', fontSize: 16}}></Text>
            <HStack alignItems="center" space={0} marginTop={0}>
              <Switch
                size="lg"
                isChecked={isConventionned}
                onValueChange={value => setIsConventionned(value)}
              />
              <Text style={{fontWeight: '600', marginLeft: 10, fontSize: 18}}>
                Taxi conventionné
              </Text>
            </HStack>
          </View>

          {/* Exemple: */}
          <FormInput
            name="client_firstname"
            placeholder="Prénom du client"
            label="Prénom du client"
            control={control}
            disable
            //rules={{required: 'Prénom du client obligatoire'}}
          />
          <FormInput
            name="client_lastname"
            placeholder="Nom du client"
            label="Nom du client"
            control={control}
            //rules={{required: 'Nom du client obligatoire'}}
          />
          {/* <FormInput
            name="client_phone"
            placeholder="N° de téléphone du client"
            label="N° de téléphone du client"
            control={control}
            rules={{required: 'N° de téléphone du client obligatoire'}}
            keyboardType="phone-pad"
          /> */}
          {editPhone ? (
            <View
              style={{
                marginVertical: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <View style={{}}>
                <Text style={{fontSize: 18, fontWeight: '600'}}>
                  {course?.client_tel}
                </Text>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleEditPhone}
                style={{
                  backgroundColor: colors.blue,
                  padding: 10,
                  borderRadius: 5,
                  marginLeft: 8,
                }}>
                <Text style={{fontSize: 12, color: '#ffffff'}}>Modifier</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FormInputPhone
              name="client_phone"
              placeholder="N° de téléphone du client"
              label="N° de téléphone du client"
              control={control}
              rules={{required: 'N° de téléphone du client obligatoire'}}
              ref={phoneInputRef}
              callbackCountry={(country: ICountry) => {
                setSelectedCountry(country);
              }}
            />
          )}
          <View style={{}}>
            {/* Bloc aller retour */}
            <View style={{marginTop: 30}}>
              <Text
                style={{
                  fontWeight: '600',
                  marginVertical: 15,
                  textAlign: 'center',
                  fontSize: 18,
                }}>
                C'est une course aller retour ?
              </Text>
              <View style={{alignSelf: 'center'}}>
                <Radio.Group
                  name="myRadioGroup"
                  accessibilityLabel="favorite number"
                  value={typeCourse}
                  flexDirection={'row'}
                  flexWrap={'wrap'}
                  onChange={nextValue => {
                    setTypeCourse(nextValue);
                    if (nextValue == 'CourseAllerRetour.allerretour') {
                      Alert.alert(
                        'Informations',
                        'En cochant la case aller/retour\nVous allez générer 2 courses séparées.\nPour les courses avec attente optez pour un aller simple et le spécifier  dans le champ remarques.\nExemple : \n(Course radiothérapie, consultation avec attente,  faire aller/retour)',
                      );
                    }
                  }}>
                  <HStack
                    space={3}
                    justifyContent="flex-start"
                    flexWrap={'wrap'}>
                    <Radio
                      colorScheme="warning"
                      value="CourseAllerRetour.aller"
                      my={1}>
                      Aller
                    </Radio>
                    <Radio
                      colorScheme="warning"
                      value="CourseAllerRetour.allerretour"
                      my={1}>
                      A-R
                    </Radio>

                    <Radio
                      colorScheme="warning"
                      value="CourseAllerRetour.retour"
                      my={1}>
                      Retour
                    </Radio>
                  </HStack>
                </Radio.Group>
              </View>

              {false && (
                <>
                  <Text
                    style={{
                      fontWeight: '600',
                      marginVertical: 15,
                      textAlign: 'center',
                      fontSize: 18,
                    }}>
                    Récurrence de la course ?
                  </Text>
                  <View style={{alignSelf: 'center'}}>
                    <Radio.Group
                      name="myRadioGroup"
                      accessibilityLabel="favorite number"
                      value={recurence}
                      flexDirection={'row'}
                      flexWrap={'wrap'}
                      onChange={nextValue => {
                        setRecurrence(nextValue);
                        if (nextValue == 'CourseAllerRetour.allerretour') {
                          Alert.alert(
                            'Informations',
                            'En cochant la case aller/retour\nVous allez générer 2 courses séparées.\nPour les courses avec attente optez pour un aller simple et le spécifier  dans le champ remarques.\nExemple : \n(Course radiothérapie, consultation avec attente,  faire aller/retour)',
                          );
                        }
                      }}>
                      <HStack
                        space={3}
                        justifyContent="flex-start"
                        flexWrap={'wrap'}>
                        <Radio
                          colorScheme="warning"
                          value="Recurrence.aucun"
                          my={1}>
                          Aucune
                        </Radio>
                        <Radio
                          colorScheme="warning"
                          value="Recurrence.daily"
                          my={1}>
                          Tous les jours
                        </Radio>

                        <Radio
                          colorScheme="warning"
                          value="Recurrence.weekly"
                          my={1}>
                          Toutes les semaines
                        </Radio>
                        <Radio
                          colorScheme="warning"
                          value="Recurrence.monthly"
                          my={1}>
                          Tous les mois
                        </Radio>
                      </HStack>
                    </Radio.Group>
                  </View>
                </>
              )}
            </View>
          </View>

          <FormDatePicker
            name="date"
            placeholder="Date de prise en charge"
            label="Date de prise en charge"
            minimumDate={new Date()}
            control={control}
            rules={{required: 'Date de prise en charge obligatoire'}}
          />
          <FormDatePicker
            name="time"
            mode={'time'}
            placeholder="Heure de prise en charge aller"
            label="Heure de prise en charge"
            control={control}
            rules={{required: 'Heure de prise en charge obligatoire'}}
          />

          {typeCourse === 'CourseAllerRetour.allerretour' && (
            <>
              <FormDatePicker
                name="dateRetour"
                placeholder="Date de prise en charge retour"
                label="Date de prise en charge retour"
                minimumDate={new Date()}
                control={control}
                rules={{required: 'Date de prise en charge obligatoire'}}
              />

              <FormDatePicker
                name="timeRetour"
                mode={'time'}
                placeholder="Heure de prise en charge retour"
                label="Heure de prise en charge retour"
                control={control}
                rules={{required: 'Heure de prise en charge obligatoire'}}
              />
            </>
          )}
          {/* <FormInput
            name="destination"
            placeholder="Destination"
            label="Destination"
            control={control}
            rules={{required: 'Destination obligatoire'}}
          /> */}
          <FormInputAddress
            name="prise_en_charge"
            placeholder="Lieu prise en charge"
            label="Lieu prise en charge"
            control={control}
          />
          <FormInputAddress
            name="destination"
            placeholder="Destination"
            label="Destination"
            control={control}
          />
          <FormInput
            multiline
            numberOfLines={6}
            name="remarque"
            placeholder="Remarque ..."
            label="Ajouter une remarque ici"
            control={control}
            textAlignVertical="top"
            textInputStyle={{
              padding: 8,
              height: 120,
            }}
            //rules={{required: 'Nom du client obligatoire'}}
          />
          {/* 
            estimated_distance: distance,
      estimated_duree: duration,
       */}
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
            {distance && (
              <View style={{alignItems: 'center', flex: 1}}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                  }}>
                  <SvgUri
                    width="35"
                    height="35"
                    source={require('../../assets/icons/distance-svg.svg')}
                  />
                </View>
                <Text style={{fontSize: 14, fontWeight: '600'}}>
                  Distance estimé
                </Text>
                <Text style={{fontSize: 14}}>{distance}</Text>
              </View>
            )}
          </View>
          {/*  <View style={{marginVertical: 40}}>
            <Text style={{fontWeight: '600'}}>Aller/Retour ?</Text>
          </View> */}

          <ButtonAddDoc
            setMyDocs={setMyDocs}
            myDocs={myDocs}
            docType="transport"
            title="Télécharger le bon de transport"
          />
          <ButtonAddDoc
            setMyDocs={setMyDocs}
            myDocs={myDocs}
            docType="securite"
            title="Télécharger le bulletin de situation"
          />
          <ButtonAddDoc
            setMyDocs={setMyDocs}
            myDocs={myDocs}
            docType="mutuel"
            title="Télécharger la mutuelle"
          />
          <ButtonAddDoc
            setMyDocs={setMyDocs}
            myDocs={myDocs}
            docType="autre"
            title="Autres documents"
          />
          <View
            style={{
              flex: 1,
              width: '90%',
              alignSelf: 'center',
            }}>
            <ButtonComponent
              onPress={handleSubmit(onCreateCourse)}
              container={styles.submit}
              //content={{marginTop: 20}}
              //loading={signInMutation.isLoading}
              loading={loading}
              title={isOffline === true ? 'Mettre en ligne' : 'Enregistrer'}
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

export default AddCourseForm;
