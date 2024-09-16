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

type ChildProps = {
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  title: string;
  textStyle?: TextStyle;
  container?: ViewStyle;
  content?: ViewStyle;
  componentRight?: ReactNode;
  componentLeft?: ReactNode;
} & TouchableOpacityProps; // Ajout de tous les props de TouchableOpacity

const ButtonBase: FC<ChildProps> = ({
  children,
  onPress,
  title,
  textStyle,
  container,
  content,
  componentLeft,
  componentRight,
}): ReactElement => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false); // État de chargement initial à faux

  const handlePress = async () => {
    setLoading(true); // Active l'état de chargement avant d'exécuter la fonction onPress
    await onPress(); // Attend la fin de la fonction onPress avant de désactiver l'état de chargement
    setLoading(false);
  };

  return (
    <TouchableOpacity
      style={[{flex: 1, borderRadius: 10}, container]}
      activeOpacity={0.7}
      onPress={onPress}>
      <View
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            height: 48,
          },
          content,
        ]}>
        <View style={{marginRight: 10}}>{componentLeft}</View>

        <View style={content}>
          <Text style={textStyle}>{title}</Text>
        </View>
        <View style={{marginLeft: 10}}>{componentRight}</View>
      </View>
    </TouchableOpacity>
  );
};

ButtonBase.propTypes = {};
ButtonBase.defaultProps = {};
export default ButtonBase;

const styles = StyleSheet.create({
  container: {},
});
