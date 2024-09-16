import React, {FC, ReactElement} from 'react';
import {
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  View,
} from 'react-native';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {ParamListBase} from '@react-navigation/routers';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

// Définition du type pour les icônes
type IconType = {
  name: string; // Ajoutez ici les autres props pour personnaliser l'icône (ex: size, color, etc.)
};

// Définition du type pour les props du composant
type ChildProps = {
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
  title: string;
  textStyle?: TextStyle;
  container?: ViewStyle;
  content?: ViewStyle;
  loading: boolean;
  disabled?: boolean;
  iconLeft?: ReactElement<IconType>; // Prop pour l'icône à gauche
  iconRight?: ReactElement<IconType>; // Prop pour l'icône à droite
} & TouchableOpacityProps;

const ButtonComponent: FC<ChildProps> = ({
  children,
  onPress,
  title,
  textStyle,
  container,
  content,
  loading,
  disabled,
  iconLeft, // Récupérer l'icône à gauche
  iconRight, // Récupérer l'icône à droite
}): ReactElement => {
  const insets = useSafeAreaInsets();

  return (
    <TouchableOpacity
      style={[
        container,
        {
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        },
      ]}
      disabled={disabled}
      activeOpacity={0.7}
      onPress={onPress}>
      {loading ? (
        <ActivityIndicator color={'#FFFFFF'} style={{marginRight: 10}} />
      ) : (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {iconLeft && <View style={{marginRight: 5}}>{iconLeft}</View>}
          <Text style={textStyle}>{title}</Text>
          {iconRight && <View style={{marginLeft: 5}}>{iconRight}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

ButtonComponent.propTypes = {};
ButtonComponent.defaultProps = {};
export default ButtonComponent;
