import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import React, {FC} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {colors} from '../../theme/colors';
import {theme} from '../../theme/theme';

type ChildProps = {
  control?: any;
  name?: string;
  rules?: object;
  placeholder?: string;
  secureTextEntry?: boolean;
  label?: string;
  labelStyle?: TextStyle;
  placeholderTextColor?: string;
  container?: ViewStyle;
};

const FormInputAddress: FC<ChildProps> = ({
  control,
  name,
  rules = {},
  placeholder,
  secureTextEntry,
  label,
  labelStyle,
  placeholderTextColor = colors.placeholder,
  container,
}) => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const {
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
  } = useForm();
  return (
    <View style={[{flex: 1}, styles.container]}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.navigate('SearchAddress', {
                callback: (address: any) => {
                  onChange(address);
                },
              });
            }}>
            <Text
              style={[
                {fontFamily: theme.fonts.regular, marginTop: 15, fontSize: 12},
                labelStyle,
              ]}>
              {label}
            </Text>
            <View
              style={[
                {
                  borderColor: error ? 'red' : '#e8e8e8',
                  borderRadius: 10,
                  backgroundColor: colors.textInput,
                  paddingHorizontal: 10,
                  marginVertical: 5,
                  justifyContent: 'center',
                  
                },
                container,
              ]}>
              <View
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                style={[styles.input]}>
                <Text
                  numberOfLines={1}
                  style={[
                    {fontSize: 18},
                    !value?.address && {color: placeholderTextColor},
                  ]}>
                  {value?.address || 'Adresse'}
                </Text>
              </View>
            </View>
            {error && (
              <Text style={{color: colors.error, alignSelf: 'stretch'}}>
                {error.message || 'Error'}
              </Text>
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
    height: 64,
    color: '#000000',
    fontSize:18,
    justifyContent: 'center',
  },
});

export default FormInputAddress;
