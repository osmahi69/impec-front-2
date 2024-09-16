import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import React, {FC, ReactElement, useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import {MarkingProps} from 'react-native-calendars/src/calendar/day/marking';
import Icon from 'react-native-ionicons';
import ButtonComponent from '../../components/customButton/ButtonComponent';
import {useApi} from '../../hook/useApi';
import {HeaderAuth} from '../../navigation/stacks/AuthStack';
import {HomeStackParams} from '../../navigation/stacks/HomeStack';
import {
  getCourseAgendaCurrentMonth,
  getCourseAgendaToday,
} from '../../services/AgendaAPI';
import {colors} from '../../theme/colors';
import {theme} from '../../theme/theme';
import {PeriodsTypes} from '../../types/PeriodsTypes';
const {DateTime} = require('luxon');

const INITIAL_DATE = new Date();
const LINK =
  'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

type ChildProps = {
  //define props
  navigation: NavigationProp<HomeStackParams>;
  route: RouteProp<ParamListBase>;
};

const currentDate = DateTime.local();
const currentMonthDate = currentDate.toFormat('yyyy-MM');

const optionsDateSelected: MarkingProps = {
  selected: true,
  disableTouchEvent: false,
  selectedColor: colors.blue,
  selectedTextColor: colors.white,
  type: 'dot',
};

const AgendaScreen: FC<ChildProps> = ({navigation, route}): ReactElement => {
  const [selected, setSelected] = useState('');
  const [periods, setPeriods] = useState<PeriodsTypes>();
  const {API} = useApi();
  const [selectedDate, setSelectedDate] = useState<string | null>(
    currentMonthDate,
  );
  const [markedDates, setMarkedDates] = useState<{} | null>({});
  const [buttonSelected, setButtonSelected] = useState<'day' | 'month'>(
    'month',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [dataCalendar, setDataCalendar] = useState<[] | null>([]);

  const readAgendaCourseMonthy = async () => {
    setIsLoading(true);
    const dataAgenda = await getCourseAgendaCurrentMonth({
      month: selectedDate,
    });
    setIsLoading(false);
    applyDateToCalendar(dataAgenda?.data?.datas);
  };

  useEffect(() => {
    readAgendaCourseMonthy();
  }, []);

  const applyDateToCalendar = (dataAgenda: any) => {
    if (dataAgenda) {
      setDataCalendar(dataAgenda);
      let dateMarked = {};
      dataAgenda.forEach(item => {
        const formattedDate = DateTime.fromISO(item?.momentdateEvent).toFormat(
          'dd/MM/yyyy',
        );
        let d = DateTime.fromFormat(formattedDate, 'dd/MM/yyyy').toFormat(
          'yyyy-MM-dd',
        );
        dateMarked = {
          ...dateMarked,
          [d]: optionsDateSelected,
        };
      });
      setMarkedDates(dateMarked);
    }
  };

  const handleFilter = async (filter: 'day' | 'month') => {
    setButtonSelected(filter);
    if (filter === 'month') {
      setSelectedDate(currentMonthDate);
      readAgendaCourseMonthy();
      return;
    }
    const res = await getCourseAgendaToday();
    applyDateToCalendar(res?.data);
  };

  const handleDayPress = useCallback(
    (date: DateData) => {
      console.log(' *** date.dateString ***', date.dateString);

      let dateISO = DateTime.fromISO(date.dateString);
      let parsedDate = dateISO.toFormat('dd/MM/yyyy');
      const courseFilteredByDate = dataCalendar?.filter(data => {
        const formattedDate = DateTime.fromISO(data?.momentdateEvent).toFormat(
          'dd/MM/yyyy',
        );
        return formattedDate === parsedDate;
      });

      navigation.navigate('AgendaRide', {
        courseFilteredByDate,
        dateEvent: dateISO.toFormat('yyyy-MM-dd'),
      });
    },
    [dataCalendar],
  );

  const handleMonthPress = (date: DateData) => {
    setSelectedDate(date.dateString);
  };

  const actions = [
    {
      key: 'today',
      title: 'Du jour',
    },
    {
      key: 'month',
      title: 'Du mois',
    },
  ];

  return (
    <View style={[styles.container, {}]}>
      <HeaderAuth title="Agenda personnel" />
      <Text
        style={{
          fontSize: 18,
          fontWeight: '400',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Mes courses
      </Text>
      <ScrollView>
        <View style={{marginHorizontal: '4%'}}>
          <View
            style={{
              flex: 1,
              width: '90%',
              alignSelf: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginVertical: 20,
                gap: 20,
              }}>
              {actions.map(btn => {
                return (
                  <TouchableOpacity
                    key={btn.key}
                    onPress={() => handleFilter(btn.key as 'month' | 'day')}
                    style={{
                      backgroundColor:
                        btn.key === buttonSelected
                          ? colors.blue
                          : colors.placeholder,
                      padding: 10,
                      borderRadius: 10,
                      flex: 0.5,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: colors.beige,
                      }}>
                      {btn.title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <ButtonComponent
              onPress={() =>
                navigation.navigate('AddCourseForm', {isAgenda: true})
              }
              container={styles.buttonAddCourse}
              iconLeft={<Icon name={'add-circle'} color={colors.blue} />}
              title="Ajouter une course"
              textStyle={{
                color: colors.blue,
                fontFamily: theme.fonts.semiBold,
              }}
            />
          </View>
          <Calendar
            enableSwipeMonths
            displayLoadingIndicator={isLoading}
            style={[{marginTop: 20}]}
            markedDates={markedDates}
            onDayPress={handleDayPress}
            theme={{
              calendarBackground: colors.orange2,
              selectedDayBackgroundColor: colors.oarange,
              arrowColor: colors.oarange,
              textDisabledColor: '#fff3e0',
              dayTextColor: 'red',
              textDayStyle: {color: '#212121'},
            }}
            onMonthChange={handleMonthPress}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AgendaScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  calendar: {
    width: '100%',
    borderRadius: 10,
    alignSelf: 'center',
  },
  specialistItem: {
    padding: 10,
    borderRadius: 20,
    borderColor: colors.oarange,
    alignItems: 'center',
    width: 140,
    height: 160,
  },
  btnContinued: {
    height: 48,
    width: '90%',
    backgroundColor: colors.oarange,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstname: {
    fontSize: 16,
    color: colors.oarange,
    fontWeight: '600',
    textAlign: 'center',
  },
  poste: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '300',
  },
  hours: {
    padding: 10,
    borderRadius: 20,
    borderColor: colors.oarange,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAddCourse: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 8,
    height: 48,
    marginTop: 20,
    width: '100%',
    //alignSelf: 'stretch',
  },
  button: {
    backgroundColor: colors.blue,
    borderRadius: 10,
    padding: 8,
    height: 48,
    marginTop: 20,
    width: '100%',
    //alignSelf: 'stretch',
  },
});
