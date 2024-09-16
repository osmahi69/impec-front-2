import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import React, {FC, ReactElement, useCallback, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Calendar, CalendarUtils} from 'react-native-calendars';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {HomeStackParams} from '../../navigation/stacks/HomeStack';
import {colors} from '../../theme/colors';
import {theme} from '../../theme/theme';
import {PeriodsTypes} from '../../types/PeriodsTypes';
import {UserTypes} from '../../types/UserTypes';
import ResumeCardComponent from './ResumeCardComponent';
import SpecialistComponent from './SpecialistComponent';

const hours = [
  '8:00',
  '8:30',
  '9:00',
  '9:30',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
];

const INITIAL_DATE = new Date();
const LINK =
  'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

type ChildProps = {
  //define props
  navigation: NavigationProp<HomeStackParams>;
  route: RouteProp<ParamListBase>;
};
const Appointement: FC<ChildProps> = ({navigation, route}): ReactElement => {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const minDate = new Date();
  const [dateSelected, setDateSelected] = useState<string[]>([]);
  const [periods, setPeriods] = useState<PeriodsTypes>();
  const [selectedIndex, setSeletedIndex] = useState(0);
  const [staffMember, setStaffMember] = useState<UserTypes>();

  //const [selecte, setHours] = useState<string | null>(null);

  const getDate = (count: number) => {
    const date = new Date(INITIAL_DATE);
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  /**
   * Jour qui contient déjà des reservations
   * recupéré depuis la BDD
   */
  const daysWithReservation = {
    '2023-04-04': ['8:30', '9:30', '11:00'],
    '2023-04-19': ['8:00', '9:00', '13:00'],
  };

  /**
   * Update periods
   * Then date change
   */
  const onDayPress = useCallback(day => {
    const d = daysWithReservation[day?.dateString];
    setDateSelected(d);
    setPeriods({
      date: day.dateString,
      hours: periods?.hours,
      index: periods?.index,
    });
    daysWithReservation[day];
    setSelected(day.dateString);
  }, []);

  /**
   * Update periods
   * Then hours change
   * @param h
   */
  const handleAppointment = (h: string, index: number) => {
    setPeriods({date: selected, hours: h, index: index});
  };

  const disabledConfig = {
    disableTouchEvent: false,
    selectedColor: colors.disabled,
    selected: true,
  };

  const disableDates = {
    ...{
      '2023-02-16': {
        ...disabledConfig,
      },
      '2023-04-17': {...disabledConfig},
      '2023-02-18': {...disabledConfig},
      '2023-02-19': {...disabledConfig},
    },
  };
  const marked = useMemo(() => {
    return {
      ...disableDates,
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: colors.main,
        selectedTextColor: colors.white,
      },
    };
  }, [selected]);

  const handleSelectStaff = (staff: UserTypes) => {
    setStaffMember(staff);
  };

  const handleSubmitAppointement = price => {
    const ap = {
      periods,
      staff: staffMember,
      price,
      service: 'Pose UV',
    };
    navigation.navigate('OrderConfirmStep1', ap);
  };

  return (
    <View style={[styles.container, {marginTop: insets.top + 20}]}>
      <ScrollView>
        <View style={{marginHorizontal: '4%'}}>
          {/*  */}
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 16, fontFamily: theme.fonts.semiBold}}>
              Sélectionner votre spécialiste
            </Text>
          </View>
          <SpecialistComponent
            handleSelectStaff={(staff: UserTypes) => handleSelectStaff(staff)}
          />
          <Calendar
            //testID={testIDs.calendars.FIRST}
            enableSwipeMonths
            //current={INITIAL_DATE}
            //minDate={minDate}
            //style={[styles.calendar, {marginTop: 20}]}
            style={[{marginTop: 20}]}
            onDayPress={onDayPress}
            markedDates={marked}
            theme={{
              calendarBackground: colors.orange2,
              selectedDayBackgroundColor: colors.oarange,
              arrowColor: colors.oarange,
              textDisabledColor: '#fff3e0',
              dayTextColor: 'red',
              textDayStyle: {color: '#212121'},
            }}
          />
          <View style={{marginTop: 20}}>
            <Text style={{fontSize: 16, fontWeight: '500'}}>
              A quel heure êtes-vous disponible ?
            </Text>
          </View>
          <ScrollView
            contentContainerStyle={{}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: 10,
              }}>
              {hours.map((h, index) => {
                const disabled =
                  dateSelected?.filter(d => d == h)?.[0] === h?.toString();

                return (
                  <TouchableOpacity
                    activeOpacity={0.5}
                    disabled={disabled}
                    onPress={() => handleAppointment(h, index)}
                    style={[
                      styles.hours,
                      {marginLeft: index !== 0 && 10},
                      disabled && {
                        backgroundColor: colors.disabled,
                        borderColor: colors.disabled,
                        borderWidth: 1,
                      },
                      periods?.index === index && {
                        backgroundColor: colors.main,
                        borderColor: colors.main,
                        borderWidth: 1,
                      },
                    ]}>
                    <Text
                      style={[
                        periods?.index === index && {
                          fontWeight: '700',
                          color: colors.white,
                        },
                        {fontSize: 12},
                        disabled && {
                          color: colors.main,
                          fontWeight: '700',
                        },
                      ]}>
                      {h}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          {/* Resume card */}
          <ResumeCardComponent
            staff={staffMember}
            periods={periods}
            handleSubmitAppointement={handleSubmitAppointement}
          />
        </View>
      </ScrollView>
    </View>
  );
};

Appointement.propTypes = {};
Appointement.defaultProps = {};
export default Appointement;

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
});
