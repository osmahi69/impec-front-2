import React, {FC, ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import PropTypes from 'prop-types';
import {colors} from '../theme/colors';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import Icon from 'react-native-ionicons';
import {theme} from '../theme/theme';

type ChildProps = {
  //define props
  navigation?: NavigationProp<ParamListBase>;
  route?: RouteProp<ParamListBase>;
};
const CoverComponent: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  return (
    <View style={{flex: 1, width: '100%', marginTop: 20}}>
      {/*  <Text
      style={{
        fontSize: 12,
        fontFamily: theme.fonts.regular,
        marginTop: 8,
        alignSelf: 'flex-start',
      }}>
      Ajouter une photo de mon institut
    </Text> */}
      <View
        style={{
          height: 145,
          borderRadius: 10,
          borderStyle: 'dashed',
          borderColor: colors.placeholder,
          borderWidth: 1,
          marginTop: 5,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={{}}>
          <Icon name="add" color={colors.main} />
        </View>
      </View>
      <Text
        style={{
          fontSize: 12,
          fontFamily: theme.fonts.regular,
          marginTop: 8,
        }}>
        Ajouter une photo de votre institut 👆🏼
      </Text>
    </View>
  );
};

CoverComponent.propTypes = {};
CoverComponent.defaultProps = {};
export default CoverComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
