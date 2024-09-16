import React, {FC, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Controller} from 'react-hook-form';
import {theme} from '../../theme/theme';
import {colors} from '../../theme/colors';
import DatePicker from 'react-native-date-picker';
import {DateTime} from 'luxon';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type ChildProps = {
  control?: any;
  name?: string;
  rules?: object;
  placeholder?: string;
  secureTextEntry?: string;
  label?: string;
  labelStyle?: TextStyle;
  placeholderTextColor: string;
  container: ViewStyle;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: any;
};

const FormDatePicker: FC<ChildProps> = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
  label,
  labelStyle,
  placeholderTextColor = colors.placeholder,
  container,
  mode = 'date',
  minimumDate,
}) => {
  //const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const dateNow = new Date();
  const date = DateTime.fromISO(dateNow);

  return (
    <View style={[{flex: 1}, styles.container]}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {onChange, value}}) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setOpen(true)}
            style={[{}, container]}>
            <View pointerEvents={'none'}>
              <Text
                style={[
                  {
                    fontFamily: theme.fonts.regular,
                    marginTop: 15,
                    fontSize: 12,
                  },
                  labelStyle,
                ]}>
                {label}
              </Text>
              <View
                style={[
                  {
                    borderRadius: 10,
                    backgroundColor: colors.textInput,
                    paddingHorizontal: 10,
                    marginVertical: 5,
                  },
                  //container,
                ]}>
                <TextInput
                  placeholder={placeholder}
                  placeholderTextColor={placeholderTextColor}
                  style={styles.input}
                  value={
                    value
                      ? mode == 'date'
                        ? DateTime.fromJSDate(value).toFormat('dd/MM/yyyy')
                        : mode == 'time'
                        ? DateTime.fromJSDate(value).toFormat('HH : mm')
                        : DateTime.fromJSDate(value).toFormat('dd/MM/yyyy')
                      : ''
                  }
                />
              </View>
            </View>
            {Platform.OS == 'android' ? (
              <DateTimePickerModal
                isVisible={open}
                mode={mode}
                onConfirm={date => {
                  setOpen(false);
                  onChange(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
              />
            ) : (
              <DatePicker
                modal
                style={{width: 200}}
                open={open}
                locale="fr"
                date={value || dateNow}
                mode={mode}
                placeholder="select date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                minimumDate={minimumDate}
                onConfirm={date => {
                  setOpen(false);
                  onChange(date);
                }}
                onCancel={() => {
                  setOpen(false);
                }}
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 36,
                  },
                }}
                //onDateChange={onChange}
              />
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    backgroundColor: '#ffffff',
  },
  input: {
    fontFamily: theme.fonts.regular,
    height: 64,
    color: '#000000',
    fontSize:18
  },
});

export default FormDatePicker;
