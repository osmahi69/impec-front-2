import React, {FC, useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextStyle,
  ViewStyle,
  TouchableOpacity,
  TextInputProps,
  KeyboardType,
} from 'react-native';
import {Controller} from 'react-hook-form';
import {theme} from '../../theme/theme';
import {colors} from '../../theme/colors';
import Icon from 'react-native-ionicons';

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
  keyboardType?: KeyboardType;
  multiline?:boolean;
  numberOfLines?:number | undefined;
  textInputStyle?: TextInputProps
  textAlignVertical?: TextInputProps
  disable?:boolean
};

const FormInput: FC<ChildProps> = (props: ChildProps) => {
  const {
    control,
    name,
    rules = {},
    placeholder,
    secureTextEntry,
    label,
    labelStyle,
    placeholderTextColor = colors.placeholder,
    container,
    keyboardType,
    multiline = false,
    numberOfLines = undefined,
    textInputStyle,
    textAlignVertical,
    disable= false
  } = props;
  const [showPassword, setShowPassword] = useState(secureTextEntry);

  const PasswordIcon = useMemo(() => {
    const iconName = showPassword ? 'eye' : 'eye-off';
    return (
      <Icon size={22} ios={iconName} android={iconName} color={colors.black} />
    );
  }, [showPassword]);

  return (
    <View style={[{flex: 1}, styles.container, disable && {display:"none"}]}>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({field: {value, onChange, onBlur}, fieldState: {error}}) => (
          <>
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
              <TextInput
                keyboardType={keyboardType}
                textAlignVertical={textAlignVertical}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor}
                style={[styles.input, textInputStyle]}
                autoCapitalize={'none'}
                secureTextEntry={showPassword}
                multiline={multiline}
                numberOfLines={numberOfLines}
              />
              {secureTextEntry && value && (
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 10,
                  }}>
                  {PasswordIcon}
                </TouchableOpacity>
              )}
            </View>
            {error && (
              <Text style={{color: colors.error, alignSelf: 'stretch'}}>
                {error.message || 'Error'}
              </Text>
            )}
          </>
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
    fontSize:18
  },
});

export default FormInput;
