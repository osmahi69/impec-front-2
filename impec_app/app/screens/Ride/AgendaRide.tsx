import {
  NavigationProp,
  ParamListBase,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {DateTime} from 'luxon';
import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {MarkingProps} from 'react-native-calendars/src/calendar/day/marking';
import Icon from 'react-native-ionicons';
import {useApi} from '../../hook/useApi';
import {HeaderAuth} from '../../navigation/stacks/AuthStack';
import {
  getCourseAgendaCurrentMonth,
  getCourseByDaySelected,
  getCourseById,
} from '../../services/AgendaAPI';
import {colors} from '../../theme/colors';
import {ICourse} from '../../types/ICourse';
import {ERecurrence} from '../../types/RecurenceEnum';
import {ListItem} from './DetailsRide';
import BackgroundImpec from '../../components/BackgroundImpec';
import dayjs from 'dayjs';

// Interface pour le type des éléments de la liste
interface ListItem {
  id: string;
  title: string;
}

type DateOptionsMap = {
  [date: string]: MarkingProps;
};

// Propriétés du composant AgendaRide
interface AgendaRideProps {}

const AgendaRide: React.FC<AgendaRideProps> = ({}) => {
  const {API} = useApi();
  const route = useRoute();

  const {dateEvent} = route.params || {};

  const optionsDateSelected: MarkingProps = {
    selected: true,
    disableTouchEvent: false,
    selectedColor: colors.blue,
    selectedTextColor: colors.white,
    type: 'dot',
  };

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [markedDates, setMarkedDates] = useState<DateOptionsMap>({});
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const [loading, setIsLoading] = useState(false);
  const [courseFilteredByDate, setCourses] = useState([]);

  const getCourseCalendar = async (dateEvent: string) => {
    setIsLoading(true);
    const courses = await getCourseByDaySelected({
      day: dateEvent,
    });

    setCourses(courses?.data);
    setIsLoading(false);
  };

  useEffect(() => {
    getCourseCalendar(dateEvent);
  }, [dateEvent]);

  const showBottomSheet = () => {
    setIsBottomSheetVisible(true);
  };
  const hideBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };
  const [listOfRideProposed, setListOfRideProposed] =
    useState<Array<ICourse>>();

  const handleDayPress = date => {
    setSelectedDate(date?.dateString);
    hideBottomSheet();
  };

  /*   useEffect(() => {
    if (dataAgenda?.data?.length > 0) {
      setListOfRideProposed(dataAgenda?.data);

      let dateMarked = {};

      dataAgenda?.data?.map(item => {
        let d = DateTime.fromFormat(
          item?.date_prisecharge,
          'dd/MM/yyyy',
        ).toFormat('yyyy-MM-dd');

        dateMarked = {
          ...dateMarked,
          [d]: optionsDateSelected,
        };
      });
      setMarkedDates(dateMarked);
    }
  }, [dataAgenda]); */

  const handlePress = phone => {
    Linking.openURL(`tel:${phone}`);
  };

  const reccurenceName = (recurrence: string): ERecurrence | undefined => {
    switch (recurrence) {
      case 'aucun':
        return ERecurrence.aucun;
      case 'daily':
        return ERecurrence.daily;
      case 'weekly':
        return ERecurrence.weekly;
      case 'monthly':
        return ERecurrence.monthly;
      default:
        return undefined;
    }
  };

  const getCourse = async (courseId: any) => {
    try {
      const result = await getCourseById({
        idCourse: courseId,
        full: true,
      });
      return result.data;
    } catch (error) {
      console.log(' *** error read user ***', error);
    }
  };

  const handlePublish = async (course: any) => {
    let agendaCourseId = course?.agendaId;
    navigation.navigate('AddCourseForm', {
      course: course,
      isOffline: true,
      agendaCourseId,
    });
  };

  // Rendu des éléments de la liste
  const renderItem = ({item}: {item: ICourse}) => {
    return (
      <View style={styles.item}>
        {console.log(' *** item ***', JSON.stringify(item, null, 2))}
        {/*  <View style={{marginVertical: 10}}>
          <Text fontSize={18} fontWeight={'semiBold'}>
            Récurence : {reccurenceName(item?.recurence)}
          </Text>
        </View> */}
        <TouchableOpacity
          onPress={() => handlePublish(item)}
          style={{
            padding: 10,
            backgroundColor: colors.success,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 10,
          }}>
          <Text style={{color: '#ffffff'}}>Mettre la course en ligne</Text>
        </TouchableOpacity>
        {item?.client_tel && (
          <ListItem
            type="tel"
            actionData={item?.client_tel}
            text={`Client : ${item?.client_tel}`}
            iconLeft="call"
            container={{marginTop: 10, marginBottom: 20}}
          />
        )}

        <View style={{marginVertical: 10}}>
          <Text fontSize={18} fontWeight={'semiBold'}>
            Heure de prise en charge : {item?.heure_prisecharge}
          </Text>
        </View>

        <TouchableOpacity
          disabled
          /* onPress={() => {
            return navigation.navigate('DetailsRide', {
              data: item,
              showEditButton: true,
            });
          }} */
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Icon
            size={28}
            ios={'navigate'}
            android={'navigate'}
            color={colors.black}
          />
          <View style={{marginLeft: 10}}>
            <Text
              fontSize={14}
              fontWeight={'ligth'}
              numberOfLines={1}
              width={'80%'}>
              {item?.lieu_prise_encharge?.adresse}
            </Text>
            <Text>{item?.date_prisecharge_display}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <BackgroundImpec>
      <HeaderAuth
        title={`${dayjs(dateEvent).locale('fr').format('DD MMMM YYYY')}`}
      />

      <FlatList
        data={courseFilteredByDate}
        renderItem={renderItem}
        ListEmptyComponent={() => {
          return (
            <View
              style={{
                marginHorizontal: 16,
                marginTop: 40,
              }}>
              <Text fontWeight={'semibold'} textAlign={'center'}>
                Vous n'avez pas course {'\n'} Afficher le calendrier pour
                affiner par date
              </Text>
            </View>
          );
        }}
        ListHeaderComponent={() => {
          return (
            <View style={{}}>
              {selectedDate && (
                <Text>
                  <Text fontWeight={'medium'}> Prévu pour le : </Text>
                  {DateTime.fromISO(selectedDate).toFormat('cccc dd MMMM yyyy')}
                </Text>
              )}
            </View>
          );
        }}
        keyExtractor={item => item?.id}
        contentContainerStyle={styles.listContainer}
      />
    </BackgroundImpec>
  );
};

// Styles du composant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 10,
  },
  listContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  item: {
    borderRadius: 15,
    backgroundColor: '#E7E8E9',
    padding: 20,
    marginVertical: 10,
  },
});

export default AgendaRide;
