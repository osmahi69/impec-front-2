import React, {FC, ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';

type ChildProps = {
  //define props
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
};
const PaymentMethod: FC<ChildProps> = (
  {
    /* destructured props */
  },
): ReactElement => {
  return <View style={styles.container}>{/* Add you elements */}</View>;
};

PaymentMethod.propTypes = {};
PaymentMethod.defaultProps = {};
export default PaymentMethod;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
