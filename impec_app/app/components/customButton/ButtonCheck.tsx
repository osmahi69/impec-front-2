import React, {FC, ReactElement, ReactNode, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextProps,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {colors} from '../../theme/colors';
import Icon from 'react-native-ionicons';

type ChildProps = {
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  title: string;
  textStyle?: TextStyle;
  container?: ViewStyle;
  content?: ViewStyle;
  componentRight?: ReactNode;
  onPress: (value: any) => void;
  componentLeft?: ReactNode;
} & TouchableOpacityProps; // Ajout de tous les props de TouchableOpacity

const ButtonCheck: FC<ChildProps> = ({
  children,
  onPress,
  title,
  textStyle,
  container,
  content,
  componentLeft,
  componentRight,
}): ReactElement => {
  const [isSelect, setIsSelect] = useState(false);

  const handleSelect = () => {
    setIsSelect(!isSelect);
    onPress();
  };
  return (
    <TouchableOpacity
      style={[{flex: 1, borderRadius: 10}, container]}
      activeOpacity={0.7}
      onPress={() => handleSelect()}>
      <View
        style={[
          {
            alignItems: 'center',
            flexDirection: 'row',
            height: 48,
            borderWidth: isSelect ? 2 : undefined,
            borderColor: colors.main,
            borderRadius: 15,
          },
          content,
        ]}>
        <View style={{marginRight: 10}}>{componentLeft}</View>

        <View style={content}>
          <Text style={textStyle}>{title}</Text>
        </View>
        <View
          style={{
            position: 'absolute',
            right: 15,
          }}>
          <View
            style={{
              backgroundColor: isSelect ? colors.main : '#C6C6C6',
              alignItems: 'center',
              justifyContent: 'center',
              height: 24,
              width: 24,
              borderRadius: 10,
            }}>
            <Icon
              size={24}
              ios={'checkmark'}
              android={'checkmark'}
              color={colors.white}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

ButtonCheck.propTypes = {};
ButtonCheck.defaultProps = {};
export default ButtonCheck;

const styles = StyleSheet.create({
  container: {},
});
