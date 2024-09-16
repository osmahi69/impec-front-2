import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {Calendar} from 'react-native-calendars'; // Assurez-vous d'avoir installé cette bibliothèque
import Icon from 'react-native-ionicons';
import {useApi} from '../hook/useApi';
import {DateTime} from 'luxon';

import {EStatusCourse} from '../types/ICourse';
import {colors} from '../theme/colors';
import {MarkingProps} from 'react-native-calendars/src/calendar/day/marking';
import BottomSheet from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheet/BottomSheet';

interface ICalendarProps {
  isVisible: boolean;
  onClose: () => void;
  onDayPress: () => void;
  markedDates: any;
  isLoading: boolean;
  type_course: EStatusCourse;
  subtype_course: EStatusCourse;
  calendar_month: any;
}

const optionsDateSelected: MarkingProps = {
  selected: true,
  disableTouchEvent: false,
  selectedColor: colors.blue,
  selectedTextColor: colors.white,
  type: 'dot',
};

type DateOptionsMap = {
  [date: string]: MarkingProps;
};

const CalendarBottomSheet = (props: ICalendarProps) => {
  const {
    isVisible,
    onClose,
    onDayPress,

    isLoading,
    type_course,
    subtype_course,
    calendar_month,
  } = props || {};
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {API} = useApi();
  const [markedDates, setMarkedDates] = useState<DateOptionsMap>({});
  const [monthSelected, setMonthSelected] = useState();

  const fetchCalendrierData = async () => {
    try {
      const result = await API.getCourseAgenda({
        type_course,
        subtype_course,
        calendar_month: monthSelected,
      });
  
      if (result?.data?.response) {
        const {data: dataCalendar} = result?.data;

        const dateMarked = {};
        dataCalendar.forEach(item => {
          const day = item.day.length === 1 ? `0${item.day}` : item.day;
          const month = item.month.length === 1 ? `0${item.month}` : item.month;
          const date = `${item.year}-${month}-${day}`;
          dateMarked[date] = optionsDateSelected;
        });
        setMarkedDates(dateMarked);
      }
      return result.data;
    } catch (error) {
      console.log(' *** error read user ***', error);
    }
  };

  useEffect(() => {
    if (monthSelected) fetchCalendrierData();
  }, [monthSelected]);

  const handleChangeMonth = date => {
    const dateTime = DateTime.fromISO(date?.dateString);
    const month = dateTime.toFormat('yyyy-MM');
    setMonthSelected(month);
  };

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef?.current?.present();
      setMonthSelected(calendar_month);
    }
  }, [isVisible, markedDates, calendar_month]);

  const handleDayPress = (event: any) => {
    onDayPress(event);
    bottomSheetRef?.current?.close()
  };

  return (
    <BottomSheetModal
      {...props}
      ref={bottomSheetRef}
      index={1}
      snapPoints={['20%', '70%']}
      onChange={onClose}
      //enablePanDownToClose={false}
      backgroundComponent={({style}) => (
        <View style={[style, styles.overlay]} />
      )}>
      <BottomSheetScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled">
        {isLoading && <ActivityIndicator />}
        {/*  <TouchableOpacity
          onPress={() => bottomSheetRef.current?.close()}
          activeOpacity={0.7}
          style={{
            height: 30,
            width: 30,
            backgroundColor: colors.black,
            borderRadius: 15,
            alignSelf: 'flex-end',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            size={22}
            ios={'close'}
            android={'close'}
            color={colors.white}
          />
        </TouchableOpacity> */}
        <Calendar
          enableSwipeMonths
          style={{marginTop: 20}}
          onDayPress={handleDayPress}
          markedDates={markedDates}
          onMonthChange={date => handleChangeMonth(date)}
          theme={{
            calendarBackground: '#FFF', // Couleur de fond du calendrier
            selectedDayBackgroundColor: 'red', // Couleur de fond du jour sélectionné
            arrowColor: 'red', // Couleur des flèches
            textDisabledColor: '#fff3e0',
            dayTextColor: 'red',
            textDayStyle: {color: '#212121'},
          }}
        />
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(0,0,0,0.5)',
    backgroundColor: '#ffffff',
    borderRadius: 20,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default CalendarBottomSheet;
