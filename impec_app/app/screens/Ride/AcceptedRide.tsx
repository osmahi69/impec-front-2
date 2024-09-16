import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  FlatListProps,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {useQuery} from 'react-query';
import {useApi} from '../../hook/useApi';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {EStatusCourse, ICourse} from '../../types/ICourse';
import Icon from 'react-native-ionicons';
import {colors} from '../../theme/colors';
import CalendarBottomSheet from '../../components/CalendarBottomSheet';
import {DateTime} from 'luxon';
import {MarkingProps} from 'react-native-calendars/src/calendar/day/marking';
import {Button, Text} from 'native-base';

// Interface pour le type des éléments de la liste
interface ListItem {
  id: string;
  title: string;
}

type DateOptionsMap = {};

// Propriétés du composant AcceptedRide
interface AcceptedRideProps {
  isDone?: boolean;
}

const AcceptedRide: React.FC<AcceptedRideProps> = ({isDone}) => {
  const {API} = useApi();

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
  const showBottomSheet = () => {
    setIsBottomSheetVisible(true);
  };
  const hideBottomSheet = () => {
    setIsBottomSheetVisible(false);
  };
  const [listOfRideProposed, setListOfRideProposed] =
    useState<Array<ICourse>>();

  const readAgendaCourse = async () => {
    try {
      const result = await API.getCourseAgenda({
        type_course: EStatusCourse.ACCEPTED,
        subtype_course: EStatusCourse.AVENIR,
        ...(selectedDate ? {date: selectedDate} : {}),
      });
      return result.data;
    } catch (error) {
      console.log(' *** error read user ***', error);
    }
  };

  const userQuery = useQuery('acceptedCourse', readAgendaCourse);

  const {
    data: dataAgenda,
    refetch: refetchRideProposed,
    isRefetching: refetchLoading,
    isLoading,
  } = userQuery;

  const handleDayPress = date => {
    setSelectedDate(date?.dateString);
    hideBottomSheet();
  };

  useEffect(() => {
    refetchRideProposed();
  }, [selectedDate]);

  useEffect(() => {
    if (dataAgenda?.response) {
      setListOfRideProposed(dataAgenda?.data);
      if (dataAgenda?.length > 0) {
        let dateMarked = {};
        dataAgenda?.data?.forEach(item => {
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
    }
  }, [dataAgenda]);

  // Rendu des éléments de la liste
  const renderItem = ({item}: {item: ICourse}) => {
    return (
      <View style={styles.item}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('DetailsRide', {
              data: item,
              isWaitingRide: false,
              isAcceptedRide: true,
            })
          }
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
            <Text fontSize={18} fontWeight={'semiBold'}>
              {item?.heure_prisecharge}
            </Text>
            <Text
              fontSize={14}
              fontWeight={'ligth'}
              numberOfLines={1}
              width={'80%'}>
              {item.lieu_prise_encharge.adresse}
            </Text>
            <Text>{item.date_prisecharge_display}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={listOfRideProposed}
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
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Button
          backgroundColor={colors.primary}
          onPress={showBottomSheet}
          style={{height: 45, width: '90%'}}>
          Afficher le calendrier
        </Button>
        <CalendarBottomSheet
          isVisible={isBottomSheetVisible}
          onClose={hideBottomSheet}
          onDayPress={handleDayPress}
          type_course={EStatusCourse.ACCEPTED}
          subtype_course={EStatusCourse.AVENIR}
          calendar_month={DateTime.local().toFormat('yyyy-MM')}
          markedDates={markedDates}
          isLoading={isLoading || refetchLoading}
        />
      </View>
    </SafeAreaView>
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

export default AcceptedRide;
