import {useNavigation, useRoute} from '@react-navigation/native';
import React, {ReactElement, useEffect, useMemo, useState} from 'react';
import {
  Alert,
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {HeaderAuth} from '../../navigation/stacks/AuthStack';
import {EStatusCourse, ICourse} from '../../types/ICourse';
import Icon from 'react-native-ionicons';
import {colors} from '../../theme/colors';
import {useMutation, useQueryClient} from 'react-query';
import {refuseCourse, acceptCourse} from '../../services/courseAPI';
import ModalComponent from '../../components/ModalComponent';
import {useApi} from '../../hook/useApi';
import BackgroundImpec from '../../components/BackgroundImpec';
import {getCourseAgenda} from '../../services/AgendaAPI';

interface Props {
  data: CourseDetails;
}

interface ListItemProps {
  text: string;
  iconLeft?: any;
  type?: 'tel' | 'adresse';
  actionData?: string;
  child?: ReactElement;
  container?: StyleProp;
}

export const ListItem: React.FC<ListItemProps> = ({
  text,
  iconLeft,
  type,
  actionData,
  child,
  container,
}) => {
  const handlePress = () => {
    if (type === 'tel') {
      Linking.openURL(`tel:${actionData}`);
    } else if (type === 'adresse') {
      if (Platform.OS === 'android') {
        Linking.openURL(`geo:0,0?q=${actionData}`);
      } else if (Platform.OS === 'ios') {
        Linking.openURL(`http://maps.apple.com/?address=${actionData}`);
      }
    }
  };

  return (
    <View
      style={{
        padding: 10,
        backgroundColor: colors.primary,
        borderRadius: 10,
        ...container,
      }}>
      {child}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={handlePress}>
        {iconLeft && <Icon name={iconLeft} color={colors.success} />}
        <Text
          style={{
            marginLeft: 10,
            fontWeight: '600',
            fontSize: 16,
            color: colors.white,
          }}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const TextFormat = ({placeholder, title, styles, placeholderStyles}) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <Text style={{fontSize: 18, fontWeight: '600', ...placeholderStyles}}>
        {placeholder} :
      </Text>
      <Text style={{fontSize: 18, marginLeft: 10, ...styles}}>{title}</Text>
    </View>
  );
};

const DetailsRide: React.FC = () => {
  const route = useRoute();
  const {
    data,
    isWaitingRide,
    isAcceptedRide,
    showEditButton,
  }: {
    data: ICourse;
    isWaitingRide?: boolean | undefined;
    isAcceptedRide?: boolean | undefined;
    showEditButton?: boolean | undefined;
  } = route.params;
  const navigation = useNavigation();
  const [selectedDelay, setSelectedDelay] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  const {API} = useApi();

  useEffect(() => {
    console.log(' ***  ***', JSON.stringify(data.id, null, 2));
  }, []);

  const handleDelayChange = delay => {
    setSelectedDelay(delay);
  };

  const handleRelance = () => {
    const _relanceTask = async () => {
      try {
        const result = await API.refuseCourse(data);

        if (result?.data?.response) {
          Alert.alert('Informations', 'Course relancée avec succès');
          navigation.goBack();
        }
        return result?.data;
      } catch (error) {
        console.log(' *** error ***', error);
      }
    };

    Alert.alert(
      'Relancer une course',
      'Êtes-vous sûr de vouloir relancer la course ? Pénalités ! Au bout de 3 relances, votre compte se désactivera temporairement',
      [
        {
          text: 'Confirmer',
          onPress: () => _relanceTask(),
        },
        {
          text: 'Annuler',
          onPress: () => {},
        },
      ],
    );
  };

  const handleRetard = () => {
    setShowModal(!showModal);
  };

  const actionsAccepted = [
    {
      text: 'Retard',
      onPress: () => handleRetard(),
    },
    {
      text: 'Relancer',
      onPress: () => handleRelance(),
    },
    {
      text: 'Lancer GPS',
      onPress: () => {},
    },
    {
      text: 'Client déposé',
      onPress: () => navigation.navigate('DepositedCustomer', {data}),
    },
  ];

  const acceptCourseRequest = async () => {
    try {
      const result = await API.acceptCourse(data);
      return result?.data;
    } catch (error) {
      console.log(' *** error ***', error);
    }
  };

  const acceptCourseMutation = useMutation(acceptCourseRequest);
  const {
    isLoading,
    isError,
    isSuccess,
    data: dataAccept,
    error: errorAccept,
  } = acceptCourseMutation;

  useEffect(() => {
    if (!dataAccept?.response && dataAccept?.msg) {
      Alert.alert('Informations', dataAccept?.msg);
    } else if (dataAccept?.response && !dataAccept?.msg) {
      Alert.alert('Informations', 'Cette course vous est attribuée', [
        {
          text: 'Valider',
          onPress: () => {},
        },
      ]);
    }
  }, [dataAccept]);

  useEffect(() => {
    if (!errorAccept?.response && errorAccept?.msg) {
      Alert.alert('Informations', errorAccept?.msg);
    }
  }, [errorAccept]);

  const handleAcceptCourse = () => {
    Alert.alert(
      'Accepter une course',
      'Êtes-vous sûr de vouloir accepter la course',
      [
        {
          text: 'Annuler',
          onPress: () => {},
        },
        {
          text: 'Valider',
          onPress: () => {
            acceptCourseMutation.mutate();
          },
        },
      ],
    );
  };

  const queryRetard = async data => {
    try {
      const result = await API.addRetardCourse(data);
      return result?.data;
    } catch (error) {
      console.log(' *** error addRetardCourse ***', error);
    }
  };

  const addRetardCourse = useMutation(queryRetard);
  const {isLoading: loadingLate, data: dataRetard} = addRetardCourse;

  useEffect(() => {
    if (dataRetard?.response == true && !dataRetard?.msg) {
      setShowModal(!showModal);
      Alert.alert('Information', 'Notification de retard envoyée avec succès');
    } else if (dataRetard?.response == false) {
      Alert.alert('Attention', dataRetard?.msg);
    }
  }, [dataRetard]);

  const handleSend = () => {
    data.duree = selectedDelay;
    //console.log(' *** selectedDelay ***', selectedDelay);

    addRetardCourse.mutate(data);
  };

  const ImageType = useMemo(() => {
    let image = null;
    let vehicule = '';
    if (data?.proposer_a?.[0] == 'TPMR') {
      image = require('../../assets/tpmr.png');
      vehicule = 'Transport à mobilité réduite';
    } else if (data?.proposer_a?.[0] == 'AMBULANCE') {
      image = require('../../assets/ambulance.png');
      vehicule = 'Ambulance';
    } else if (data?.proposer_a?.[0] == 'TAXI') {
      image = require('../../assets/taxi_vsl.png');
      vehicule = 'Taxi';
    } else if (data?.proposer_a?.[0] == 'MONOSPACE') {
      image = require('../../assets/van.png');
      vehicule = 'Monospace';
    } else if (data?.proposer_a?.[0] == 'BERLINE') {
      image = require('../../assets/berline_skoda.png');
      vehicule = 'Berline';
    } else if (data?.proposer_a?.[0] == 'VAN') {
      image = require('../../assets/van.png');
      vehicule = 'Van';
    } else if (data?.proposer_a?.[0] == 'BREAK') {
      image = require('../../assets/break.png');
      vehicule = 'Break';
    }

    if (image === null) {
      return <></>;
    }

    return (
      <View style={{}}>
        <Text style={{fontWeight: '700', fontSize: 20}}>{vehicule}</Text>
        <Image
          resizeMode="center"
          style={{width: 120, height: 120}}
          source={image}
        />
      </View>
    );
  }, [data?.proposer_a?.[0]]);

  const handleDeleteCourse = (data: ICourse) => {
    const _deleteTask = () => {
      const courseId = data?.id;
      try {
        const res = API.deleteCourse({
          course: courseId,
        });
        navigation.navigate('Home');
        queryClient.invalidateQueries('proposed');
        Alert.alert('Informations', 'Course  supprimée avec succès');
      } catch (error) {
        console.log(' *** error delete course ***', error);
      }
    };
    Alert.alert(
      'Informations',
      'Êtes-vous sûr de vouloir supprimer votre course',
      [
        {
          text: 'OUI',
          onPress: () => _deleteTask(),
        },
        {
          text: 'NON',
          onPress: () => {},
        },
      ],
    );
  };

  const handleEditCourse = async (course: any) => {
    return navigation.navigate('AddCourseForm', {
      course: course,
      isOffline: false,
      agendaCourseId: null,
    });
  };

  return (
    <BackgroundImpec>
      <HeaderAuth title="Détails de la course" />
      <ScrollView>
        <ModalComponent
          isCustome
          isOpen={showModal}
          onRequestClose={() => {}}
          buttonText={"J'ai compris"}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Retard estimé :</Text>

            <View style={styles.delayButtonsContainer}>
              {[5, 10, 20].map(delay => (
                <TouchableOpacity
                  key={delay}
                  style={[
                    styles.delayButton,
                    selectedDelay === delay && styles.selectedDelayButton,
                  ]}
                  onPress={() => handleDelayChange(delay)}>
                  <Text style={styles.delayButtonText}>{delay} min</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleSend()}>
              <Text style={styles.modalButtonText}>
                {'Envoyer la notification'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, {backgroundColor: 'transparent'}]}
              onPress={() => setShowModal(!showModal)}>
              <Text style={[styles.modalButtonText, {color: '#000000'}]}>
                Fermer
              </Text>
            </TouchableOpacity>
          </View>
        </ModalComponent>
        <View style={styles.card}>
          {ImageType}
          <View style={{}}>
            <Text style={{fontSize: 18, fontWeight: '700'}}>
              Date de prise en charge
            </Text>
            <Text style={{fontSize: 16, marginTop: 10}}>
              {data.date_prisecharge_display}
            </Text>
          </View>
          <View style={{marginVertical: 2}}>
            <Text style={{fontSize: 18, fontWeight: '700'}}>
              Lieu de prise en charge
            </Text>
            <Text style={{fontSize: 16, marginTop: 10}}>
              {data?.lieu_prise_encharge?.adresse}
            </Text>
          </View>
          <TextFormat
            placeholder={'Code de la course'}
            title={data.code_course}
          />
          <TextFormat placeholder={'Heure'} title={data?.heure_prisecharge} />

          <ListItem
            type="tel"
            actionData={data.taxi_tel}
            child={
              <View style={{marginVertical: 10}}>
                <TextFormat
                  placeholder={'Chauffeur'}
                  title={data.taxi_nom_prenom}
                  styles={{color: colors.white}}
                  placeholderStyles={{color: colors.white}}
                />
              </View>
            }
            text={`Chauffeur : ${data.taxi_tel}`}
            iconLeft="call"
          />
          <View style={{gap: 10}}>
            <View style={{flex: 1}}>
              <TextFormat
                placeholder={'Distance'}
                title={data.estimated_distance}
              />
            </View>
            <View style={{flex: 1, flexDirection: 'row'}}>
              {/* <TextFormat placeholder={'Délai'} title={data.estimated_duree} /> */}
              <Text style={{fontWeight: '600', fontSize: 18}}>Délai :</Text>
              <Text style={{flex: 1}}> {data?.estimated_duree}</Text>
            </View>
          </View>
          {data?.etat_course === EStatusCourse.ACCEPTED && (
            <ListItem
              type="tel"
              actionData={data.client_tel}
              text={`Client : ${data.client_tel}`}
              iconLeft="call"
            />
          )}

          <Text style={{fontWeight: '600', fontSize: 18}}>
            Destination: {data?.destination_prise_encharge?.adresse}
          </Text>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              backgroundColor: colors.primary,
              borderRadius: 10,
            }}>
            <Icon name={'marker'} color={colors.success} />
            <Text
              style={{
                marginLeft: 10,
                fontWeight: '600',
                fontSize: 18,
                color: colors.white,
              }}>
              {'Remarques : '} {data?.remarques}
            </Text>
          </TouchableOpacity>

          {showEditButton && (
            <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  handleEditCourse(data);
                }}
                style={[styles.button, {backgroundColor: colors.success}]}>
                <Text style={{fontSize: 14, color: '#ffffff'}}>Modifier</Text>
              </TouchableOpacity>
              {/* refused */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleDeleteCourse(data)}
                style={[styles.button, {backgroundColor: colors.error}]}>
                <Text style={{fontSize: 14, color: '#ffffff'}}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}
          {isWaitingRide && (
            <View style={{flexDirection: 'row', gap: 10}}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleAcceptCourse}
                style={[styles.button, {backgroundColor: colors.success}]}>
                <Text style={{fontSize: 14, color: '#ffffff'}}>Accepter</Text>
              </TouchableOpacity>
              {/* refused */}
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  //
                }}
                style={[styles.button, {backgroundColor: colors.error}]}>
                <Text style={{fontSize: 14, color: '#ffffff'}}>Refuser</Text>
              </TouchableOpacity>
            </View>
          )}
          {data?.etat_course === 'ACCEPTED' && (
            <>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 10}}>
                {actionsAccepted?.map(item => {
                  return (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={item.onPress}
                      style={[
                        styles.buttonAccepted,
                        {backgroundColor: colors.primary},
                      ]}>
                      <Text style={{fontSize: 16, color: '#ffffff'}}>
                        {item.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </BackgroundImpec>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    marginHorizontal: 20,
    marginTop: 8,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    height: 42,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  buttonAccepted: {
    height: 42,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalMessage: {
    marginTop: 10,
    color: '#000000',
  },
  delayTitle: {
    marginTop: 20,
    fontSize: 14,
    fontWeight: 'bold',
  },
  delayButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    padding: 10,
  },
  delayButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
  },
  selectedDelayButton: {
    backgroundColor: '#2196f350',
  },
  delayButtonText: {
    color: '#000',
  },
  modalButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: colors.blue,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#fff',
  },
});

export default DetailsRide;
