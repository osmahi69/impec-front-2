import React, {FC, ReactElement, useState} from 'react';
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
import {theme} from '../../theme/theme';

type ChildProps = {
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  title: string;
  textStyle?: TextStyle;
  container?: ViewStyle;
  content?: ViewStyle;
} & TouchableOpacityProps; // Ajout de tous les props de TouchableOpacity

const ButtonTextComponent: FC<ChildProps> = ({
  children,
  onPress,
  title,
  textStyle,
  container,
  content,
}): ReactElement => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false); // État de chargement initial à faux

  return (
    <TouchableOpacity
      style={[{}, container]}
      activeOpacity={0.7}
      onPress={onPress}>
      <View style={content}>
        <Text style={[{fontFamily: theme.fonts.regular}, textStyle]}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

ButtonTextComponent.propTypes = {};
ButtonTextComponent.defaultProps = {};
export default ButtonTextComponent;

const styles = StyleSheet.create({
  container: {},
});
