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
import PhoneInput, {
  ICountry,
  IPhoneInputRef,
} from 'react-native-international-phone-number';

type ChildProps = {
  control?: any;
  name?: string;
  rules?: object;
  placeholder?: string;
  label?: string;
  labelStyle?: TextStyle;
  placeholderTextColor?: string;
  container?: ViewStyle;
  ref?: any;
  callbackCountry?: (value: ICountry) => void;
};

const FormInputPhone: FC<ChildProps> = ({
  control,
  name,
  rules = {},
  container,
  placeholder,
  ref,
  callbackCountry,
}) => {
  //const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const dateNow = new Date();
  const date = DateTime.fromISO(dateNow);

  const [selectCountry, setSelectCountry] = useState<null | ICountry>(null);
  const [inputValue, setInputValue] = useState('');

  const handleSelectedCountry = (country: any) => {
    setSelectCountry(country);
  };

  function handleInputValue(phoneNumber: any) {
    setInputValue(phoneNumber);
  }

  return (
    <View style={[{flex: 1}, styles.container]}>
      <Text
        style={[
          {fontFamily: theme.fonts.regular, marginTop: 15, fontSize: 12},
        ]}>
        {placeholder}
      </Text>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {onChange, value}}) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setOpen(true)}
            style={[{}, container]}>
            <View style={{width: '100%', flex: 1}}>
              <PhoneInput
                value={value}
                defaultCountry="FR"
                onChangePhoneNumber={phoneNumber => {
                  handleInputValue(phoneNumber);
                  onChange(phoneNumber);
                }}
                selectedCountry={selectCountry}
                onChangeSelectedCountry={country => {
                  callbackCountry(country);
                  handleSelectedCountry(country);
                }}
                placeholder="ex: 617"
                style={{width: '100%'}}
              />
            </View>
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
    fontSize: 18,
  },
});

export default FormInputPhone;
